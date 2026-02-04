/**
 * Database Performance Monitor
 * 
 * Features:
 * - Automatic query performance tracking
 * - Slow query detection and logging
 * - Connection pool monitoring
 * - Query pattern analysis
 * - Integration with MetricsCollector
 * - HOC wrapper for automatic instrumentation
 * 
 * Usage:
 * ```ts
 * import { withDbPerformanceMonitoring } from './monitoring/dbPerformanceMonitor';
 * 
 * // Wrap your query function
 * export const getServiceById = withDbPerformanceMonitoring(
 *   async (id: number) => {
 *     return await pool.query('SELECT * FROM services WHERE id = $1', [id]);
 *   },
 *   { operation: 'SELECT', table: 'services' }
 * );
 * ```
 * 
 * Slow Query Threshold:
 * - Default: 100ms
 * - Configurable via `DB_SLOW_QUERY_THRESHOLD_MS` env var
 */

import { pool } from '../db';
import { metrics } from './MetricsCollector';

// ==================== Types ====================

export interface DbQueryContext {
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'OTHER';
  table?: string;
  description?: string;
}

export interface SlowQueryLog {
  timestamp: number;
  query: string;
  duration: number;
  operation: string;
  table?: string;
  params?: any[];
  stackTrace?: string;
}

// ==================== Configuration ====================

const SLOW_QUERY_THRESHOLD_MS = Number(process.env.DB_SLOW_QUERY_THRESHOLD_MS) || 100;
const MAX_SLOW_QUERY_LOGS = 100; // Keep last 100 slow queries in memory

// ==================== State ====================

const slowQueryLogs: SlowQueryLog[] = [];
const queryPatterns: Map<string, { count: number; totalDuration: number }> = new Map();

// ==================== Helper Functions ====================

/**
 * Sanitize query for logging (remove sensitive data from params).
 */
function sanitizeParams(params: any[] | undefined): any[] | undefined {
  if (!params || params.length === 0) return undefined;
  
  return params.map(param => {
    if (typeof param === 'string') {
      // Check if looks like password/token
      if (param.length > 20 && /^[A-Za-z0-9+/=]+$/.test(param)) {
        return '[REDACTED_TOKEN]';
      }
      // Truncate long strings
      if (param.length > 100) {
        return param.substring(0, 100) + '... (truncated)';
      }
    }
    return param;
  });
}

/**
 * Log slow query with context.
 */
function logSlowQuery(log: SlowQueryLog): void {
  // Add to in-memory log (circular buffer)
  slowQueryLogs.push(log);
  if (slowQueryLogs.length > MAX_SLOW_QUERY_LOGS) {
    slowQueryLogs.shift();
  }

  // Log to console (production: this goes to logging system)
  console.warn('🐌 Slow query detected', {
    duration: `${log.duration}ms`,
    operation: log.operation,
    table: log.table,
    query: log.query.substring(0, 200),
    timestamp: new Date(log.timestamp).toISOString(),
  });
}

/**
 * Track query pattern for analysis.
 */
function trackQueryPattern(query: string, duration: number): void {
  // Normalize query (replace parameters with placeholders)
  const normalized = query.replace(/\$\d+/g, '$?').replace(/\s+/g, ' ').trim();
  
  const pattern = queryPatterns.get(normalized) || { count: 0, totalDuration: 0 };
  pattern.count++;
  pattern.totalDuration += duration;
  
  queryPatterns.set(normalized, pattern);
  
  // Limit size (keep top 200 patterns)
  if (queryPatterns.size > 200) {
    // Remove least frequent pattern
    let minCount = Infinity;
    let minKey = '';
    
    for (const [key, value] of queryPatterns.entries()) {
      if (value.count < minCount) {
        minCount = value.count;
        minKey = key;
      }
    }
    
    if (minKey) {
      queryPatterns.delete(minKey);
    }
  }
}

// ==================== Monitoring Functions ====================

/**
 * Monitor connection pool stats (call periodically).
 * 
 * @example
 * ```ts
 * // In server.ts
 * setInterval(() => {
 *   monitorConnectionPool();
 * }, 10000); // Every 10 seconds
 * ```
 */
export function monitorConnectionPool(): void {
  const stats = {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };

  // Update metrics
  metrics.updateDbPoolStats(stats);

  // Log if pool is stressed
  const activeConnections = stats.total - stats.idle;
  const utilizationPercent = (activeConnections / stats.total) * 100;

  if (utilizationPercent > 80 || stats.waiting > 0) {
    console.warn('⚠️  Database connection pool stress detected', {
      active: activeConnections,
      idle: stats.idle,
      waiting: stats.waiting,
      utilization: `${utilizationPercent.toFixed(1)}%`,
    });
  }
}

/**
 * Get slow query logs.
 * Returns the last N slow queries.
 */
export function getSlowQueryLogs(limit = 50): SlowQueryLog[] {
  return slowQueryLogs.slice(-limit);
}

/**
 * Get query pattern analysis.
 * Returns top N most frequent query patterns with avg duration.
 */
export function getQueryPatternAnalysis(limit = 20): Array<{
  query: string;
  count: number;
  avgDuration: number;
  totalDuration: number;
}> {
  const patterns = Array.from(queryPatterns.entries())
    .map(([query, stats]) => ({
      query,
      count: stats.count,
      avgDuration: stats.totalDuration / stats.count,
      totalDuration: stats.totalDuration,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return patterns;
}

/**
 * Clear all monitoring data.
 * Use for testing or to reset stats.
 */
export function clearMonitoringData(): void {
  slowQueryLogs.length = 0;
  queryPatterns.clear();
}

// ==================== HOC Wrapper ====================

/**
 * Higher-Order Function to wrap database queries with performance monitoring.
 * 
 * Features:
 * - Automatic duration tracking
 * - Slow query detection
 * - Query pattern analysis
 * - Metrics recording
 * - Error tracking
 * 
 * @param queryFn Function that executes database query
 * @param context Query context (operation, table, description)
 * @returns Wrapped function with monitoring
 * 
 * @example
 * ```ts
 * // In repository:
 * export const getServiceById = withDbPerformanceMonitoring(
 *   async (id: number) => {
 *     return await pool.query('SELECT * FROM services WHERE id = $1', [id]);
 *   },
 *   { operation: 'SELECT', table: 'services', description: 'Get service by ID' }
 * );
 * 
 * // Usage:
 * const service = await getServiceById(123);
 * ```
 */
export function withDbPerformanceMonitoring<Args extends any[], Result>(
  queryFn: (...args: Args) => Promise<Result>,
  context: DbQueryContext
): (...args: Args) => Promise<Result> {
  return async (...args: Args): Promise<Result> => {
    const startTime = Date.now();
    let success = true;
    let query = context.description || 'Unknown query';

    try {
      // Execute query
      const result = await queryFn(...args);
      
      // Try to extract actual query from result if available
      // (pg returns query on result object in some cases)
      if (result && typeof result === 'object' && 'command' in result) {
        query = (result as any).command || query;
      }

      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - startTime;

      // Record metrics
      metrics.recordDbQuery(context.operation, context.table || 'unknown', duration, success);

      // Track query pattern
      trackQueryPattern(query, duration);

      // Check if slow query
      if (duration > SLOW_QUERY_THRESHOLD_MS) {
        const slowLog: SlowQueryLog = {
          timestamp: Date.now(),
          query,
          duration,
          operation: context.operation,
          table: context.table,
          params: sanitizeParams(args as any[]),
          stackTrace: process.env.NODE_ENV === 'development' 
            ? new Error().stack 
            : undefined,
        };

        logSlowQuery(slowLog);
      }
    }
  };
}

/**
 * Wrap raw pg query with monitoring.
 * Use this when you can't use the HOC pattern.
 * 
 * @example
 * ```ts
 * import { monitoredQuery } from './monitoring/dbPerformanceMonitor';
 * 
 * const result = await monitoredQuery(
 *   pool.query('SELECT * FROM services WHERE id = $1', [id]),
 *   { operation: 'SELECT', table: 'services', query: 'SELECT * FROM services WHERE id = $1' }
 * );
 * ```
 */
export async function monitoredQuery<T>(
  queryPromise: Promise<T>,
  context: DbQueryContext & { query: string }
): Promise<T> {
  const startTime = Date.now();
  let success = true;

  try {
    const result = await queryPromise;
    return result;
  } catch (error) {
    success = false;
    throw error;
  } finally {
    const duration = Date.now() - startTime;

    // Record metrics
    metrics.recordDbQuery(context.operation, context.table || 'unknown', duration, success);

    // Track query pattern
    trackQueryPattern(context.query, duration);

    // Check if slow query
    if (duration > SLOW_QUERY_THRESHOLD_MS) {
      const slowLog: SlowQueryLog = {
        timestamp: Date.now(),
        query: context.query,
        duration,
        operation: context.operation,
        table: context.table,
        stackTrace: process.env.NODE_ENV === 'development' 
          ? new Error().stack 
          : undefined,
      };

      logSlowQuery(slowLog);
    }
  }
}

// ==================== Setup Function ====================

/**
 * Setup database performance monitoring.
 * Call this once during server initialization.
 * 
 * @example
 * ```ts
 * // In server.ts or index.ts
 * import { setupDbPerformanceMonitoring } from './monitoring/dbPerformanceMonitor';
 * 
 * setupDbPerformanceMonitoring();
 * ```
 */
export function setupDbPerformanceMonitoring(): void {
  // Monitor connection pool every 10 seconds
  setInterval(() => {
    monitorConnectionPool();
  }, 10000);

  // Listen to pool events
  pool.on('connect', () => {
    metrics.recordBusinessEvent('db_connection_acquired');
  });

  pool.on('remove', () => {
    metrics.recordBusinessEvent('db_connection_removed');
  });

  pool.on('error', (err) => {
    console.error('❌ Database pool error:', {
      error: err.message,
      code: (err as any).code,
    });
    metrics.recordBusinessEvent('db_pool_error');
  });

  console.log('✅ Database performance monitoring enabled');
  console.log(`   Slow query threshold: ${SLOW_QUERY_THRESHOLD_MS}ms`);
}
