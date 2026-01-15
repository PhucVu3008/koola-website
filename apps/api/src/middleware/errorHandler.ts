import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { ErrorCodes, errorResponse } from '../utils/response';

/**
 * Global Fastify error handler.
 *
 * Goals:
 * - Ensure every endpoint returns the standard error envelope:
 *   `{ error: { code, message, details? } }`
 * - Convert Zod validation errors into 400 `VALIDATION_ERROR`.
 * - Convert JWT failures into 401 `UNAUTHORIZED`.
 * - Map known application errors (`AppError`) into stable HTTP + error code.
 * - Avoid leaking sensitive details in production.
 */
export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

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

  // 2) Known AppError -> map directly.
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

  // 3) CORS or infrastructural errors.
  const errAny = error as any;
  if (errAny?.code === 'CORS_NOT_ALLOWED') {
    return reply
      .status(403)
      .send(errorResponse(ErrorCodes.FORBIDDEN, 'CORS origin not allowed'));
  }

  // 4) Fastify JWT errors.
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

  // 5) Default: INTERNAL (standard contract).
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
