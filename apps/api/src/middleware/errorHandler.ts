import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { ErrorCodes, errorResponse } from '../utils/response';
import { isDatabaseError, mapDatabaseError } from '../utils/dbErrorMapper';

/**
 * Global Fastify error handler.
 *
 * Goals:
 * - Ensure every endpoint returns the standard error envelope:
 *   `{ error: { code, message, details? } }`
 * - Convert Zod validation errors into 400 `VALIDATION_ERROR`.
 * - Convert JWT failures into 401 `UNAUTHORIZED`.
 * - Convert database errors into appropriate AppError instances.
 * - Map known application errors (`AppError`) into stable HTTP + error code.
 * - Avoid leaking sensitive details in production.
 */
export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log error with full request context
  request.log.error({
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    requestId: request.id,
    userId: (request.user as any)?.id,
    method: request.method,
    url: request.url,
    query: request.query,
    // Sanitize body to avoid logging passwords/tokens
    body: sanitizeBody(request.body),
  });

  // 1) Zod validation errors -> 400 VALIDATION_ERROR.
  const maybeZodError = error as any;
  const isZod =
    error instanceof ZodError ||
    (maybeZodError?.name === 'ZodError' && Array.isArray(maybeZodError?.issues));

  if (isZod) {
    return reply
      .status(400)
      .send(
        errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Invalid request data',
          maybeZodError.issues ?? maybeZodError.errors
        )
      );
  }

  // 2) Database errors -> map to AppError.
  if (isDatabaseError(error)) {
    const appError = mapDatabaseError(error);
    return reply
      .status(appError.statusCode)
      .send(
        errorResponse(appError.code, appError.message, appError.details)
      );
  }

  // 3) Known AppError -> map directly.
  if (error instanceof AppError) {
    return reply
      .status(error.statusCode)
      .send(
        errorResponse(
          (error.code as string) || ErrorCodes.INTERNAL_ERROR,
          error.message,
          error.details
        )
      );
  }

  // 4) CORS or infrastructural errors.
  const errAny = error as any;
  if (errAny?.code === 'CORS_NOT_ALLOWED') {
    return reply
      .status(403)
      .send(errorResponse(ErrorCodes.FORBIDDEN, 'CORS origin not allowed'));
  }

  // 5) Fastify JWT errors.
  const jwtErrorCodes = new Set([
    'FST_JWT_NO_AUTHORIZATION_IN_HEADER',
    'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
    'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED',
    'FST_JWT_BAD_REQUEST',
  ]);

  if (typeof errAny?.code === 'string' && jwtErrorCodes.has(errAny.code)) {
    return reply
      .status(401)
      .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Invalid or expired token'));
  }

  // 6) Default: INTERNAL (standard contract).
  const isProd = process.env.NODE_ENV === 'production';

  return reply
    .status(500)
    .send(
      errorResponse(
        'INTERNAL',
        isProd ? 'An error occurred' : error.message
      )
    );
};

/**
 * Sanitize request body for logging.
 * Remove sensitive fields like passwords, tokens, etc.
 *
 * @param body - Request body object
 * @returns Sanitized body safe for logging
 */
const sanitizeBody = (body: any): any => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'api_key', 'apiKey'];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
};
