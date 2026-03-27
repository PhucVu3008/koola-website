/**
 * Admin Role-Based Permission Utility
 *
 * Defines what each role can do and provides helpers to check permissions
 * on the frontend. The source of truth for authorization is always the API,
 * but this keeps the UI consistent and avoids showing actions that will 403.
 *
 * Roles (from DB):
 *  - admin   (id 1): Full access including user management
 *  - editor  (id 2): Content management only, no user visibility
 *  - manager (id 3): Content + view-only user list
 */

import type { AdminUser } from '@/lib/admin-auth';

export type UserRole = 'admin' | 'manager' | 'editor';

/** All permission keys used across the admin UI. */
export type Permission =
  | 'users:view'     // Can see the Users menu item and list
  | 'users:create'   // Can create new users
  | 'users:edit'     // Can edit user profiles and roles
  | 'users:delete'   // Can delete users
  | 'users:password' // Can change user passwords
  | 'users:toggle'   // Can activate/deactivate users
  | 'content:manage'; // Can manage all content (posts, services, pages, etc.)

/**
 * Permission → allowed roles map.
 * Must stay in sync with backend route guards in apps/api/src/routes/admin/
 */
const PERMISSIONS: Record<Permission, UserRole[]> = {
  'users:view':     ['admin', 'manager'],
  'users:create':   ['admin'],
  'users:edit':     ['admin'],
  'users:delete':   ['admin'],
  'users:password': ['admin'],
  'users:toggle':   ['admin'],
  'content:manage': ['admin', 'manager', 'editor'],
};

/**
 * Extract role names from a stored AdminUser object.
 * Normalizes to lowercase strings.
 */
export const getUserRoles = (user: AdminUser | null): UserRole[] => {
  if (!user?.roles) return [];
  return user.roles.map((r) => r.name.toLowerCase() as UserRole);
};

/**
 * Check if a user has a specific permission.
 *
 * @param user   - The currently logged-in admin user
 * @param perm   - The permission to check
 * @returns true if user's role allows this action
 */
export const hasPermission = (user: AdminUser | null, perm: Permission): boolean => {
  const roles = getUserRoles(user);
  const allowed = PERMISSIONS[perm];
  return roles.some((r) => allowed.includes(r));
};

/**
 * Check if a user has a specific role.
 */
export const hasRole = (user: AdminUser | null, role: UserRole): boolean => {
  return getUserRoles(user).includes(role);
};

/**
 * Get the primary (highest-privilege) role of the user for display purposes.
 * Priority: admin > manager > editor
 */
export const getPrimaryRole = (user: AdminUser | null): UserRole | null => {
  const roles = getUserRoles(user);
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('manager')) return 'manager';
  if (roles.includes('editor')) return 'editor';
  return null;
};

/** Display label for each role. */
export const ROLE_LABELS: Record<UserRole, { en: string; vi: string; color: string }> = {
  admin:   { en: 'Administrator', vi: 'Quản trị viên', color: 'bg-red-100 text-red-800 border-red-200' },
  manager: { en: 'Manager',       vi: 'Quản lý',       color: 'bg-blue-100 text-blue-800 border-blue-200' },
  editor:  { en: 'Editor',        vi: 'Biên tập viên', color: 'bg-green-100 text-green-800 border-green-200' },
};
