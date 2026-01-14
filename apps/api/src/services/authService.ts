import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import * as userRepository from '../repositories/userRepository';
import * as tokenRepository from '../repositories/tokenRepository';
import { LoginInput } from '../schemas';

interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Authenticate an admin user and issue access + refresh tokens.
 *
 * Responsibilities:
 * - verify password using bcrypt
 * - issue JWT access token (short-lived)
 * - issue JWT refresh token (long-lived)
 * - persist a bcrypt hash of the refresh token in `refresh_tokens`
 * - update `users.last_login_at`
 *
 * @param credentials - Validated login input.
 * @param server - Fastify instance (used for JWT signing).
 *
 * @returns ServiceResponse
 * - `success=true`: `{ accessToken, refreshToken, user }`
 * - `success=false`: `message` describing why authentication failed (generic on purpose)
 *
 * @throws Will throw if database operations fail.
 *
 * @example
 * // Controller usage
 * const result = await authService.login({ email, password }, request.server);
 * if (!result.success) reply.status(401).send(...)
 */
export const login = async (
  credentials: LoginInput,
  server: FastifyInstance
): Promise<ServiceResponse> => {
  const { email, password } = credentials;

  // Get user with roles
  const user = await userRepository.findByEmail(email);

  // Avoid leaking which field is incorrect.
  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }

  // Generate tokens
  const accessToken = server.jwt.sign({
    id: user.id,
    email: user.email,
    roles: user.roles,
  });

  const refreshToken = server.jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
  );

  // Hash refresh token and store in DB
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await tokenRepository.createRefreshToken(user.id, refreshTokenHash, expiresAt);

  // Update last login
  await userRepository.updateLastLogin(user.id);

  return {
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_asset_id: user.avatar_asset_id,
        roles: user.roles,
      },
    },
  };
};

/**
 * Validate a refresh token and mint a new access token.
 *
 * Security notes:
 * - Refresh token signature/expiry is validated via `server.jwt.verify`.
 * - The refresh token must also exist in the DB and must not be revoked.
 * - Because bcrypt hashes are salted, we must use `bcrypt.compare` against the stored hash.
 *
 * @param refreshToken - Raw refresh token provided by the client.
 * @param server - Fastify instance (used for verify/sign).
 *
 * @returns ServiceResponse
 * - `success=true`: `{ accessToken }`
 * - `success=false`: message indicating invalid/revoked/expired token
 *
 * @example
 * const { refreshToken } = request.body
 * const result = await authService.refreshAccessToken(refreshToken, request.server)
 */
export const refreshAccessToken = async (
  refreshToken: string,
  server: FastifyInstance
): Promise<ServiceResponse> => {
  try {
    // Verify token signature/expiry
    const decoded = server.jwt.verify(refreshToken) as any;

    // Find latest non-revoked token for this user and compare hashes.
    const tokenRecord = await tokenRepository.findValidRefreshTokenByUserId(decoded.id);

    if (!tokenRecord) {
      return {
        success: false,
        message: 'Invalid or revoked refresh token',
      };
    }

    const matches = await bcrypt.compare(refreshToken, tokenRecord.token_hash);
    if (!matches) {
      return {
        success: false,
        message: 'Invalid or revoked refresh token',
      };
    }

    // Check if expired (DB expiry is authoritative for revocation/rotation policies).
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return {
        success: false,
        message: 'Refresh token expired',
      };
    }

    // Get user with roles
    const user = await userRepository.findByEmail(decoded.email);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Generate new access token
    const accessToken = server.jwt.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    return {
      success: true,
      data: {
        accessToken,
      },
    };
  } catch {
    return {
      success: false,
      message: 'Invalid refresh token',
    };
  }
};

/**
 * Logout by revoking refresh tokens.
 *
 * Current behavior:
 * - If `server` is provided, we decode the refresh token and revoke *all* tokens for that user.
 *   This keeps logout deterministic without relying on matching a newly salted bcrypt hash.
 * - If token decoding fails, we perform no DB write (best-effort).
 *
 * @param refreshToken - Raw refresh token.
 * @param server - Fastify instance (optional; required for deterministic revocation).
 *
 * @throws Will throw if database operations fail (when decoding succeeds).
 */
export const logout = async (
  refreshToken: string,
  server?: FastifyInstance
): Promise<void> => {
  // If we can decode, revoke tokens by user id (deterministic).
  if (server) {
    try {
      const decoded = server.jwt.verify(refreshToken) as any;
      await tokenRepository.revokeRefreshTokensByUserId(decoded.id);
      return;
    } catch {
      // fall through
    }
  }

  // Fallback: best-effort only.
  return;
};
