export class HevyAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = 'HevyAPIError';
  }
}

export class AuthenticationError extends HevyAPIError {
  constructor(message: string = 'Authentication failed. Please verify your API key.') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends HevyAPIError {
  constructor(
    message: string = 'Validation failed',
    public fieldErrors?: Record<string, string>,
  ) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends HevyAPIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends HevyAPIError {
  constructor(public retryAfter: number = 5000) {
    super(`Rate limit exceeded. Please retry after ${retryAfter}ms`, 429);
    this.name = 'RateLimitError';
  }
}

export class ForbiddenError extends HevyAPIError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}
