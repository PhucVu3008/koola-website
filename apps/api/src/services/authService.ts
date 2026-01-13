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

export const login = async (
  credentials: LoginInput,
  server: FastifyInstance
): Promise<ServiceResponse> => {
  const { email, password } = credentials;

  // Get user with roles
  const user = await userRepository.findByEmail(email);

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

export const refreshAccessToken = async (
  refreshToken: string,
  server: FastifyInstance
): Promise<ServiceResponse> => {
  try {
    // Verify token
    const decoded = server.jwt.verify(refreshToken) as any;

    // Check if token exists in DB and is not revoked
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const tokenRecord = await tokenRepository.findRefreshToken(refreshTokenHash);

    if (!tokenRecord || tokenRecord.revoked_at) {
      return {
        success: false,
        message: 'Invalid or revoked refresh token',
      };
    }

    // Check if expired
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
  } catch (error) {
    return {
      success: false,
      message: 'Invalid refresh token',
    };
  }
};

export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await tokenRepository.revokeRefreshToken(refreshTokenHash);
};
