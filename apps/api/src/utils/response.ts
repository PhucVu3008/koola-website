/**
 * Response envelope helpers.
 *
 * All endpoints should return one of:
 * - Success: `{ data, meta? }`
 * - Error: `{ error: { code, message, details? } }`
 *
 * These utilities help keep responses consistent across controllers.
 */

export interface SuccessResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Build a success response envelope.
 *
 * @param data - Response payload.
 * @param meta - Optional metadata (typically pagination: `page`, `pageSize`, `total`, `totalPages`).
 * @returns Standard success envelope.
 */
export const successResponse = <T>(
  data: T,
  meta?: Record<string, any>
): SuccessResponse<T> => {
  return meta ? { data, meta } : { data };
};

/**
 * Build an error response envelope.
 *
 * This function is typically used by middleware/error handlers. Controllers can
 * also use it for explicit error responses.
 *
 * @param code - One of the standard error codes.
 * @param message - Safe, user-facing message.
 * @param details - Optional structured error details (e.g. Zod issues).
 * @returns Standard error envelope.
 */
export const errorResponse = (
  code: string,
  message: string,
  details?: any
): ErrorResponse => {
  return {
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
};

/**
 * Common error codes used by the API.
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;
