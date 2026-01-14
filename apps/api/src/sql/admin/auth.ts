// ============ AUTH QUERIES ============

/**
 * GET_USER_BY_EMAIL
 *
 * Fetch an active user and their roles by email.
 *
 * Parameters:
 * - $1 email
 *
 * Notes:
 * - Filters `is_active = true`.
 * - Aggregates roles into a JSON array.
 *
 * Security:
 * - Parameterized query.
 */
export const GET_USER_BY_EMAIL = `
  SELECT 
    u.id, u.email, u.password_hash, u.full_name, 
    u.avatar_asset_id, u.is_active,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object('id', r.id, 'name', r.name)
      ) FILTER (WHERE r.id IS NOT NULL), 
      '[]'
    ) as roles
  FROM users u
  LEFT JOIN user_roles ur ON u.id = ur.user_id
  LEFT JOIN roles r ON ur.role_id = r.id
  WHERE u.email = $1 AND u.is_active = true
  GROUP BY u.id
`;

/**
 * CREATE_REFRESH_TOKEN
 *
 * Store a refresh token hash with an expiry.
 *
 * Parameters:
 * - $1 user_id
 * - $2 token_hash (bcrypt)
 * - $3 expires_at (timestamptz)
 */
export const CREATE_REFRESH_TOKEN = `
  INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
  VALUES ($1, $2, $3)
  RETURNING id
`;

/**
 * GET_REFRESH_TOKEN
 *
 * Fetch a refresh token row by stored hash.
 *
 * Parameters:
 * - $1 token_hash
 */
export const GET_REFRESH_TOKEN = `
  SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at
  FROM refresh_tokens rt
  WHERE rt.token_hash = $1
`;

/**
 * GET_VALID_REFRESH_TOKEN_BY_USER_ID
 *
 * Fetch the latest non-revoked, non-expired refresh token for a user.
 *
 * Parameters:
 * - $1 user_id
 */
export const GET_VALID_REFRESH_TOKEN_BY_USER_ID = `
  SELECT id, user_id, token_hash, expires_at, revoked_at
  FROM refresh_tokens
  WHERE user_id = $1
    AND revoked_at IS NULL
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1
`;

/**
 * REVOKE_REFRESH_TOKEN
 *
 * Revoke a refresh token by hash.
 *
 * Parameters:
 * - $1 token_hash
 */
export const REVOKE_REFRESH_TOKEN = `
  UPDATE refresh_tokens
  SET revoked_at = NOW()
  WHERE token_hash = $1
`;

/**
 * REVOKE_REFRESH_TOKENS_BY_USER_ID
 *
 * Revoke all active refresh tokens for a user.
 *
 * Parameters:
 * - $1 user_id
 */
export const REVOKE_REFRESH_TOKENS_BY_USER_ID = `
  UPDATE refresh_tokens
  SET revoked_at = NOW()
  WHERE user_id = $1 AND revoked_at IS NULL
`;

/**
 * UPDATE_USER_LAST_LOGIN
 *
 * Update user's `last_login_at`.
 *
 * Parameters:
 * - $1 user_id
 */
export const UPDATE_USER_LAST_LOGIN = `
  UPDATE users
  SET last_login_at = NOW()
  WHERE id = $1
`;
