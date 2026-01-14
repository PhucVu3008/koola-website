import { z } from 'zod';

// ============ AUTH SCHEMAS ============

/**
 * Schema for admin login payload.
 *
 * Used by: `POST /v1/admin/auth/login`
 *
 * Validation goals:
 * - Fail fast with 400 `VALIDATION_ERROR` on malformed input.
 * - Authentication failures (wrong credentials) should return 401 from the controller.
 *
 * @example
 * { "email": "admin@koola.com", "password": "admin123" }
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(200, 'Password is too long'),
});

/**
 * Schema for refresh token payload.
 *
 * Used by:
 * - `POST /v1/admin/auth/refresh`
 * - `POST /v1/admin/auth/logout`
 *
 * @example
 * { "refreshToken": "<jwt>" }
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

/**
 * TypeScript type inferred from {@link loginSchema}.
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * TypeScript type inferred from {@link refreshTokenSchema}.
 */
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
