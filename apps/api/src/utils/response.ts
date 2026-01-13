/**
 * Standard API response helpers
 */

interface SuccessResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export const successResponse = <T>(data: T, meta?: Record<string, any>): SuccessResponse<T> => {
  return meta ? { data, meta } : { data };
};

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

// Common error codes
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;
