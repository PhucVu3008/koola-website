import { queryOne } from '../db';
import * as SQL from '../sql/admin/auth';

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

export const findRefreshToken = async (tokenHash: string) => {
  return await queryOne<any>(SQL.GET_REFRESH_TOKEN, [tokenHash]);
};

export const revokeRefreshToken = async (tokenHash: string) => {
  return await queryOne(SQL.REVOKE_REFRESH_TOKEN, [tokenHash]);
};
