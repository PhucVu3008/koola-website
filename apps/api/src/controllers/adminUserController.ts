import { FastifyRequest, FastifyReply } from 'fastify';
import * as adminUserService from '../services/adminUserService';
import {
  adminUserCreateSchema,
  adminUserUpdateSchema,
  adminUserChangePasswordSchema,
} from '../schemas/users.schemas';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';

/**
 * Admin Users controller.
 *
 * Endpoints (mounted at `/v1/admin/users`):
 * - `GET /`      list users (admin/manager read-only)
 * - `GET /:id`   get user by id
 * - `POST /`     create user (admin only)
 * - `PUT /:id`   update user (admin only)
 * - `DELETE /:id` delete user (admin only)
 * - `PUT /:id/password` change user password (admin only)
 * - `PUT /:id/toggle-active` toggle user active status (admin only)
 *
 * Permissions:
 * - `admin`: Full access (CRUD)
 * - `manager`: Read-only access (list, get)
 * - `editor`: No access
 */

const adminUserListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  role: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * GET `/v1/admin/users`
 * List all users with pagination
 * Permissions: admin, manager (read-only)
 */
export const listUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const query = adminUserListQuerySchema.parse(request.query);

    const result = await adminUserService.listUsers({
      page: query.page,
      pageSize: query.pageSize,
      role: query.role,
      isActive: query.isActive,
    });

    return reply.send(successResponse(result.users, result.meta));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid query parameters', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * GET `/v1/admin/users/:id`
 * Get user by ID
 * Permissions: admin, manager (read-only)
 */
export const getUserById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = idParamsSchema.parse(request.params);

    const user = await adminUserService.getUserById(id);
    if (!user) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'User not found'));
    }

    return reply.send(successResponse(user));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid user ID', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * POST `/v1/admin/users`
 * Create new user
 * Permissions: admin only
 */
export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = adminUserCreateSchema.parse(request.body);

    const currentUser = request.user as any;
    const currentUserId = Number(currentUser?.id);
    if (!currentUserId || Number.isNaN(currentUserId)) {
      return reply
        .status(401)
        .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
    }

    const userId = await adminUserService.createUser({
      createdBy: currentUserId,
      data: body,
    });

    return reply.status(201).send(successResponse({ id: userId }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check required fields.', {
          issues: error.issues,
          requiredFields: ['email', 'password', 'full_name', 'role_ids'],
        })
      );
    }
    
    // Handle duplicate email
    if (error.code === '23505' && error.constraint === 'users_email_key') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Email already exists')
      );
    }
    
    throw error;
  }
};

/**
 * PUT `/v1/admin/users/:id`
 * Update user
 * Permissions: admin only
 */
export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = idParamsSchema.parse(request.params);
    const body = adminUserUpdateSchema.parse(request.body);

    const currentUser = request.user as any;
    const currentUserId = Number(currentUser?.id);
    if (!currentUserId || Number.isNaN(currentUserId)) {
      return reply
        .status(401)
        .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
    }

    // Prevent user from removing their own admin role
    if (id === currentUserId && body.role_ids && !body.role_ids.includes(1)) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Cannot remove your own admin role')
      );
    }

    const updated = await adminUserService.updateUser({
      id,
      updatedBy: currentUserId,
      data: body,
    });

    if (!updated) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'User not found'));
    }

    return reply.send(successResponse({ id }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check input fields.', {
          issues: error.issues,
        })
      );
    }
    
    // Handle duplicate email
    if (error.code === '23505' && error.constraint === 'users_email_key') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Email already exists')
      );
    }
    
    throw error;
  }
};

/**
 * DELETE `/v1/admin/users/:id`
 * Delete user
 * Permissions: admin only
 */
export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = idParamsSchema.parse(request.params);

    const currentUser = request.user as any;
    const currentUserId = Number(currentUser?.id);

    // Prevent user from deleting themselves
    if (id === currentUserId) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Cannot delete your own account')
      );
    }

    const deleted = await adminUserService.deleteUser(id);
    if (!deleted) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'User not found'));
    }

    return reply.send(successResponse({ ok: true }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid user ID', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * PUT `/v1/admin/users/:id/password`
 * Change user password
 * Permissions: admin only
 */
export const changeUserPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = idParamsSchema.parse(request.params);
    const body = adminUserChangePasswordSchema.parse(request.body);

    const updated = await adminUserService.changeUserPassword(id, body.new_password);
    if (!updated) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'User not found'));
    }

    return reply.send(successResponse({ ok: true }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check required fields.', {
          issues: error.issues,
          requiredFields: ['new_password'],
        })
      );
    }
    throw error;
  }
};

/**
 * PUT `/v1/admin/users/:id/toggle-active`
 * Toggle user active status
 * Permissions: admin only
 */
export const toggleUserActive = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = idParamsSchema.parse(request.params);

    const currentUser = request.user as any;
    const currentUserId = Number(currentUser?.id);

    // Prevent user from deactivating themselves
    if (id === currentUserId) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Cannot deactivate your own account')
      );
    }

    const user = await adminUserService.toggleUserActive(id);
    if (!user) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'User not found'));
    }

    return reply.send(successResponse({ is_active: user.is_active }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid user ID', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * GET `/v1/admin/users/roles`
 * List all available roles
 * Permissions: admin, manager (read-only)
 */
export const listRoles = async (_request: FastifyRequest, reply: FastifyReply) => {
  const roles = await adminUserService.listRoles();
  return reply.send(successResponse(roles));
};
