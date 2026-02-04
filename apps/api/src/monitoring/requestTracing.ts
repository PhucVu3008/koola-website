/**
 * Request Tracing Middleware - Distributed tracing and correlation IDs
 * 
 * Features:
 * - Automatic request ID generation (correlation ID)
 * - Request duration tracking
 * - Structured logging with trace context
 * - User context enrichment (user ID, role, IP)
 * - Performance tracking
 * - Integration with MetricsCollector
 * 
 * HTTP Headers:
 * - `X-Request-ID`: Unique request identifier (generated if not provided)
 * - `X-User-ID`: User ID (extracted from JWT)
 * - `X-Response-Time`: Request duration in milliseconds (added to response)
 * 
 * Usage:
 * ```ts
 * import { requestTracingMiddleware } from './monitoring/requestTracing';
 * 
 * server.addHook('onRequest', requestTracingMiddleware);
 * ```
 * 
 * Log Format:
 * ```json
 * {
 *   "requestId": "uuid-v4",
 *   "method": "GET",
 *   "url": "/api/services",
 *   "statusCode": 200,
 *   "duration": 45.3,
 *   "userId": 123,
 *   "userRole": "admin",
 *   "ip": "192.168.1.1",
 *   "userAgent": "Mozilla/5.0...",
 *   "timestamp": "2026-02-04T12:00:00.000Z"
 * }
 * ```
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { metrics } from './MetricsCollector';

// ==================== Types ====================

export interface TraceContext {
  requestId: string;
  startTime: number;
  userId?: number;
  userRole?: string;
  userEmail?: string;
  ip: string;
  userAgent?: string;
  method: string;
  url: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    trace: TraceContext;
  }
}

// ==================== Helper Functions ====================

/**
 * Generate or extract request ID.
 * 
 * Priority:
 * 1. X-Request-ID header (from upstream service or load balancer)
 * 2. X-Correlation-ID header (alternative naming)
 * 3. Generate new UUID v4
 */
function getRequestId(request: FastifyRequest): string {
  const fromHeader = 
    request.headers['x-request-id'] || 
    request.headers['x-correlation-id'];
  
  if (typeof fromHeader === 'string') {
    return fromHeader;
  }
  
  return randomUUID();
}

/**
 * Extract user context from JWT token (if available).
 * 
 * Assumes JWT payload structure:
 * ```json
 * {
 *   "userId": 123,
 *   "email": "user@example.com",
 *   "role": "admin"
 * }
 * ```
 */
function getUserContext(request: FastifyRequest): {
  userId?: number;
  userRole?: string;
  userEmail?: string;
} {
  try {
    // Check if user is authenticated (JWT decoded by @fastify/jwt)
    const user = (request as any).user;
    
    if (user) {
      return {
        userId: user.userId || user.id,
        userRole: user.role,
        userEmail: user.email,
      };
    }
  } catch {
    // Not authenticated or JWT parsing failed
  }

  return {};
}

/**
 * Extract client IP address.
 * 
 * Priority:
 * 1. X-Forwarded-For header (from reverse proxy/load balancer)
 * 2. X-Real-IP header (from nginx)
 * 3. request.ip (direct connection)
 */
function getClientIp(request: FastifyRequest): string {
  const forwarded = request.headers['x-forwarded-for'];
  
  if (typeof forwarded === 'string') {
    // X-Forwarded-For can be comma-separated list
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp;
  }
  
  return request.ip || 'unknown';
}

/**
 * Get user agent string.
 */
function getUserAgent(request: FastifyRequest): string | undefined {
  const ua = request.headers['user-agent'];
  return typeof ua === 'string' ? ua : undefined;
}

/**
 * Sanitize URL for logging (remove sensitive query params).
 */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'http://localhost');
    
    // Remove sensitive query parameters
    const sensitiveParams = ['token', 'password', 'secret', 'api_key', 'apiKey', 'access_token'];
    
    for (const param of sensitiveParams) {
      if (parsed.searchParams.has(param)) {
        parsed.searchParams.set(param, '[REDACTED]');
      }
    }
    
    return parsed.pathname + parsed.search;
  } catch {
    // If URL parsing fails, return original (likely just a path)
    return url;
  }
}

// ==================== Middleware ====================

/**
 * Request tracing middleware (onRequest hook).
 * 
 * Attaches trace context to request object for use in handlers.
 * 
 * @example
 * ```ts
 * server.addHook('onRequest', requestTracingMiddleware);
 * 
 * // In your handler:
 * server.get('/api/test', async (request, reply) => {
 *   request.log.info({ requestId: request.trace.requestId }, 'Processing request');
 *   // ...
 * });
 * ```
 */
export async function requestTracingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const requestId = getRequestId(request);
  const startTime = Date.now();
  const userContext = getUserContext(request);
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  const url = sanitizeUrl(request.url);

  // Create trace context
  const trace: TraceContext = {
    requestId,
    startTime,
    ...userContext,
    ip,
    userAgent,
    method: request.method,
    url,
  };

  // Attach to request object
  request.trace = trace;

  // Add request ID to response headers (for client-side debugging)
  reply.header('X-Request-ID', requestId);

  // Increment active requests counter
  metrics.incrementActiveRequests();

  // Log request start (structured logging)
  request.log.info({
    event: 'request.start',
    requestId,
    method: request.method,
    url,
    ip,
    userId: userContext.userId,
    userRole: userContext.userRole,
  }, 'Request started');
}

/**
 * Response tracking middleware (onResponse hook).
 * 
 * Records metrics and logs response details.
 * 
 * @example
 * ```ts
 * server.addHook('onResponse', responseTracingMiddleware);
 * ```
 */
export async function responseTracingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.trace) {
    // Trace context not attached (middleware not registered?)
    return;
  }

  const duration = Date.now() - request.trace.startTime;
  const statusCode = reply.statusCode;

  // Add response time header
  reply.header('X-Response-Time', `${duration}ms`);

  // Decrement active requests counter
  metrics.decrementActiveRequests();

  // Record metrics
  metrics.recordHttpRequest(
    request.trace.method,
    request.trace.url,
    statusCode,
    duration
  );

  // Log response (structured logging)
  const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
  
  request.log[logLevel]({
    event: 'request.complete',
    requestId: request.trace.requestId,
    method: request.trace.method,
    url: request.trace.url,
    statusCode,
    duration,
    ip: request.trace.ip,
    userId: request.trace.userId,
    userRole: request.trace.userRole,
  }, `Request completed - ${statusCode} ${duration}ms`);
}

/**
 * Error tracking middleware (onError hook).
 * 
 * Logs errors with full trace context.
 * 
 * @example
 * ```ts
 * server.addHook('onError', errorTracingMiddleware);
 * ```
 */
export async function errorTracingMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply,
  error: Error
): Promise<void> {
  if (!request.trace) {
    return;
  }

  const duration = Date.now() - request.trace.startTime;

  // Log error with full context
  request.log.error({
    event: 'request.error',
    requestId: request.trace.requestId,
    method: request.trace.method,
    url: request.trace.url,
    duration,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
    ip: request.trace.ip,
    userId: request.trace.userId,
    userRole: request.trace.userRole,
  }, `Request error: ${error.message}`);
}

/**
 * Register all tracing middleware hooks.
 * 
 * @example
 * ```ts
 * import { registerRequestTracing } from './monitoring/requestTracing';
 * 
 * const server = Fastify({ ... });
 * registerRequestTracing(server);
 * ```
 */
export function registerRequestTracing(server: any): void {
  server.addHook('onRequest', requestTracingMiddleware);
  server.addHook('onResponse', responseTracingMiddleware);
  server.addHook('onError', errorTracingMiddleware);
}

// ==================== Utility Functions ====================

/**
 * Get trace context from current request.
 * Use this in service/repository layers when you need trace info.
 * 
 * @example
 * ```ts
 * export async function createLead(request: FastifyRequest, data: LeadData) {
 *   const trace = getTraceContext(request);
 *   
 *   logger.info({ requestId: trace.requestId }, 'Creating lead');
 *   
 *   // ... business logic
 * }
 * ```
 */
export function getTraceContext(request: FastifyRequest): TraceContext | undefined {
  return request.trace;
}

/**
 * Get request ID from current request.
 * 
 * @example
 * ```ts
 * const requestId = getRequestIdFromRequest(request);
 * logger.info({ requestId }, 'Processing...');
 * ```
 */
export function getRequestIdFromRequest(request: FastifyRequest): string | undefined {
  return request.trace?.requestId;
}

/**
 * Create child logger with trace context.
 * Use this to create scoped loggers that automatically include trace info.
 * 
 * @example
 * ```ts
 * const logger = createTracedLogger(request, 'ServiceName');
 * logger.info('Processing request'); // Automatically includes requestId, userId, etc.
 * ```
 */
export function createTracedLogger(request: FastifyRequest, component: string) {
  const trace = request.trace;
  
  if (!trace) {
    return request.log.child({ component });
  }

  return request.log.child({
    component,
    requestId: trace.requestId,
    userId: trace.userId,
    userRole: trace.userRole,
  });
}
