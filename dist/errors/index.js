"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkError = exports.ForbiddenError = exports.RateLimitError = exports.NotFoundError = exports.ValidationError = exports.AuthenticationError = exports.HevyAPIError = void 0;
class HevyAPIError extends Error {
    constructor(message, statusCode, response) {
        super(message);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'HevyAPIError';
    }
}
exports.HevyAPIError = HevyAPIError;
class AuthenticationError extends HevyAPIError {
    constructor(message = 'Authentication failed. Please verify your API key.') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class ValidationError extends HevyAPIError {
    constructor(message = 'Validation failed', fieldErrors) {
        super(message, 400);
        this.fieldErrors = fieldErrors;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends HevyAPIError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class RateLimitError extends HevyAPIError {
    constructor(retryAfter = 5000) {
        super(`Rate limit exceeded. Please retry after ${retryAfter}ms`, 429);
        this.retryAfter = retryAfter;
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
class ForbiddenError extends HevyAPIError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
class NetworkError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
        this.name = 'NetworkError';
    }
}
exports.NetworkError = NetworkError;
//# sourceMappingURL=index.js.map