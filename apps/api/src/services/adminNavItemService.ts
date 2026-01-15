import * as adminNavItemRepository from '../repositories/adminNavItemRepository';

/**
 * Admin Nav Items service.
 *
 * Business rules:
 * - Minimal by design: at this stage we perform basic relational validation
 *   (parent existence) and leave any additional constraints to the DB.
 */

export type NavPlacement = adminNavItemRepository.NavPlacement;

export interface AdminNavItemUpsertInput {
  locale: string;
  placement: NavPlacement;
  label: string;
  href: string;
  sort_order: number;
  parent_id: number | null;
}

/**
 * List nav items.
 */
export const listNavItems = async (locale: string, placement: NavPlacement) => {
  return await adminNavItemRepository.listNavItems(locale, placement);
};

/**
 * Get nav item by id.
 */
export const getNavItemById = async (id: number) => {
  return await adminNavItemRepository.getNavItemById(id);
};

/**
 * Create nav item.
 *
 * Validation:
 * - If `parent_id` is provided, it must exist.
 */
export const createNavItem = async (input: AdminNavItemUpsertInput) => {
  if (input.parent_id != null) {
    const parent = await adminNavItemRepository.getNavItemById(input.parent_id);
    if (!parent) {
      return { ok: false as const, error: 'PARENT_NOT_FOUND' as const };
    }
  }

  const id = await adminNavItemRepository.createNavItem(input);
  if (!id) {
    return { ok: false as const, error: 'CREATE_FAILED' as const };
  }

  return { ok: true as const, id };
};

/**
 * Update nav item.
 *
 * Validation:
 * - If updating `parent_id`, the parent must exist.
 * - Prevent `parent_id = self` (immediate cycle).
 */
export const updateNavItem = async (id: number, input: AdminNavItemUpsertInput) => {
  if (input.parent_id != null) {
    if (input.parent_id === id) {
      return { ok: false as const, error: 'PARENT_SELF' as const };
    }

    const parent = await adminNavItemRepository.getNavItemById(input.parent_id);
    if (!parent) {
      return { ok: false as const, error: 'PARENT_NOT_FOUND' as const };
    }
  }

  const updatedId = await adminNavItemRepository.updateNavItem({ id, ...input });
  if (!updatedId) {
    return { ok: false as const, error: 'NOT_FOUND' as const };
  }

  return { ok: true as const, id: updatedId };
};

/**
 * Delete nav item by id.
 */
export const deleteNavItem = async (id: number) => {
  const rowCount = await adminNavItemRepository.deleteNavItem(id);
  return rowCount;
};
