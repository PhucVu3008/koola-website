/**
 * Client-side Logger Utility
 * 
 * Production-ready logging system for Next.js frontend.
 * - Respects NODE_ENV (silent in production by default)
 * - Structured logging with context
 * - Can be extended with external services (Sentry, LogRocket, etc.)
 * 
 * Usage:
 * ```typescript
 * import { logger } from '@/lib/logger';
 * 
 * logger.info('User logged in', { userId: 123 });
 * logger.error('API failed', error, { endpoint: '/api/users' });
 * logger.debug('State updated', { oldState, newState });
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

class Logger {
  private isDevelopment: boolean;
  private isEnabled: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    // Enable logging in development, disable in production (unless explicitly enabled)
    this.isEnabled = this.isDevelopment || process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true';
  }

  /**
   * Format log message with timestamp and context
   */
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.isEnabled || !this.isDevelopment) return;
    
    // eslint-disable-next-line no-console
    console.debug(this.format('debug', message, context));
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (!this.isEnabled) return;
    
    // eslint-disable-next-line no-console
    console.info(this.format('info', message, context));
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    if (!this.isEnabled) return;
    
    // eslint-disable-next-line no-console
    console.warn(this.format('warn', message, context));
  }

  /**
   * Log error messages
   * 
   * @param message - Error description
   * @param error - Error object (optional)
   * @param context - Additional context (optional)
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.isEnabled) return;

    const errorContext: LogContext = {
      ...context,
    };

    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    } else if (error) {
      errorContext.error = error;
    }

    // eslint-disable-next-line no-console
    console.error(this.format('error', message, errorContext));

    // TODO: Send to error tracking service in production
    // if (!this.isDevelopment) {
    //   Sentry.captureException(error, { extra: context });
    // }
  }

  /**
   * Group related logs together (development only)
   */
  group(label: string, fn: () => void): void {
    if (!this.isEnabled || !this.isDevelopment) {
      fn();
      return;
    }

    // eslint-disable-next-line no-console
    console.group(label);
    fn();
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Type-safe context helpers
 */
export const LogContext = {
  auth: (userId?: number, email?: string) => ({ userId, email }),
  api: (endpoint: string, method: string, status?: number) => ({ endpoint, method, status }),
  form: (formName: string, action: string) => ({ formName, action }),
  admin: (action: string, resource: string, resourceId?: number) => ({ action, resource, resourceId }),
} as const;
