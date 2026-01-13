import { queryOne } from '../db';
import * as AuthSQL from '../sql/admin/auth';

export const findByEmail = async (email: string) => {
  return await queryOne<any>(AuthSQL.GET_USER_BY_EMAIL, [email]);
};

export const updateLastLogin = async (userId: number) => {
  return await queryOne(AuthSQL.UPDATE_USER_LAST_LOGIN, [userId]);
};
