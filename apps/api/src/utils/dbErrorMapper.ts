import {
  AppError,
  ConflictError,
  ValidationError,
  InternalError,
} from './errors';

/**
 * Database Error Mapper
 *
 * Purpose: Convert PostgreSQL error codes into semantic AppError instances.
 *
 * Benefits:
 * - Consistent error responses across all repositories
 * - Centralized database error interpretation
 * - Easy to extend for new constraint types
 * - Reusable across the entire application
 *
 * Postgres Error Codes Reference:
 * - 23505: unique_violation
 * - 23503: foreign_key_violation
 * - 23514: check_violation
 * - 23502: not_null_violation
 * - 08000-08006: connection errors
 * - 57P01: admin_shutdown
 * - 57P03: cannot_connect_now
 */

/**
 * Check if an error is a PostgreSQL database error.
 *
 * @param error - Error object to check
 * @returns True if error is from PostgreSQL driver
 */
export const isDatabaseError = (error: any): boolean => {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof error.code === 'string' &&
    (error.code.startsWith('23') || // Integrity constraint violations
      error.code.startsWith('08') || // Connection errors
      error.code.startsWith('57')) // Operator intervention
  );
};

/**
 * Extract constraint name from PostgreSQL error.
 *
 * @param error - PostgreSQL error object
 * @returns Constraint name or null
 */
const getConstraintName = (error: any): string | null => {
  return error.constraint || error.constraint_name || null;
};

/**
 * Extract table name from PostgreSQL error.
 *
 * @param error - PostgreSQL error object
 * @returns Table name or null
 */
const getTableName = (error: any): string | null => {
  return error.table || error.table_name || null;
};

/**
 * Extract column name from PostgreSQL error.
 *
 * @param error - PostgreSQL error object
 * @returns Column name or null
 */
const getColumnName = (error: any): string | null => {
  return error.column || error.column_name || null;
};

/**
 * Map unique constraint violations to ConflictError.
 *
 * Handles constraints like:
 * - uq_tags_locale_slug
 * - uq_categories_locale_kind_slug
 * - users_email_key
 * - services_locale_slug_key
 *
 * @param error - PostgreSQL error object
 * @returns ConflictError with appropriate message and details
 */
const mapUniqueViolation = (error: any): ConflictError => {
  const constraint = getConstraintName(error);
  const table = getTableName(error);
  const column = getColumnName(error);

  // Build human-readable message based on constraint pattern
  let message = 'A record with this value already exists';
  let field = 'field';

  if (constraint) {
    // Extract field name from constraint
    // Examples:
    // - uq_tags_locale_slug -> "slug"
    // - users_email_key -> "email"
    // - services_locale_slug_key -> "slug"

    if (constraint.includes('_slug')) {
      field = 'slug';
      message = `A record with this slug already exists in this locale`;
    } else if (constraint.includes('_email')) {
      field = 'email';
      message = `This email address is already registered`;
    } else if (constraint.includes('_locale_kind_slug')) {
      field = 'slug';
      message = `A record with this slug already exists for this locale and kind`;
    } else if (column) {
      field = column;
      message = `A record with this ${column} already exists`;
    }
  }

  return new ConflictError(message, {
    constraint,
    table,
    field,
    errorCode: '23505',
  });
};

/**
 * Map foreign key violations to ValidationError.
 *
 * Occurs when trying to reference a non-existent record.
 *
 * @param error - PostgreSQL error object
 * @returns ValidationError with appropriate message and details
 */
const mapForeignKeyViolation = (error: any): ValidationError => {
  const constraint = getConstraintName(error);
  const table = getTableName(error);
  const column = getColumnName(error);

  let message = 'Referenced record does not exist';
  let field = column || 'foreign_key';

  if (constraint) {
    // Extract referenced table from constraint name
    // Examples:
    // - fk_service_tags_service_id -> "service"
    // - fk_posts_author_id -> "author"
    const parts = constraint.split('_');

    if (parts.length >= 3) {
      const refTable = parts[1]; // e.g., "service", "post", "user"
      field = parts[parts.length - 1]; // e.g., "id"
      message = `Referenced ${refTable} does not exist`;
    }
  }

  return new ValidationError(message, {
    constraint,
    table,
    field,
    errorCode: '23503',
  });
};

/**
 * Map check constraint violations to ValidationError.
 *
 * Occurs when a value violates a CHECK constraint (e.g., enum values).
 *
 * @param error - PostgreSQL error object
 * @returns ValidationError with appropriate message and details
 */
const mapCheckViolation = (error: any): ValidationError => {
  const constraint = getConstraintName(error);
  const table = getTableName(error);
  const column = getColumnName(error);

  let message = 'Invalid value provided';
  let field = column || 'field';

  if (constraint) {
    // Check constraints often have names like:
    // - check_status_valid
    // - check_locale_valid
    const parts = constraint.split('_');

    if (parts.length >= 2) {
      field = parts[1]; // e.g., "status", "locale"
      message = `Invalid value for ${field}`;
    }
  }

  return new ValidationError(message, {
    constraint,
    table,
    field,
    errorCode: '23514',
  });
};

/**
 * Map not-null violations to ValidationError.
 *
 * Occurs when trying to insert/update NULL into a NOT NULL column.
 *
 * @param error - PostgreSQL error object
 * @returns ValidationError with appropriate message and details
 */
const mapNotNullViolation = (error: any): ValidationError => {
  const column = getColumnName(error);
  const table = getTableName(error);
  const field = column || 'field';

  const message = `${field} is required`;

  return new ValidationError(message, {
    table,
    field,
    errorCode: '23502',
  });
};

/**
 * Map connection errors to InternalError.
 *
 * Occurs when database is unavailable or connection fails.
 *
 * @param error - PostgreSQL error object
 * @returns InternalError with appropriate message
 */
const mapConnectionError = (error: any): InternalError => {
  const code = error.code;

  let message = 'Database connection failed';

  if (code === '08000') {
    message = 'Cannot establish database connection';
  } else if (code === '08001') {
    message = 'SQL client unable to establish connection';
  } else if (code === '08006') {
    message = 'Connection failure';
  } else if (code === '57P01') {
    message = 'Database shutdown in progress';
  } else if (code === '57P03') {
    message = 'Database cannot accept connections';
  }

  return new InternalError(message);
};

/**
 * Map PostgreSQL error to appropriate AppError subclass.
 *
 * This is the main entry point for database error handling.
 * Call this function in service/repository layers when catching database errors.
 *
 * @param error - PostgreSQL error object from pg driver
 * @returns AppError instance with appropriate status code and message
 *
 * @example
 * ```typescript
 * try {
 *   await pool.query('INSERT INTO services ...');
 * } catch (error) {
 *   if (isDatabaseError(error)) {
 *     throw mapDatabaseError(error);
 *   }
 *   throw error;
 * }
 * ```
 */
export const mapDatabaseError = (error: any): AppError => {
  const code = error.code;

  // 23xxx = Integrity constraint violations
  if (code === '23505') {
    return mapUniqueViolation(error);
  }

  if (code === '23503') {
    return mapForeignKeyViolation(error);
  }

  if (code === '23514') {
    return mapCheckViolation(error);
  }

  if (code === '23502') {
    return mapNotNullViolation(error);
  }

  // 08xxx = Connection errors
  if (code.startsWith('08') || code.startsWith('57P')) {
    return mapConnectionError(error);
  }

  // Fallback: Unknown database error
  // Don't leak internal details, but log for debugging
  console.error('Unmapped database error:', {
    code,
    message: error.message,
    detail: error.detail,
    hint: error.hint,
    constraint: error.constraint,
    table: error.table,
  });

  return new InternalError('A database error occurred');
};

/**
 * Higher-order function to wrap repository functions with automatic database error handling.
 *
 * This eliminates repetitive try-catch blocks in repositories.
 *
 * @param fn - Repository function to wrap
 * @returns Wrapped function that automatically maps database errors
 *
 * @example
 * ```typescript
 * export const createService = withDbErrorHandling(async (data) => {
 *   return await query(SQL.CREATE_SERVICE, [...params]);
 * });
 * ```
 */
export const withDbErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (isDatabaseError(error)) {
        throw mapDatabaseError(error);
      }
      throw error;
    }
  }) as T;
};
