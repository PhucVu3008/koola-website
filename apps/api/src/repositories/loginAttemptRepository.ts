import { query, queryOne } from '../db';
import * as LoginAttemptsSQL from '../sql/admin/loginAttempts';

/**
 * Record a login attempt in the database.
 * 
 * @param email - Email used in login attempt
 * @param ipAddress - Client IP address
 * @param userAgent - Browser/client user agent
 * @param success - Whether login succeeded
 * @param failureReason - Why login failed (optional if success=true)
 * 
 * @returns Inserted row with id and attempted_at
 * 
 * @throws Will throw if database insert fails
 * 
 * @example
 * await recordLoginAttempt('admin@koola.com', '192.168.1.1', 'Mozilla...', false, 'INVALID_PASSWORD');
 */
export const recordLoginAttempt = async (
  email: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  failureReason?: string
) => {
  return await queryOne(LoginAttemptsSQL.RECORD_LOGIN_ATTEMPT, [
    email,
    ipAddress,
    userAgent,
    success,
    failureReason || null,
  ]);
};

/**
 * Get count of failed login attempts from an IP within the last N minutes.
 * 
 * Used to determine if IP should be blocked.
 * 
 * @param ipAddress - Client IP
 * @param minutes - Time window (default: 5 minutes)
 * 
 * @returns Object with failed_count property
 * 
 * @example
 * const { failed_count } = await getFailedAttemptsByIP('192.168.1.1', 5);
 * if (failed_count >= 5) { ... }
 */
export const getFailedAttemptsByIP = async (
  ipAddress: string,
  minutes: number = 5
): Promise<{ failed_count: number }> => {
  const result = await queryOne<{ failed_count: string }>(
    LoginAttemptsSQL.GET_FAILED_ATTEMPTS_BY_IP,
    [ipAddress, minutes]
  );
  
  return {
    failed_count: result ? parseInt(result.failed_count, 10) : 0,
  };
};

/**
 * Get timestamp of the most recent failed attempt from an IP.
 * 
 * Used to calculate remaining block time (e.g., "IP blocked for 15 more seconds").
 * 
 * @param ipAddress - Client IP
 * 
 * @returns Object with attempted_at, or null if no failed attempts
 * 
 * @example
 * const lastAttempt = await getLastFailedAttempt('192.168.1.1');
 * if (lastAttempt) {
 *   const secondsSince = (Date.now() - lastAttempt.attempted_at.getTime()) / 1000;
 * }
 */
export const getLastFailedAttempt = async (
  ipAddress: string
): Promise<{ attempted_at: Date } | null> => {
  return await queryOne<{ attempted_at: Date }>(
    LoginAttemptsSQL.GET_LAST_FAILED_ATTEMPT,
    [ipAddress]
  );
};

/**
 * Delete old login attempts (cleanup job).
 * 
 * Should be run periodically (e.g., daily cron job).
 * 
 * @param days - Number of days to keep (default: 30)
 * 
 * @returns Number of deleted rows
 * 
 * @example
 * const deleted = await cleanupOldAttempts(30);
 * console.log(`Deleted ${deleted} old login attempts`);
 */
export const cleanupOldAttempts = async (days: number = 30): Promise<number> => {
  const result = await queryOne<{ deleted_count: string }>(
    LoginAttemptsSQL.CLEANUP_OLD_ATTEMPTS,
    [days]
  );
  
  return result ? parseInt(result.deleted_count, 10) : 0;
};

/**
 * Get recent login attempts for a specific email (admin analytics).
 * 
 * @param email - Target email
 * @param limit - Max results (default: 50)
 * 
 * @returns Array of login attempt records
 */
export const getAttemptsByEmail = async (
  email: string,
  limit: number = 50
) => {
  return await query(LoginAttemptsSQL.GET_ATTEMPTS_BY_EMAIL, [email, limit]);
};
