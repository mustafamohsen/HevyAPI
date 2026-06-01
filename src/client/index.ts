import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  AuthenticationError,
  ConfigurationError,
  HevyAPIError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from '../errors';
import { redactSensitiveData, sanitizeError } from '../utils/redaction';

const OFFICIAL_BASE_URL = 'https://api.hevyapp.com';
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export interface HevyClientConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  trustBaseURL?: boolean;
}

export interface RequestOptions extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export abstract class BaseHevyClient {
  protected client: AxiosInstance;
  protected apiKey: string;

  constructor(config: HevyClientConfig) {
    this.apiKey = config.apiKey;
    const baseURL = this.resolveBaseURL(config);
    this.client = axios.create({
      baseURL,
      timeout: config.timeout ?? 30000,
      maxRedirects: 0,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private resolveBaseURL(config: HevyClientConfig): string {
    const baseURL = config.baseURL || OFFICIAL_BASE_URL;
    let parsedBaseURL: URL;

    try {
      parsedBaseURL = new URL(baseURL);
    } catch {
      throw new ConfigurationError('Invalid baseURL. Provide a valid absolute URL.');
    }

    const officialOrigin = new URL(OFFICIAL_BASE_URL).origin;
    if (parsedBaseURL.origin === officialOrigin) {
      return baseURL;
    }

    if (config.trustBaseURL !== true) {
      throw new ConfigurationError(
        'Custom baseURL origins require trustBaseURL: true because the API key will be sent to that origin.',
      );
    }

    const isLoopbackHTTP =
      parsedBaseURL.protocol === 'http:' && LOOPBACK_HOSTS.has(parsedBaseURL.hostname);
    if (parsedBaseURL.protocol !== 'https:' && !isLoopbackHTTP) {
      throw new ConfigurationError(
        'Custom baseURL origins must use HTTPS unless they are trusted HTTP loopback hosts.',
      );
    }

    return baseURL;
  }

  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.set('api-key', this.apiKey);
        return config;
      },
      (error: unknown) => {
        return Promise.reject(
          new NetworkError('Failed to make request', this.sanitizeOriginalError(error)),
        );
      },
    );
  }

  private setupResponseInterceptor(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
      },
    );
  }

  private handleError(error: AxiosError): never {
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
      throw new NetworkError(
        isTimeout ? 'Request timed out' : 'Network error occurred',
        this.sanitizeOriginalError(error),
      );
    }

    const status = error.response.status;
    const responseData = this.sanitizeValue(error.response.data);

    switch (status) {
      case 400: {
        const fieldErrors = this.extractFieldErrors(responseData);
        throw new ValidationError('Validation failed', fieldErrors);
      }
      case 401:
      case 403:
        throw new AuthenticationError('Authentication failed. Please verify your API key.');
      case 404:
        throw new NotFoundError('Resource not found');
      case 429: {
        const retryAfter = this.parseRetryAfter(
          error.response.headers['retry-after'] as string | undefined,
        );
        throw new RateLimitError(retryAfter);
      }
      default:
        throw new HevyAPIError(`HTTP error ${status}`, status, responseData);
    }
  }

  private parseRetryAfter(header?: string): number {
    if (!header) return 5000;
    const seconds = parseInt(header, 10);
    return Number.isNaN(seconds) ? 5000 : seconds * 1000;
  }

  private extractFieldErrors(responseData: unknown): Record<string, string> | undefined {
    if (
      responseData &&
      typeof responseData === 'object' &&
      (responseData as Record<string, unknown>).errors
    ) {
      const errors = (responseData as Record<string, unknown>).errors;
      if (typeof errors === 'object' && errors !== null) {
        return Object.entries(errors as Record<string, unknown>).reduce(
          (acc, [key, value]) => {
            acc[key] = String(this.sanitizeValue(value));
            return acc;
          },
          {} as Record<string, string>,
        );
      }
    }
    return undefined;
  }

  private sanitizeValue(value: unknown): unknown {
    return redactSensitiveData(value, { secrets: [this.apiKey] });
  }

  private sanitizeOriginalError(error: unknown): Error {
    if (error instanceof Error) {
      return sanitizeError(error, { secrets: [this.apiKey] });
    }

    return new Error(String(this.sanitizeValue(error)));
  }

  protected async request<T>(options: RequestOptions): Promise<T> {
    try {
      const response = await this.client.request<T>(options);
      return response.data;
    } catch (error) {
      if (error instanceof HevyAPIError || error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError('Unknown error occurred', this.sanitizeOriginalError(error));
    }
  }
}
