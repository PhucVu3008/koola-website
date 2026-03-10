import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import path from 'path';

// Routes
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import monitoringRoutes from './routes/monitoring';
import { errorHandler } from './middleware/errorHandler';
import { registerRequestTracing } from './monitoring/requestTracing';
import { setupDbPerformanceMonitoring } from './monitoring/dbPerformanceMonitor';

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

  // Static files (serve uploaded media)
  // Note: process.cwd() returns monorepo root (/workspace)
  const uploadsPath = path.join(process.cwd(), 'apps', 'api', 'uploads');
  await server.register(fastifyStatic, {
    root: uploadsPath,
    prefix: '/uploads/',
    decorateReply: false, // Don't add reply.sendFile (avoid conflicts)
  });

  server.log.info(`Static files serving from: ${uploadsPath}`);

  // ==================== Monitoring & Observability ====================
  
  // Setup database performance monitoring (connection pool monitoring, slow queries)
  setupDbPerformanceMonitoring();

  // Register request tracing middleware (correlation IDs, duration tracking)
  registerRequestTracing(server);

  // ==================== Rate Limiting ====================

  // Rate limiting (global default)
  await server.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: Number(process.env.RATE_LIMIT_TIMEWINDOW) || 60000, // 1 minute
  });

  // ==================== Swagger / OpenAPI ====================

  await server.register(swagger, {
    openapi: {
      info: {
        title: 'KOOLA API',
        description: 'KOOLA website API — public & admin endpoints',
        version: '1.0.0',
      },
      servers: [
        { url: '/api', description: 'Production (via Nginx /api/ proxy)' },
      ],
      tags: [
        { name: 'Health', description: 'Health checks & metrics' },
        { name: 'Services', description: 'Public services endpoints' },
        { name: 'Posts', description: 'Public blog posts' },
        { name: 'Pages', description: 'Public CMS pages' },
        { name: 'Jobs', description: 'Public job listings' },
        { name: 'Leads', description: 'Contact form submissions' },
        { name: 'Newsletter', description: 'Newsletter subscriptions' },
        { name: 'Navigation', description: 'Site navigation' },
        { name: 'Site', description: 'Site settings' },
        { name: 'Admin Auth', description: 'Admin authentication' },
        { name: 'Admin Users', description: 'User management' },
        { name: 'Admin Services', description: 'Service management' },
        { name: 'Admin Posts', description: 'Post management' },
        { name: 'Admin Categories', description: 'Category management' },
        { name: 'Admin Tags', description: 'Tag management' },
        { name: 'Admin Leads', description: 'Lead management' },
        { name: 'Admin Newsletter', description: 'Newsletter subscriber management' },
        { name: 'Admin Nav', description: 'Navigation management' },
        { name: 'Admin Site Settings', description: 'Site settings management' },
        { name: 'Admin Pages', description: 'Page management' },
        { name: 'Admin Media', description: 'Media uploads' },
        { name: 'Admin Jobs', description: 'Job management' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // ==================== Routes ====================

  // Monitoring routes (health checks, metrics)
  await server.register(monitoringRoutes);

  // Register application routes
  await server.register(publicRoutes, { prefix: '/v1' });
  await server.register(adminRoutes, { prefix: '/v1/admin' });

  return server;
};
