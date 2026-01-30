import { z } from 'zod';

/**
 * Schema for creating a new user
 */
export const adminUserCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  role_ids: z.array(z.number().int().positive()).min(1, 'At least one role is required'),
  is_active: z.boolean().default(true),
});

/**
 * Schema for updating a user
 */
export const adminUserUpdateSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  full_name: z.string().min(1, 'Full name is required').optional(),
  role_ids: z.array(z.number().int().positive()).optional(),
  is_active: z.boolean().optional(),
});

/**
 * Schema for changing user password
 */
export const adminUserChangePasswordSchema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AdminUserCreate = z.infer<typeof adminUserCreateSchema>;
export type AdminUserUpdate = z.infer<typeof adminUserUpdateSchema>;
export type AdminUserChangePassword = z.infer<typeof adminUserChangePasswordSchema>;
