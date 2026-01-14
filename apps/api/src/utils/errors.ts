/**
 * Custom error classes used across controllers/services.
 *
 * These errors are intended to be caught by the global error handler and mapped
 * into the standard error envelope:
 *
 * `{ error: { code, message, details? } }`
 */

/**
 * Base application error.
 *
 * @param statusCode - HTTP status code.
 * @param code - Stable error code for clients.
 * @param message - Safe, user-facing message.
 * @param details - Optional structured details (e.g. validation issues).
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Input validation error.
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

/**
 * 404 - Resource not found.
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
    this.name = 'NotFoundError';
  }
}

/**
 * 401 - Authentication failed or missing.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 - Authenticated but not allowed.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
    this.name = 'ForbiddenError';
  }
}

/**
 * 409 - Conflict (duplicate, constraint violation at the application level).
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, 'CONFLICT', message);
    this.name = 'ConflictError';
  }
}

/**
 * 500 - Internal server error.
 *
 * Prefer throwing unexpected errors directly and letting the global handler map
 * them to 500; use this only when you need to enforce a specific safe message.
 */
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'INTERNAL_ERROR', message);
    this.name = 'InternalError';
  }
}
