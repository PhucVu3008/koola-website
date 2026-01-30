import { FastifyRequest, FastifyReply } from 'fastify';
import * as loginAttemptRepository from '../repositories/loginAttemptRepository';

/**
 * IP blocking configuration.
 * 
 * Adjust these values to change blocking behavior.
 */
const IP_BLOCK_CONFIG = {
  /** Max failed attempts before blocking */
  MAX_FAILED_ATTEMPTS: 5,
  
  /** Time window to count failed attempts (minutes) */
  ATTEMPT_WINDOW_MINUTES: 5,
  
  /** How long to block IP after exceeding max attempts (seconds) */
  BLOCK_DURATION_SECONDS: 30,
};

/**
 * Middleware to check if an IP is blocked due to too many failed login attempts.
 * 
 * Flow:
 * 1. Extract client IP from request
 * 2. Query DB for failed attempts in last N minutes
 * 3. If attempts >= MAX, check if block duration has passed
 * 4. If still blocked, return 429 with retry-after header
 * 5. If not blocked, continue to login handler
 * 
 * Must be applied to: POST /v1/admin/auth/login
 * 
 * Security:
 * - Block is per-IP, not per-email (prevents account enumeration)
 * - Uses database, not in-memory (works across multiple API instances)
 * - Block duration is fixed (30s), not exponential (prevents permanent lockout)
 * 
 * @example
 * // In routes/admin/auth.ts
 * server.post('/login', {
 *   preHandler: [checkIPBlocking],
 *   handler: authController.login,
 * });
 */
export const checkIPBlocking = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const ipAddress = getClientIP(request);
  const userAgent = request.headers['user-agent'] || 'unknown';

  // Get failed attempts in last N minutes
  const { failed_count } = await loginAttemptRepository.getFailedAttemptsByIP(
    ipAddress,
    IP_BLOCK_CONFIG.ATTEMPT_WINDOW_MINUTES
  );

  // If under threshold, allow request
  if (failed_count < IP_BLOCK_CONFIG.MAX_FAILED_ATTEMPTS) {
    return; // continue to handler
  }

  // IP has exceeded max attempts - check if block duration has passed
  const lastAttempt = await loginAttemptRepository.getLastFailedAttempt(ipAddress);

  if (!lastAttempt) {
    // Edge case: failed_count > 0 but no lastAttempt (data race?)
    // Allow request to proceed
    return;
  }

  const secondsSinceLastAttempt =
    (Date.now() - new Date(lastAttempt.attempted_at).getTime()) / 1000;

  const remainingBlockTime =
    IP_BLOCK_CONFIG.BLOCK_DURATION_SECONDS - secondsSinceLastAttempt;

  // If block duration has passed, allow request
  if (remainingBlockTime <= 0) {
    return;
  }

  // IP is still blocked - reject with 429
  reply.status(429).header('Retry-After', Math.ceil(remainingBlockTime)).send({
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: `Too many failed login attempts. Please try again in ${Math.ceil(remainingBlockTime)} seconds.`,
      details: {
        ip_address: ipAddress,
        blocked_until: new Date(
          new Date(lastAttempt.attempted_at).getTime() +
            IP_BLOCK_CONFIG.BLOCK_DURATION_SECONDS * 1000
        ).toISOString(),
        retry_after_seconds: Math.ceil(remainingBlockTime),
      },
    },
  });
};

/**
 * Helper: Record a login attempt after login handler completes.
 * 
 * Call this from authController after every login attempt.
 * 
 * @param request - Fastify request (to extract IP/user-agent)
 * @param email - Email used in login attempt
 * @param success - Whether login succeeded
 * @param failureReason - Why login failed (optional)
 * 
 * @example
 * // In authController.login
 * await recordAttempt(request, email, false, 'INVALID_PASSWORD');
 */
export const recordAttempt = async (
  request: FastifyRequest,
  email: string,
  success: boolean,
  failureReason?: string
) => {
  const ipAddress = getClientIP(request);
  const userAgent = request.headers['user-agent'] || 'unknown';

  await loginAttemptRepository.recordLoginAttempt(
    email,
    ipAddress,
    userAgent,
    success,
    failureReason
  );
};

/**
 * Helper: Extract client IP from request.
 * 
 * Handles proxies (X-Forwarded-For, X-Real-IP) and direct connections.
 * 
 * Priority:
 * 1. X-Forwarded-For (first IP in comma-separated list)
 * 2. X-Real-IP
 * 3. request.ip (Fastify built-in)
 * 
 * Security note:
 * - If behind a trusted proxy (nginx/cloudflare), X-Forwarded-For is reliable.
 * - If not behind proxy, X-Forwarded-For can be spoofed by client.
 * - For Docker setup, request.ip should work (Docker bridge assigns real IPs).
 * 
 * @param request - Fastify request
 * @returns Client IP address
 */
const getClientIP = (request: FastifyRequest): string => {
  // Check X-Forwarded-For (set by proxies)
  const xForwardedFor = request.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const ips = typeof xForwardedFor === 'string'
      ? xForwardedFor.split(',')
      : xForwardedFor;
    return ips[0].trim();
  }

  // Check X-Real-IP (set by nginx)
  const xRealIP = request.headers['x-real-ip'];
  if (xRealIP && typeof xRealIP === 'string') {
    return xRealIP.trim();
  }

  // Fallback to Fastify's built-in IP detection
  return request.ip;
};

/**
 * Export config for testing/documentation
 */
export { IP_BLOCK_CONFIG };
