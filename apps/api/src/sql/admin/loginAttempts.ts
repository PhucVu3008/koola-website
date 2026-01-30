/**
 * SQL queries for login_attempts table.
 * 
 * Purpose: Track failed login attempts for IP blocking.
 * Security: Block IP for 30s after 5 failed attempts within 5 minutes.
 */

/**
 * Record a login attempt (success or failure).
 * 
 * @param $1 email - Email used in attempt
 * @param $2 ip_address - Client IP (IPv4 or IPv6)
 * @param $3 user_agent - Browser/client user agent
 * @param $4 success - true if login succeeded, false if failed
 * @param $5 failure_reason - Why login failed (nullable if success=true)
 * 
 * @returns Inserted row with id and attempted_at
 */
export const RECORD_LOGIN_ATTEMPT = `
  INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, attempted_at
`;

/**
 * Get count of failed login attempts from an IP within the last N minutes.
 * 
 * Used to determine if IP should be blocked.
 * 
 * @param $1 ip_address - Client IP
 * @param $2 minutes - Time window (typically 5 minutes)
 * 
 * @returns { failed_count: number }
 */
export const GET_FAILED_ATTEMPTS_BY_IP = `
  SELECT COUNT(*) as failed_count
  FROM login_attempts
  WHERE ip_address = $1
    AND success = false
    AND attempted_at >= NOW() - INTERVAL '1 minute' * $2
`;

/**
 * Get timestamp of the most recent failed attempt from an IP.
 * 
 * Used to calculate remaining block time.
 * 
 * @param $1 ip_address - Client IP
 * 
 * @returns { attempted_at: Date } or null
 */
export const GET_LAST_FAILED_ATTEMPT = `
  SELECT attempted_at
  FROM login_attempts
  WHERE ip_address = $1
    AND success = false
  ORDER BY attempted_at DESC
  LIMIT 1
`;

/**
 * Delete old login attempts to prevent table bloat.
 * 
 * Should be run periodically (e.g., daily cron job).
 * Keeps only attempts from the last 30 days.
 * 
 * @param $1 days - Number of days to keep (default: 30)
 * 
 * @returns { deleted_count: number }
 */
export const CLEANUP_OLD_ATTEMPTS = `
  WITH deleted AS (
    DELETE FROM login_attempts
    WHERE attempted_at < NOW() - INTERVAL '1 day' * $1
    RETURNING id
  )
  SELECT COUNT(*) as deleted_count FROM deleted
`;

/**
 * Get recent login attempts for a specific email (admin analytics).
 * 
 * @param $1 email - Target email
 * @param $2 limit - Max results (default: 50)
 * 
 * @returns Array of attempt records
 */
export const GET_ATTEMPTS_BY_EMAIL = `
  SELECT 
    id,
    email,
    ip_address,
    user_agent,
    attempted_at,
    success,
    failure_reason
  FROM login_attempts
  WHERE email = $1
  ORDER BY attempted_at DESC
  LIMIT $2
`;
