"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHevyClient = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../errors");
class BaseHevyClient {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.client = axios_1.default.create({
            baseURL: config.baseURL || 'https://api.hevyapp.com',
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupRequestInterceptor();
        this.setupResponseInterceptor();
    }
    setupRequestInterceptor() {
        this.client.interceptors.request.use((config) => {
            config.headers.set('api-key', this.apiKey);
            return config;
        }, (error) => {
            return Promise.reject(new errors_1.NetworkError('Failed to make request', error));
        });
    }
    setupResponseInterceptor() {
        this.client.interceptors.response.use((response) => response, (error) => {
            this.handleError(error);
        });
    }
    handleError(error) {
        if (!error.response) {
            const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
            throw new errors_1.NetworkError(isTimeout ? 'Request timed out' : 'Network error occurred', error);
        }
        const status = error.response.status;
        const responseData = error.response.data;
        switch (status) {
            case 400: {
                const fieldErrors = this.extractFieldErrors(responseData);
                throw new errors_1.ValidationError('Validation failed', fieldErrors);
            }
            case 401:
            case 403:
                throw new errors_1.AuthenticationError('Authentication failed. Please verify your API key.');
            case 404:
                throw new errors_1.NotFoundError('Resource not found');
            case 429: {
                const retryAfter = this.parseRetryAfter(error.response.headers['retry-after']);
                throw new errors_1.RateLimitError(retryAfter);
            }
            default:
                throw new errors_1.HevyAPIError(`HTTP error ${status}`, status, responseData);
        }
    }
    parseRetryAfter(header) {
        if (!header)
            return 5000;
        const seconds = parseInt(header, 10);
        return Number.isNaN(seconds) ? 5000 : seconds * 1000;
    }
    extractFieldErrors(responseData) {
        if (responseData &&
            typeof responseData === 'object' &&
            responseData.errors) {
            const errors = responseData.errors;
            if (typeof errors === 'object' && errors !== null) {
                return Object.entries(errors).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {});
            }
        }
        return undefined;
    }
    async request(options) {
        try {
            const response = await this.client.request(options);
            return response.data;
        }
        catch (error) {
            if (error instanceof errors_1.HevyAPIError || error instanceof errors_1.NetworkError) {
                throw error;
            }
            throw new errors_1.NetworkError('Unknown error occurred', error);
        }
    }
}
exports.BaseHevyClient = BaseHevyClient;
//# sourceMappingURL=index.js.map