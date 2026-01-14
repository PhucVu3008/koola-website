import { queryOne } from '../db';
import * as SQL from '../sql/admin/auth';

/**
 * Persist a hashed refresh token for a user.
 *
 * This repository method stores `tokenHash` (a bcrypt hash of the raw refresh token)
 * in the `refresh_tokens` table and returns the inserted row (typically `{ id }`).
 *
 * @param userId - Target user id owning the refresh token.
 * @param tokenHash - Bcrypt hash of the raw refresh token (never store the raw token).
 * @param expiresAt - Expiration timestamp for the refresh token.
 *
 * @returns Inserted refresh token record (shape depends on SQL `RETURNING`).
 *
 * @throws Will throw if the database query fails (connection issues, constraint violations).
 *
 * @example
 * const tokenHash = await bcrypt.hash(refreshToken, 10);
 * await tokenRepository.createRefreshToken(user.id, tokenHash, expiresAt);
 */
export const createRefreshToken = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date
) => {
  return await queryOne(SQL.CREATE_REFRESH_TOKEN, [
    userId,
    tokenHash,
    expiresAt.toISOString(),
  ]);
};

/**
 * Find a refresh token record by its stored hash.
 *
 * Important: Because bcrypt hashes are salted, this function must be called with the
 * exact stored hash value (not a newly computed hash for the same token).
 *
 * In this codebase, preferred lookup is by user id (see `findValidRefreshTokenByUserId`)
 * and then validate the raw refresh token via `bcrypt.compare(refreshToken, token_hash)`.
 *
 * @param tokenHash - The exact `refresh_tokens.token_hash` value to search for.
 * @returns Refresh token record or `null` when not found.
 *
 * @throws Will throw if the database query fails.
 */
export const findRefreshToken = async (tokenHash: string) => {
  return await queryOne<any>(SQL.GET_REFRESH_TOKEN, [tokenHash]);
};

/**
 * Fetch the most recent valid (non-revoked) refresh token for a given user.
 *
 * The returned row is intended to be used as follows:
 * 1) call this function with `userId`
 * 2) check `expires_at` and `revoked_at`
 * 3) compare the raw refresh token with the stored hash using bcrypt
 *
 * @param userId - User id.
 * @returns Latest valid refresh token row, or `null` if none exists.
 *
 * @throws Will throw if the database query fails.
 *
 * @example
 * const record = await tokenRepository.findValidRefreshTokenByUserId(userId);
 * if (!record) throw new Error('No valid token');
 * const ok = await bcrypt.compare(refreshToken, record.token_hash);
 */
export const findValidRefreshTokenByUserId = async (userId: number) => {
  return await queryOne<any>(SQL.GET_VALID_REFRESH_TOKEN_BY_USER_ID, [userId]);
};

/**
 * Revoke a single refresh token by its stored hash.
 *
 * @param tokenHash - The exact stored hash (`refresh_tokens.token_hash`) to revoke.
 * @returns Updated row (shape depends on SQL) or `null` depending on `queryOne` behavior.
 *
 * @throws Will throw if the database query fails.
 */
export const revokeRefreshToken = async (tokenHash: string) => {
  return await queryOne(SQL.REVOKE_REFRESH_TOKEN, [tokenHash]);
};

/**
 * Revoke all refresh tokens for a user.
 *
 * This is used for deterministic logout (e.g., when you can decode the refresh token
 * to obtain `userId`).
 *
 * @param userId - User id whose tokens should be revoked.
 * @returns Result of the revoke query (shape depends on SQL).
 *
 * @throws Will throw if the database query fails.
 */
export const revokeRefreshTokensByUserId = async (userId: number) => {
  return await queryOne(SQL.REVOKE_REFRESH_TOKENS_BY_USER_ID, [userId]);
};
