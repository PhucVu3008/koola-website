/**
 * MetricsCollector - Production-grade metrics collection system
 * 
 * Features:
 * - HTTP metrics (requests, response times, status codes)
 * - Database metrics (queries, connection pool)
 * - Business metrics (leads, registrations, content views)
 * - System metrics (memory, CPU when available)
 * - Time-windowed aggregations (1m, 5m, 15m, 1h)
 * 
 * Usage:
 * ```ts
 * import { metrics } from './monitoring/MetricsCollector';
 * 
 * metrics.recordHttpRequest('GET', '/api/services', 200, 45.3);
 * metrics.recordDbQuery('SELECT', 'services', 23.1, true);
 * metrics.recordBusinessEvent('lead_created', { source: 'contact_form' });
 * 
 * const snapshot = metrics.getSnapshot();
 * ```
 * 
 * Design:
 * - In-memory storage with circular buffers (last 1 hour)
 * - Zero external dependencies (no Prometheus/StatsD required)
 * - Production-ready aggregations
 * - Thread-safe counters
 */

import { EventEmitter } from 'events';

// ==================== Types ====================

interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  labels?: Record<string, string>;
}

interface Counter {
  count: number;
  lastIncrement: number;
}

interface Histogram {
  count: number;
  sum: number;
  min: number;
  max: number;
  p50: number;
  p95: number;
  p99: number;
  samples: number; // Number of samples collected
}

interface HttpMetrics {
  totalRequests: number;
  requestsByMethod: Record<string, number>;
  requestsByStatus: Record<string, number>;
  requestsByPath: Record<string, number>;
  responseTime: Histogram;
  activeRequests: number;
  errorRate: number; // Percentage of 5xx responses
}

interface DatabaseMetrics {
  totalQueries: number;
  queriesByType: Record<string, number>; // SELECT, INSERT, UPDATE, DELETE
  queriesByTable: Record<string, string>; // Table name -> count
  queryTime: Histogram;
  connectionPoolSize: number;
  activeConnections: number;
  idleConnections: number;
  waitingClients: number;
  errors: number;
}

interface BusinessMetrics {
  leads: Counter;
  newsletterSubscriptions: Counter;
  jobApplications: Counter;
  serviceViews: Counter;
  postViews: Counter;
  customEvents: Map<string, Counter>;
}

interface SystemMetrics {
  memoryUsage: {
    rss: number; // Resident Set Size
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  uptime: number;
  processId: number;
}

export interface MetricsSnapshot {
  timestamp: number;
  http: HttpMetrics;
  database: DatabaseMetrics;
  business: BusinessMetrics;
  system: SystemMetrics;
  period: {
    start: number;
    end: number;
    durationMs: number;
  };
}

// ==================== Histogram Helper ====================

class HistogramHelper {
  private samples: number[] = [];
  private maxSamples: number;

  constructor(maxSamples = 1000) {
    this.maxSamples = maxSamples;
  }

  add(value: number): void {
    this.samples.push(value);
    
    // Keep only recent samples (circular buffer)
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  getStats(): Histogram {
    if (this.samples.length === 0) {
      return {
        count: 0,
        sum: 0,
        min: 0,
        max: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        samples: 0,
      };
    }

    const sorted = [...this.samples].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);

    return {
      count: sorted.length,
      sum,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: this.percentile(sorted, 50),
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99),
      samples: sorted.length,
    };
  }

  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil((sorted.length * p) / 100) - 1;
    return sorted[Math.max(0, index)];
  }

  reset(): void {
    this.samples = [];
  }
}

// ==================== MetricsCollector Class ====================

export class MetricsCollector extends EventEmitter {
  private startTime: number;
  
  // HTTP Metrics
  private totalRequests = 0;
  private requestsByMethod: Map<string, number> = new Map();
  private requestsByStatus: Map<number, number> = new Map();
  private requestsByPath: Map<string, number> = new Map();
  private responseTimeHistogram: HistogramHelper;
  private activeRequests = 0;
  private errorCount = 0;

  // Database Metrics
  private totalQueries = 0;
  private queriesByType: Map<string, number> = new Map();
  private queriesByTable: Map<string, number> = new Map();
  private queryTimeHistogram: HistogramHelper;
  private dbErrors = 0;
  private poolSize = 0;
  private activeConnections = 0;
  private idleConnections = 0;
  private waitingClients = 0;

  // Business Metrics
  private leads: Counter = { count: 0, lastIncrement: Date.now() };
  private newsletterSubs: Counter = { count: 0, lastIncrement: Date.now() };
  private jobApps: Counter = { count: 0, lastIncrement: Date.now() };
  private serviceViews: Counter = { count: 0, lastIncrement: Date.now() };
  private postViews: Counter = { count: 0, lastIncrement: Date.now() };
  private customEvents: Map<string, Counter> = new Map();

  // Time-series data (last 1 hour)
  private timeSeries: Map<string, TimeSeriesPoint[]> = new Map();

  constructor() {
    super();
    this.startTime = Date.now();
    this.responseTimeHistogram = new HistogramHelper(1000);
    this.queryTimeHistogram = new HistogramHelper(1000);

    // Clean up old time-series data every 5 minutes
    setInterval(() => this.cleanupTimeSeries(), 5 * 60 * 1000);
  }

  // ==================== HTTP Metrics ====================

  /**
   * Record HTTP request.
   * 
   * @param method HTTP method (GET, POST, etc.)
   * @param path Request path
   * @param statusCode Response status code
   * @param durationMs Response time in milliseconds
   */
  recordHttpRequest(method: string, path: string, statusCode: number, durationMs: number): void {
    this.totalRequests++;
    
    // Method
    const methodCount = this.requestsByMethod.get(method) || 0;
    this.requestsByMethod.set(method, methodCount + 1);

    // Status
    const statusCount = this.requestsByStatus.get(statusCode) || 0;
    this.requestsByStatus.set(statusCode, statusCount + 1);

    // Path (limit to top 100 paths to prevent memory leak)
    if (this.requestsByPath.size < 100 || this.requestsByPath.has(path)) {
      const pathCount = this.requestsByPath.get(path) || 0;
      this.requestsByPath.set(path, pathCount + 1);
    }

    // Response time
    this.responseTimeHistogram.add(durationMs);

    // Error tracking (5xx)
    if (statusCode >= 500) {
      this.errorCount++;
    }

    // Time-series
    this.addTimeSeriesPoint('http.requests', 1);
    this.addTimeSeriesPoint(`http.status.${Math.floor(statusCode / 100)}xx`, 1);
    this.addTimeSeriesPoint('http.response_time', durationMs);

    // Emit event for real-time monitoring
    this.emit('http.request', { method, path, statusCode, durationMs });
  }

  /**
   * Increment active requests counter.
   * Call this at the start of request handling.
   */
  incrementActiveRequests(): void {
    this.activeRequests++;
    this.addTimeSeriesPoint('http.active_requests', this.activeRequests);
  }

  /**
   * Decrement active requests counter.
   * Call this at the end of request handling.
   */
  decrementActiveRequests(): void {
    this.activeRequests--;
    this.addTimeSeriesPoint('http.active_requests', this.activeRequests);
  }

  // ==================== Database Metrics ====================

  /**
   * Record database query.
   * 
   * @param queryType SQL command (SELECT, INSERT, UPDATE, DELETE, etc.)
   * @param table Table name (parsed from query)
   * @param durationMs Query execution time in milliseconds
   * @param success Whether query succeeded
   */
  recordDbQuery(queryType: string, table: string, durationMs: number, success = true): void {
    this.totalQueries++;

    // Query type
    const typeCount = this.queriesByType.get(queryType) || 0;
    this.queriesByType.set(queryType, typeCount + 1);

    // Table (limit to top 50 tables)
    if (this.queriesByTable.size < 50 || this.queriesByTable.has(table)) {
      const tableCount = this.queriesByTable.get(table) || 0;
      this.queriesByTable.set(table, tableCount + 1);
    }

    // Query time
    this.queryTimeHistogram.add(durationMs);

    // Errors
    if (!success) {
      this.dbErrors++;
    }

    // Time-series
    this.addTimeSeriesPoint('db.queries', 1);
    this.addTimeSeriesPoint('db.query_time', durationMs);

    // Emit event
    this.emit('db.query', { queryType, table, durationMs, success });
  }

  /**
   * Update database connection pool metrics.
   * 
   * @param stats Pool stats from pg.Pool
   */
  updateDbPoolStats(stats: {
    total: number;
    idle: number;
    waiting: number;
  }): void {
    this.poolSize = stats.total;
    this.idleConnections = stats.idle;
    this.activeConnections = stats.total - stats.idle;
    this.waitingClients = stats.waiting;

    this.addTimeSeriesPoint('db.pool.active', this.activeConnections);
    this.addTimeSeriesPoint('db.pool.idle', this.idleConnections);
    this.addTimeSeriesPoint('db.pool.waiting', this.waitingClients);
  }

  // ==================== Business Metrics ====================

  /**
   * Record business event.
   * 
   * @param eventName Event name (e.g., 'lead_created', 'user_registered')
   * @param metadata Optional metadata for the event
   */
  recordBusinessEvent(eventName: string, metadata?: Record<string, any>): void {
    switch (eventName) {
      case 'lead_created':
        this.incrementCounter(this.leads);
        break;
      case 'newsletter_subscription':
        this.incrementCounter(this.newsletterSubs);
        break;
      case 'job_application':
        this.incrementCounter(this.jobApps);
        break;
      case 'service_view':
        this.incrementCounter(this.serviceViews);
        break;
      case 'post_view':
        this.incrementCounter(this.postViews);
        break;
      default:
        // Custom event
        const counter = this.customEvents.get(eventName) || { count: 0, lastIncrement: Date.now() };
        this.incrementCounter(counter);
        this.customEvents.set(eventName, counter);
    }

    this.addTimeSeriesPoint(`business.${eventName}`, 1);
    this.emit('business.event', { eventName, metadata });
  }

  private incrementCounter(counter: Counter): void {
    counter.count++;
    counter.lastIncrement = Date.now();
  }

  // ==================== System Metrics ====================

  /**
   * Get current system metrics (memory, uptime, etc.)
   */
  getSystemMetrics(): SystemMetrics {
    const mem = process.memoryUsage();
    return {
      memoryUsage: {
        rss: mem.rss,
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
        external: mem.external,
      },
      uptime: Date.now() - this.startTime,
      processId: process.pid,
    };
  }

  // ==================== Time-Series Management ====================

  private addTimeSeriesPoint(metric: string, value: number): void {
    const points = this.timeSeries.get(metric) || [];
    points.push({ timestamp: Date.now(), value });

    // Keep only last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const filtered = points.filter(p => p.timestamp > oneHourAgo);

    this.timeSeries.set(metric, filtered);
  }

  private cleanupTimeSeries(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    for (const [metric, points] of this.timeSeries.entries()) {
      const filtered = points.filter(p => p.timestamp > oneHourAgo);
      this.timeSeries.set(metric, filtered);
    }
  }

  // ==================== Snapshot & Reporting ====================

  /**
   * Get complete metrics snapshot.
   * Use this for monitoring dashboards and health checks.
   */
  getSnapshot(): MetricsSnapshot {
    const now = Date.now();
    const responseTimeStats = this.responseTimeHistogram.getStats();
    const queryTimeStats = this.queryTimeHistogram.getStats();

    return {
      timestamp: now,
      http: {
        totalRequests: this.totalRequests,
        requestsByMethod: this.mapToRecord(this.requestsByMethod),
        requestsByStatus: this.mapToRecord(this.requestsByStatus),
        requestsByPath: this.mapToRecord(this.requestsByPath),
        responseTime: responseTimeStats,
        activeRequests: this.activeRequests,
        errorRate: this.totalRequests > 0 ? (this.errorCount / this.totalRequests) * 100 : 0,
      },
      database: {
        totalQueries: this.totalQueries,
        queriesByType: this.mapToRecord(this.queriesByType),
        queriesByTable: this.mapToRecord(this.queriesByTable),
        queryTime: queryTimeStats,
        connectionPoolSize: this.poolSize,
        activeConnections: this.activeConnections,
        idleConnections: this.idleConnections,
        waitingClients: this.waitingClients,
        errors: this.dbErrors,
      },
      business: {
        leads: this.leads,
        newsletterSubscriptions: this.newsletterSubs,
        jobApplications: this.jobApps,
        serviceViews: this.serviceViews,
        postViews: this.postViews,
        customEvents: this.customEvents,
      },
      system: this.getSystemMetrics(),
      period: {
        start: this.startTime,
        end: now,
        durationMs: now - this.startTime,
      },
    };
  }

  /**
   * Get time-series data for a specific metric.
   * 
   * @param metric Metric name (e.g., 'http.requests', 'db.query_time')
   * @param window Time window in milliseconds (default: 1 hour)
   */
  getTimeSeries(metric: string, window = 60 * 60 * 1000): TimeSeriesPoint[] {
    const points = this.timeSeries.get(metric) || [];
    const cutoff = Date.now() - window;
    return points.filter(p => p.timestamp > cutoff);
  }

  /**
   * Get aggregated metrics for a time window.
   * 
   * @param window Time window in milliseconds
   */
  getAggregated(window = 60 * 1000): Record<string, number> {
    const cutoff = Date.now() - window;
    const aggregated: Record<string, number> = {};

    for (const [metric, points] of this.timeSeries.entries()) {
      const windowPoints = points.filter(p => p.timestamp > cutoff);
      
      if (windowPoints.length > 0) {
        const sum = windowPoints.reduce((acc, p) => acc + p.value, 0);
        const avg = sum / windowPoints.length;
        aggregated[`${metric}.sum`] = sum;
        aggregated[`${metric}.avg`] = avg;
        aggregated[`${metric}.count`] = windowPoints.length;
      }
    }

    return aggregated;
  }

  /**
   * Reset all metrics.
   * Use this for testing or when starting a new monitoring period.
   */
  reset(): void {
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.requestsByMethod.clear();
    this.requestsByStatus.clear();
    this.requestsByPath.clear();
    this.responseTimeHistogram.reset();
    this.activeRequests = 0;
    this.errorCount = 0;

    this.totalQueries = 0;
    this.queriesByType.clear();
    this.queriesByTable.clear();
    this.queryTimeHistogram.reset();
    this.dbErrors = 0;

    this.leads = { count: 0, lastIncrement: Date.now() };
    this.newsletterSubs = { count: 0, lastIncrement: Date.now() };
    this.jobApps = { count: 0, lastIncrement: Date.now() };
    this.serviceViews = { count: 0, lastIncrement: Date.now() };
    this.postViews = { count: 0, lastIncrement: Date.now() };
    this.customEvents.clear();

    this.timeSeries.clear();
  }

  // ==================== Helpers ====================

  private mapToRecord<K extends string | number, V>(map: Map<K, V>): Record<string, any> {
    const record: Record<string, any> = {};
    for (const [key, value] of map.entries()) {
      record[String(key)] = value;
    }
    return record;
  }
}

// ==================== Singleton Export ====================

/**
 * Global metrics collector instance.
 * Import this to record metrics from anywhere in your application.
 * 
 * @example
 * ```ts
 * import { metrics } from './monitoring/MetricsCollector';
 * 
 * // Record HTTP request
 * metrics.recordHttpRequest('GET', '/api/services', 200, 45.3);
 * 
 * // Record database query
 * metrics.recordDbQuery('SELECT', 'services', 23.1, true);
 * 
 * // Record business event
 * metrics.recordBusinessEvent('lead_created', { source: 'contact_form' });
 * 
 * // Get metrics snapshot
 * const snapshot = metrics.getSnapshot();
 * console.log('Total requests:', snapshot.http.totalRequests);
 * console.log('Average response time:', snapshot.http.responseTime.p50, 'ms');
 * ```
 */
export const metrics = new MetricsCollector();
