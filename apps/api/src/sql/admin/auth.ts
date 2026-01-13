// ============ AUTH QUERIES ============

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

export const CREATE_REFRESH_TOKEN = `
  INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
  VALUES ($1, $2, $3)
  RETURNING id
`;

export const GET_REFRESH_TOKEN = `
  SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at
  FROM refresh_tokens rt
  WHERE rt.token_hash = $1
`;

export const REVOKE_REFRESH_TOKEN = `
  UPDATE refresh_tokens
  SET revoked_at = NOW()
  WHERE token_hash = $1
`;

export const UPDATE_USER_LAST_LOGIN = `
  UPDATE users
  SET last_login_at = NOW()
  WHERE id = $1
`;
