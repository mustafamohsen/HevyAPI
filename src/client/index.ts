import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  HevyAPIError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from '../errors';

export interface HevyClientConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface RequestOptions extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export abstract class BaseHevyClient {
  protected client: AxiosInstance;
  protected apiKey: string;

  constructor(config: HevyClientConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseURL || 'https://api.hevyapp.com',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.set('api-key', this.apiKey);
        return config;
      },
      (error: unknown) => {
        return Promise.reject(new NetworkError('Failed to make request', error as Error));
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
        error as Error,
      );
    }

    const status = error.response.status;
    const responseData = error.response.data;

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
            acc[key] = String(value);
            return acc;
          },
          {} as Record<string, string>,
        );
      }
    }
    return undefined;
  }

  protected async request<T>(options: RequestOptions): Promise<T> {
    try {
      const response = await this.client.request<T>(options);
      return response.data;
    } catch (error) {
      if (error instanceof HevyAPIError || error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError('Unknown error occurred', error as Error);
    }
  }
}
