import { queryOne } from '../db';
import * as AuthSQL from '../sql/admin/auth';

/**
 * Fetch an active user by email, including aggregated roles.
 *
 * Used by admin authentication flows.
 *
 * @param email - User email address.
 * @returns User row with `roles` array, or `null` if not found / inactive.
 *
 * @throws Will throw if the database query fails.
 *
 * @example
 * const user = await userRepository.findByEmail('admin@koola.com');
 * if (!user) throw new Error('User not found');
 */
export const findByEmail = async (email: string) => {
  return await queryOne<any>(AuthSQL.GET_USER_BY_EMAIL, [email]);
};

/**
 * Update `users.last_login_at` to the current timestamp.
 *
 * @param userId - Target user id.
 * @returns Updated row (shape depends on SQL) or `null` depending on `queryOne` behavior.
 *
 * @throws Will throw if the database query fails.
 */
export const updateLastLogin = async (userId: number) => {
  return await queryOne(AuthSQL.UPDATE_USER_LAST_LOGIN, [userId]);
};
