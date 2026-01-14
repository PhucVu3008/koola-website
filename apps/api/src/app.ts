import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { errorHandler } from './middleware/errorHandler';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';

/**
 * Application instance and initialization.
 *
 * This module wires core Fastify plugins needed by the API:
 * - CORS (restrict to frontend origin)
 * - JWT (admin authentication)
 * - Multipart (file uploads)
 * - Rate limit (basic abuse protection)
 * - Route registration (public and admin)
 * - Global error handler (standard error envelope)
 *
 * Notes:
 * - The primary entrypoint used by production is {@link buildServer} in `server.ts`.
 * - This file is kept for compatibility with tooling or alternate bootstraps.
 *
 * Environment variables (recommended):
 * - `CORS_ORIGIN`
 * - `JWT_ACCESS_SECRET`
 * - `PORT`
 */

const app = Fastify({ logger: true });

// Register plugins
export const initializeApp = async () => {
  // CORS
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // JWT
  await app.register(jwt, {
    // IMPORTANT: do not use a static fallback secret in production.
    secret: process.env.JWT_ACCESS_SECRET || 'your-secret-key-change-this',
  });

  // Multipart (file upload)
  await app.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 1000000, // 1MB
      fields: 10,
      fileSize: 10000000, // 10MB
      files: 5,
    },
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  // Routes
  await app.register(publicRoutes, { prefix: '/v1' });
  await app.register(adminRoutes, { prefix: '/v1/admin' });

  // Error handler
  app.setErrorHandler(errorHandler);

  return app;
};

export default app;
