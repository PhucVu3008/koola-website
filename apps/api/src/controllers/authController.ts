import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/authService';
import { LoginInput } from '../schemas/auth.schemas';
import { successResponse, errorResponse, ErrorCodes } from '../utils/response';

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const credentials = request.body as LoginInput;
  
  const result = await authService.login(credentials, request.server);
  
  if (!result.success) {
    return reply.status(401).send(errorResponse(ErrorCodes.UNAUTHORIZED, result.message || 'Login failed'));
  }

  return reply.send(successResponse(result.data));
};

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = request.body as { refreshToken: string };
  
  const result = await authService.refreshAccessToken(refreshToken, request.server);
  
  if (!result.success) {
    return reply.status(401).send(errorResponse(ErrorCodes.UNAUTHORIZED, result.message || 'Refresh failed'));
  }

  return reply.send(successResponse(result.data));
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = request.body as { refreshToken: string };
  
  await authService.logout(refreshToken);
  
  return reply.send(successResponse({ message: 'Logged out successfully' }));
};
