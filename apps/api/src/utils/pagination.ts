/**
 * Pagination utilities
 */

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

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

export const calculateOffset = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize;
};

export const validatePaginationParams = (page: number, pageSize: number): void => {
  if (page < 1) {
    throw new Error('Page must be greater than 0');
  }
  if (pageSize < 1 || pageSize > 100) {
    throw new Error('Page size must be between 1 and 100');
  }
};
