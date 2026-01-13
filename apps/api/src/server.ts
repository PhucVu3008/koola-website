import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';

// Routes
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';

export const buildServer = async () => {
  const server = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
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

  // Global error handler
  server.setErrorHandler((error: Error, request, reply) => {
    const { errorHandler } = require('./middleware/errorHandler');
    return errorHandler(error, request, reply);
  });

  return server;
};
