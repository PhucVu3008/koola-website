/**
 * Pagination utilities.
 *
 * These helpers are designed to be used by controllers/services to implement
 * page/pageSize style pagination while repositories use limit/offset.
 */

/**
 * Standard pagination metadata shape.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Build pagination metadata.
 *
 * @param page - Current page number (1-based).
 * @param pageSize - Page size.
 * @param total - Total records matching a query.
 * @returns Pagination meta for response envelopes.
 */
export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  total: number
): PaginationMeta => {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};

/**
 * Convert page + pageSize to SQL offset.
 *
 * @param page - Current page (1-based).
 * @param pageSize - Page size.
 * @returns Offset for SQL `LIMIT/OFFSET`.
 */
export const calculateOffset = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};

/**
 * Validate pagination params.
 *
 * This is intentionally lightweight and should be used only in cases where
 * pagination is not validated by Zod at the request boundary.
 *
 * @param page - Current page (must be >= 1).
 * @param pageSize - Page size (1..100).
 *
 * @throws {Error} When params are out of range.
 */
export const validatePaginationParams = (page: number, pageSize: number): void => {
  if (page < 1) {
    throw new Error('Page must be greater than 0');
  }
  if (pageSize < 1 || pageSize > 100) {
    throw new Error('Page size must be between 1 and 100');
  }
};
