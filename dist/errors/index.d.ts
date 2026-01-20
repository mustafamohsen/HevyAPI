export declare class HevyAPIError extends Error {
    statusCode: number;
    response?: unknown | undefined;
    constructor(message: string, statusCode: number, response?: unknown | undefined);
}
export declare class AuthenticationError extends HevyAPIError {
    constructor(message?: string);
}
export declare class ValidationError extends HevyAPIError {
    fieldErrors?: Record<string, string> | undefined;
    constructor(message?: string, fieldErrors?: Record<string, string> | undefined);
}
export declare class NotFoundError extends HevyAPIError {
    constructor(message?: string);
}
export declare class RateLimitError extends HevyAPIError {
    retryAfter: number;
    constructor(retryAfter?: number);
}
export declare class ForbiddenError extends HevyAPIError {
    constructor(message?: string);
}
export declare class NetworkError extends Error {
    originalError?: Error | undefined;
    constructor(message: string, originalError?: Error | undefined);
}
//# sourceMappingURL=index.d.ts.map