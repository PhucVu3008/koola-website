import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/authService';
import { LoginInput } from '../schemas/auth.schemas';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';
import { loginSchema, refreshTokenSchema } from '../schemas';
import { recordAttempt } from '../middleware/ipBlocking';

/**
 * POST `/v1/admin/auth/login`
 *
 * Authenticate an admin user.
 *
 * Inputs (body):
 * - `email` (required, valid email)
 * - `password` (required, min length per `loginSchema`)
 *
 * Response (200):
 * ```json
 * {
 *   "data": {
 *     "accessToken": "...",
 *     "refreshToken": "...",
 *     "user": { "id": "1", "email": "admin@koola.com", "full_name": "...", "roles": [{"id":1,"name":"admin"}] }
 *   }
 * }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` for invalid body
 * - 401 `UNAUTHORIZED` for invalid credentials
 */
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const credentials = loginSchema.parse(request.body) as LoginInput;

  const result = await authService.login(credentials, request.server);

  // Record login attempt in database (for IP blocking)
  if (!result.success) {
    // Failed login - record with reason
    await recordAttempt(
      request,
      credentials.email,
      false,
      'INVALID_CREDENTIALS'
    );
    
    return reply
      .status(401)
      .send(errorResponse(ErrorCodes.UNAUTHORIZED, result.message || 'Login failed'));
  }

  // Successful login - record success
  await recordAttempt(
    request,
    credentials.email,
    true
  );

  return reply.send(successResponse(result.data));
};

/**
 * POST `/v1/admin/auth/refresh`
 *
 * Mint a new access token using a refresh token.
 *
 * Inputs (body):
 * - `refreshToken` (required)
 *
 * Response (200):
 * ```json
 * { "data": { "accessToken": "..." } }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` for invalid body
 * - 401 `UNAUTHORIZED` for invalid/revoked/expired refresh token
 */
export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = refreshTokenSchema.parse(request.body);

  const result = await authService.refreshAccessToken(refreshToken, request.server);

  if (!result.success) {
    return reply
      .status(401)
      .send(errorResponse(ErrorCodes.UNAUTHORIZED, result.message || 'Refresh failed'));
  }

  return reply.send(successResponse(result.data));
};

/**
 * POST `/v1/admin/auth/logout`
 *
 * Revoke refresh tokens.
 *
 * Inputs (body):
 * - `refreshToken` (required)
 *
 * Response (200):
 * ```json
 * { "data": { "message": "Logged out successfully" } }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` for invalid body
 */
export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = refreshTokenSchema.parse(request.body);

  await authService.logout(refreshToken, request.server);

  return reply.send(successResponse({ message: 'Logged out successfully' }));
};
