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
 * Production hardening notes:
 * - In production, secrets must be provided via env (no fallback defaults).
 * - CORS should be a strict allowlist of FE origins.
 * - Global rate-limit is enabled, and sensitive/public form routes apply stricter per-route limits.
 */
export const buildServer = async () => {
  const isProd = process.env.NODE_ENV === 'production';

  const server = Fastify({
    logger: {
      level: isProd ? 'info' : 'debug',
    },
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
  });

  // Register the error handler as early as possible so we don't fall back to Fastify's default.
  server.setErrorHandler((error, request, reply) => {
    return errorHandler(error as Error, request, reply);
  });

  // CORS
  // Supports single origin (CORS_ORIGIN) or comma-separated allowlist (CORS_ORIGINS).
  const corsOriginsRaw =
    process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  const corsAllowlist = corsOriginsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  await server.register(cors, {
    origin: (origin, cb) => {
      // Allow non-browser requests (curl, server-to-server, health checks)
      if (!origin) return cb(null, true);

      const allowed = corsAllowlist.includes(origin);
      if (allowed) return cb(null, true);

      const err: any = new Error('CORS origin not allowed');
      err.statusCode = 403;
      err.code = 'CORS_NOT_ALLOWED';
      return cb(err, false);
    },
    credentials: true,
  });

  // JWT
  // IMPORTANT: never ship default secrets.
  const jwtSecret = process.env.JWT_ACCESS_SECRET;
  if (isProd && (!jwtSecret || jwtSecret.trim().length < 32)) {
    throw new Error(
      'JWT_ACCESS_SECRET must be set in production and should be at least 32 characters'
    );
  }

  await server.register(jwt, {
    secret: jwtSecret || 'dev-only-secret-change-me',
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

  // Rate limiting (global default)
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
