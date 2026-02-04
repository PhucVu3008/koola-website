import { ErrorCodes } from './response';

/**
 * Centralized Error Messages
 *
 * Purpose: Provide consistent, reusable error messages across the API.
 *
 * Benefits:
 * - Consistent user-facing error messages
 * - Easy to localize (all strings in one place)
 * - Type-safe with TypeScript
 * - Testable and maintainable
 *
 * Usage:
 * ```typescript
 * throw new NotFoundError(ErrorMessages.RESOURCE_NOT_FOUND('Service', 'my-slug'));
 * throw new ValidationError(ErrorMessages.MISSING_REQUIRED_FIELDS(['title', 'slug']));
 * ```
 */

export const ErrorMessages = {
  // ========== Resource Operations ==========

  /**
   * Generate a "resource not found" message.
   *
   * @param resourceType - Type of resource (e.g., "Service", "Post", "User")
   * @param identifier - Optional identifier (slug, ID, etc.)
   * @returns Formatted error message
   *
   * @example
   * ErrorMessages.RESOURCE_NOT_FOUND('Service')
   * // => "Service not found"
   *
   * ErrorMessages.RESOURCE_NOT_FOUND('Post', 'my-blog-post')
   * // => "Post not found: my-blog-post"
   */
  RESOURCE_NOT_FOUND: (resourceType: string, identifier?: string | number) =>
    identifier
      ? `${resourceType} not found: ${identifier}`
      : `${resourceType} not found`,

  /**
   * Generate a "resource already exists" message.
   *
   * @param resourceType - Type of resource
   * @param field - Field that has duplicate value
   * @param value - The duplicate value
   * @returns Formatted error message
   *
   * @example
   * ErrorMessages.RESOURCE_ALREADY_EXISTS('Service', 'slug', 'my-service')
   * // => "Service with slug 'my-service' already exists"
   */
  RESOURCE_ALREADY_EXISTS: (
    resourceType: string,
    field: string,
    value: string
  ) => `${resourceType} with ${field} '${value}' already exists`,

  /**
   * Generate a "cannot delete resource" message.
   *
   * @param resourceType - Type of resource
   * @param reason - Reason why deletion failed
   * @returns Formatted error message
   *
   * @example
   * ErrorMessages.CANNOT_DELETE_RESOURCE('Category', 'still has posts')
   * // => "Cannot delete Category: still has posts"
   */
  CANNOT_DELETE_RESOURCE: (resourceType: string, reason: string) =>
    `Cannot delete ${resourceType}: ${reason}`,

  // ========== Authentication & Authorization ==========

  /**
   * Authentication required message.
   */
  UNAUTHORIZED: 'Authentication required',

  /**
   * Invalid credentials message.
   */
  INVALID_CREDENTIALS: 'Invalid email or password',

  /**
   * Session/token expired message.
   */
  TOKEN_EXPIRED: 'Session expired. Please log in again.',

  /**
   * Invalid token format message.
   */
  TOKEN_INVALID: 'Invalid authentication token',

  /**
   * Permission denied message.
   */
  FORBIDDEN: 'You do not have permission to perform this action',

  /**
   * Insufficient role message.
   *
   * @param requiredRole - Required role for the action
   * @returns Formatted error message
   */
  INSUFFICIENT_ROLE: (requiredRole: string) =>
    `This action requires ${requiredRole} role`,

  // ========== Validation ==========

  /**
   * Generic validation failed message.
   */
  VALIDATION_FAILED: 'Validation failed. Please check the required fields.',

  /**
   * Missing required fields message.
   *
   * @param fields - Array of missing field names
   * @returns Formatted error message
   *
   * @example
   * ErrorMessages.MISSING_REQUIRED_FIELDS(['title', 'slug', 'locale'])
   * // => "Missing required fields: title, slug, locale"
   */
  MISSING_REQUIRED_FIELDS: (fields: string[]) =>
    `Missing required fields: ${fields.join(', ')}`,

  /**
   * Invalid field value message.
   *
   * @param field - Field name
   * @param reason - Reason why value is invalid (optional)
   * @returns Formatted error message
   *
   * @example
   * ErrorMessages.INVALID_FIELD_VALUE('email')
   * // => "Invalid value for email"
   *
   * ErrorMessages.INVALID_FIELD_VALUE('status', 'must be draft, published, or archived')
   * // => "Invalid value for status: must be draft, published, or archived"
   */
  INVALID_FIELD_VALUE: (field: string, reason?: string) =>
    reason ? `Invalid value for ${field}: ${reason}` : `Invalid value for ${field}`,

  /**
   * Field too long message.
   *
   * @param field - Field name
   * @param maxLength - Maximum allowed length
   * @returns Formatted error message
   */
  FIELD_TOO_LONG: (field: string, maxLength: number) =>
    `${field} must be at most ${maxLength} characters`,

  /**
   * Field too short message.
   *
   * @param field - Field name
   * @param minLength - Minimum required length
   * @returns Formatted error message
   */
  FIELD_TOO_SHORT: (field: string, minLength: number) =>
    `${field} must be at least ${minLength} characters`,

  // ========== Database Constraints ==========

  /**
   * Foreign key violation message.
   *
   * @param table - Referenced table name
   * @param _field - Foreign key field name (unused but kept for API consistency)
   * @returns Formatted error message
   *
   * @example
   * ErrorMessages.FOREIGN_KEY_VIOLATION('services', 'service_id')
   * // => "Referenced service does not exist"
   */
  FOREIGN_KEY_VIOLATION: (table: string, _field: string) =>
    `Referenced ${table.replace(/_/g, ' ')} does not exist`,

  /**
   * Unique constraint violation message.
   *
   * @param field - Field with duplicate value
   * @returns Formatted error message
   */
  UNIQUE_CONSTRAINT_VIOLATION: (field: string) =>
    `A record with this ${field} already exists`,

  /**
   * Check constraint violation message.
   *
   * @param field - Field that failed check
   * @returns Formatted error message
   */
  CHECK_CONSTRAINT_VIOLATION: (field: string) =>
    `Invalid value for ${field}`,

  /**
   * Not null violation message.
   *
   * @param field - Field that cannot be null
   * @returns Formatted error message
   */
  NOT_NULL_VIOLATION: (field: string) => `${field} is required`,

  // ========== File Upload ==========

  /**
   * File too large message.
   *
   * @param maxSize - Maximum file size in MB
   * @returns Formatted error message
   */
  FILE_TOO_LARGE: (maxSize: number) =>
    `File size exceeds ${maxSize}MB limit`,

  /**
   * Invalid file type message.
   *
   * @param allowedTypes - Array of allowed MIME types or extensions
   * @returns Formatted error message
   */
  INVALID_FILE_TYPE: (allowedTypes: string[]) =>
    `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,

  /**
   * File upload failed message.
   */
  FILE_UPLOAD_FAILED: 'File upload failed',

  // ========== Rate Limiting ==========

  /**
   * Rate limit exceeded message.
   *
   * @param retryAfter - Seconds to wait before retry (optional)
   * @returns Formatted error message
   */
  RATE_LIMIT_EXCEEDED: (retryAfter?: number) =>
    retryAfter
      ? `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      : 'Rate limit exceeded. Please try again later.',

  /**
   * IP blocked message.
   *
   * @param reason - Reason for blocking
   * @returns Formatted error message
   */
  IP_BLOCKED: (reason: string) =>
    `Your IP has been temporarily blocked: ${reason}`,

  // ========== Internal Errors ==========

  /**
   * Generic internal error message.
   */
  INTERNAL_ERROR: 'An unexpected error occurred',

  /**
   * Database unavailable message.
   */
  DATABASE_UNAVAILABLE: 'Database connection failed',

  /**
   * Service unavailable message.
   */
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',

  /**
   * Configuration error message.
   */
  CONFIGURATION_ERROR: 'Server configuration error',

  // ========== Business Logic ==========

  /**
   * Invalid operation message.
   *
   * @param reason - Why the operation is invalid
   * @returns Formatted error message
   */
  INVALID_OPERATION: (reason: string) =>
    `Operation not allowed: ${reason}`,

  /**
   * Conflicting operation message.
   *
   * @param details - Details about the conflict
   * @returns Formatted error message
   */
  OPERATION_CONFLICT: (details: string) =>
    `Operation conflicts with existing data: ${details}`,

  /**
   * Precondition failed message.
   *
   * @param condition - Required condition that failed
   * @returns Formatted error message
   */
  PRECONDITION_FAILED: (condition: string) =>
    `Precondition failed: ${condition}`,
} as const;

/**
 * Get default error message for a given error code.
 *
 * Used as fallback when specific message is not provided.
 *
 * @param code - Error code from ErrorCodes
 * @returns Default message for the code
 *
 * @example
 * getDefaultMessageForCode('NOT_FOUND')
 * // => "Resource not found"
 */
export const getDefaultMessageForCode = (code: string): string => {
  const map: Record<string, string> = {
    [ErrorCodes.VALIDATION_ERROR]: ErrorMessages.VALIDATION_FAILED,
    [ErrorCodes.NOT_FOUND]: ErrorMessages.RESOURCE_NOT_FOUND('Resource'),
    [ErrorCodes.UNAUTHORIZED]: ErrorMessages.UNAUTHORIZED,
    [ErrorCodes.FORBIDDEN]: ErrorMessages.FORBIDDEN,
    [ErrorCodes.CONFLICT]: 'This operation conflicts with existing data',
    [ErrorCodes.INTERNAL_ERROR]: ErrorMessages.INTERNAL_ERROR,
    [ErrorCodes.BAD_REQUEST]: 'Invalid request',
  };

  return map[code] || ErrorMessages.INTERNAL_ERROR;
};

/**
 * Extract required fields from a Zod schema for error messages.
 *
 * This is a helper to generate the `requiredFields` array in validation errors.
 *
 * @param schema - Zod schema object
 * @returns Array of required field names
 *
 * @example
 * const schema = z.object({
 *   title: z.string(),
 *   slug: z.string(),
 *   optional: z.string().optional()
 * });
 *
 * getRequiredFields(schema)
 * // => ['title', 'slug']
 */
export const getRequiredFields = (schema: any): string[] => {
  if (!schema || !schema._def || !schema._def.shape) {
    return [];
  }

  const shape = schema._def.shape();
  const requiredFields: string[] = [];

  for (const [key, value] of Object.entries(shape)) {
    const fieldSchema = value as any;

    // Check if field is optional
    const isOptional =
      fieldSchema._def?.typeName === 'ZodOptional' ||
      fieldSchema.isOptional?.() ||
      fieldSchema._def?.defaultValue !== undefined;

    if (!isOptional) {
      requiredFields.push(key);
    }
  }

  return requiredFields;
};
