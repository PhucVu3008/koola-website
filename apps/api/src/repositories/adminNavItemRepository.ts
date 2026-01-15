import { query, queryOne, transaction } from '../db';
import * as AdminNavItemsSQL from '../sql/admin/navItems';

/**
 * Admin Nav Items repository.
 *
 * Responsibilities:
 * - Provide DB access for admin nav-items CRUD.
 * - Ensure deletes do not violate the self-referencing FK on `parent_id`.
 */

export type NavPlacement = 'header' | 'footer';

export interface AdminNavItemRow {
  id: number;
  locale: string;
  placement: string;
  label: string;
  href: string;
  sort_order: number;
  parent_id: number | null;
}

export interface AdminNavItemCreateInput {
  locale: string;
  placement: NavPlacement;
  label: string;
  href: string;
  sort_order: number;
  parent_id: number | null;
}

export interface AdminNavItemUpdateInput extends AdminNavItemCreateInput {
  id: number;
}

/**
 * List nav items for a placement + locale.
 */
export const listNavItems = async (locale: string, placement: NavPlacement) => {
  return await query<AdminNavItemRow>(AdminNavItemsSQL.ADMIN_LIST_NAV_ITEMS, [locale, placement]);
};

/**
 * Get a nav item by id.
 */
export const getNavItemById = async (id: number) => {
  return await queryOne<AdminNavItemRow>(AdminNavItemsSQL.ADMIN_GET_NAV_ITEM_BY_ID, [id]);
};

/**
 * Create a nav item.
 */
export const createNavItem = async (input: AdminNavItemCreateInput) => {
  const created = await queryOne<{ id: number }>(AdminNavItemsSQL.ADMIN_CREATE_NAV_ITEM, [
    input.locale,
    input.placement,
    input.label,
    input.href,
    input.sort_order,
    input.parent_id,
  ]);

  return created?.id ?? null;
};

/**
 * Update a nav item.
 */
export const updateNavItem = async (input: AdminNavItemUpdateInput) => {
  const updated = await queryOne<{ id: number }>(AdminNavItemsSQL.ADMIN_UPDATE_NAV_ITEM, [
    input.id,
    input.locale,
    input.placement,
    input.label,
    input.href,
    input.sort_order,
    input.parent_id,
  ]);

  return updated?.id ?? null;
};

/**
 * Delete a nav item.
 *
 * Security/consistency:
 * - We detach children by setting `parent_id = NULL` to avoid violating the
 *   self-referencing FK constraint.
 * - The operation is transactional.
 */
export const deleteNavItem = async (id: number) => {
  return await transaction(async (client) => {
    await client.query(AdminNavItemsSQL.ADMIN_CLEAR_CHILD_PARENT_IDS, [id]);
    const deleted = await client.query(AdminNavItemsSQL.ADMIN_DELETE_NAV_ITEM, [id]);
    return deleted.rowCount ?? 0;
  });
};
