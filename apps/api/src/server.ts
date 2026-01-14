import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';

// Routes
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

/**
 * Build and configure the Fastify server.
 *
 * Responsibilities:
 * - Configure request logging and request IDs.
 * - Register core plugins (CORS, JWT, multipart, rate limiting).
 * - Register all public/admin routes.
 * - Register the global error handler early to guarantee consistent errors.
 *
 * Important ordering note:
 * - The error handler is set *before* registering routes/plugins to avoid
 *   falling back to Fastify defaults for early failures (e.g. Zod parse errors).
 *
 * Environment variables (recommended):
 * - `NODE_ENV`
 * - `CORS_ORIGIN`
 * - `JWT_ACCESS_SECRET`
 * - `JWT_ACCESS_EXPIRES_IN`
 * - `MAX_FILE_SIZE`
 * - `RATE_LIMIT_MAX`
 * - `RATE_LIMIT_TIMEWINDOW`
 */
export const buildServer = async () => {
  const server = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
  });

  // Register the error handler as early as possible so we don't fall back to Fastify's default.
  server.setErrorHandler((error, request, reply) => {
    return errorHandler(error as Error, request, reply);
  });

  // CORS
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // JWT
  await server.register(jwt, {
    secret: process.env.JWT_ACCESS_SECRET || 'change-me-in-production',
    sign: {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    },
  });

  // Multipart (file uploads)
  await server.register(multipart, {
    limits: {
      fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    },
  });

  // Rate limiting
  await server.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: Number(process.env.RATE_LIMIT_TIMEWINDOW) || 60000, // 1 minute
  });

  // Health check
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register routes
  await server.register(publicRoutes, { prefix: '/v1' });
  await server.register(adminRoutes, { prefix: '/v1/admin' });

  return server;
};
