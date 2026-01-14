import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

/**
 * Global Fastify error handler.
 *
 * Goals:
 * - Ensure every endpoint returns the standard error envelope:
 *   `{ error: { code, message, details? } }`
 * - Convert Zod validation errors into 400 `VALIDATION_ERROR`.
 * - Convert JWT failures into 401 `UNAUTHORIZED`.
 * - Avoid leaking sensitive details in production.
 *
 * Notes on Zod detection:
 * - In monorepos it's possible to load multiple copies of `zod` at runtime.
 *   In that case `instanceof ZodError` can fail, so we also detect by `name`
 *   and `issues`/`errors` shape.
 */
export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

  // Handle Zod validation errors.
  const maybeZodError = error as any;
  const isZod =
    error instanceof ZodError ||
    (maybeZodError?.name === 'ZodError' && Array.isArray(maybeZodError?.issues));

  if (isZod) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: maybeZodError.issues ?? maybeZodError.errors,
      },
    });
  }

  // Handle JWT errors (from `request.jwtVerify()` or token parsing).
  if (error.message.includes('jwt') || error.message.includes('token')) {
    return reply.status(401).send({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }

  // Default error mapping.
  // If a downstream library attaches `statusCode`, honor it.
  const statusCode = (error as any).statusCode || 500;

  return reply.status(statusCode).send({
    error: {
      code: statusCode === 500 ? 'INTERNAL_ERROR' : 'ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An error occurred'
          : error.message,
    },
  });
};
