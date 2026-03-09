/**
 * Monitoring Routes - API endpoints for observability
 * 
 * Endpoints:
 * - GET /metrics -> Prometheus-compatible metrics
 * - GET /metrics/json -> JSON metrics snapshot
 * - GET /metrics/db -> Database performance metrics
 * - GET /health -> Basic liveness check
 * - GET /health/ready -> Readiness check
 * - GET /health/full -> Detailed health report
 * 
 * Security:
 * - Metrics endpoints should be protected in production
 * - Consider IP whitelisting or bearer token auth
 * - Health endpoints can be public (for K8s probes)
 * 
 * @example
 * ```ts
 * // In routes/index.ts
 * import monitoringRoutes from './monitoring';
 * 
 * await server.register(monitoringRoutes, { prefix: '/monitoring' });
 * ```
 */

import type { FastifyPluginAsync } from 'fastify';
import { metrics } from '../monitoring/MetricsCollector';
import { healthCheck } from '../monitoring/HealthCheck';
import {
  getSlowQueryLogs,
  getQueryPatternAnalysis
} from '../monitoring/dbPerformanceMonitor';
import { healthSchemas } from '../swagger/schemas';

/**
 * Convert metrics snapshot to Prometheus text format.
 * 
 * Format:
 * ```
 * # HELP metric_name Description
 * # TYPE metric_name type
 * metric_name{label="value"} value timestamp
 * ```
 */
function toPrometheusFormat(snapshot: any): string {
  const lines: string[] = [];
  const timestamp = snapshot.timestamp;

  // HTTP metrics
  lines.push('# HELP http_requests_total Total HTTP requests');
  lines.push('# TYPE http_requests_total counter');
  lines.push(`http_requests_total ${snapshot.http.totalRequests} ${timestamp}`);

  lines.push('# HELP http_requests_by_method HTTP requests by method');
  lines.push('# TYPE http_requests_by_method counter');
  for (const [method, count] of Object.entries(snapshot.http.requestsByMethod)) {
    lines.push(`http_requests_by_method{method="${method}"} ${count} ${timestamp}`);
  }

  lines.push('# HELP http_requests_by_status HTTP requests by status code');
  lines.push('# TYPE http_requests_by_status counter');
  for (const [status, count] of Object.entries(snapshot.http.requestsByStatus)) {
    lines.push(`http_requests_by_status{status="${status}"} ${count} ${timestamp}`);
  }

  lines.push('# HELP http_response_time_seconds HTTP response time in seconds');
  lines.push('# TYPE http_response_time_seconds summary');
  const rt = snapshot.http.responseTime;
  lines.push(`http_response_time_seconds{quantile="0.5"} ${(rt.p50 / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`http_response_time_seconds{quantile="0.95"} ${(rt.p95 / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`http_response_time_seconds{quantile="0.99"} ${(rt.p99 / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`http_response_time_seconds_sum ${(rt.sum / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`http_response_time_seconds_count ${rt.count} ${timestamp}`);

  lines.push('# HELP http_active_requests Current active HTTP requests');
  lines.push('# TYPE http_active_requests gauge');
  lines.push(`http_active_requests ${snapshot.http.activeRequests} ${timestamp}`);

  lines.push('# HELP http_error_rate HTTP error rate (5xx responses)');
  lines.push('# TYPE http_error_rate gauge');
  lines.push(`http_error_rate ${snapshot.http.errorRate.toFixed(2)} ${timestamp}`);

  // Database metrics
  lines.push('# HELP db_queries_total Total database queries');
  lines.push('# TYPE db_queries_total counter');
  lines.push(`db_queries_total ${snapshot.database.totalQueries} ${timestamp}`);

  lines.push('# HELP db_queries_by_type Database queries by type');
  lines.push('# TYPE db_queries_by_type counter');
  for (const [type, count] of Object.entries(snapshot.database.queriesByType)) {
    lines.push(`db_queries_by_type{type="${type}"} ${count} ${timestamp}`);
  }

  lines.push('# HELP db_query_time_seconds Database query time in seconds');
  lines.push('# TYPE db_query_time_seconds summary');
  const qt = snapshot.database.queryTime;
  lines.push(`db_query_time_seconds{quantile="0.5"} ${(qt.p50 / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`db_query_time_seconds{quantile="0.95"} ${(qt.p95 / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`db_query_time_seconds{quantile="0.99"} ${(qt.p99 / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`db_query_time_seconds_sum ${(qt.sum / 1000).toFixed(3)} ${timestamp}`);
  lines.push(`db_query_time_seconds_count ${qt.count} ${timestamp}`);

  lines.push('# HELP db_pool_size Database connection pool size');
  lines.push('# TYPE db_pool_size gauge');
  lines.push(`db_pool_size ${snapshot.database.connectionPoolSize} ${timestamp}`);

  lines.push('# HELP db_pool_active Active database connections');
  lines.push('# TYPE db_pool_active gauge');
  lines.push(`db_pool_active ${snapshot.database.activeConnections} ${timestamp}`);

  lines.push('# HELP db_pool_idle Idle database connections');
  lines.push('# TYPE db_pool_idle gauge');
  lines.push(`db_pool_idle ${snapshot.database.idleConnections} ${timestamp}`);

  lines.push('# HELP db_pool_waiting Clients waiting for database connection');
  lines.push('# TYPE db_pool_waiting gauge');
  lines.push(`db_pool_waiting ${snapshot.database.waitingClients} ${timestamp}`);

  // Business metrics
  lines.push('# HELP business_leads_total Total leads created');
  lines.push('# TYPE business_leads_total counter');
  lines.push(`business_leads_total ${snapshot.business.leads.count} ${timestamp}`);

  lines.push('# HELP business_newsletter_subscriptions_total Total newsletter subscriptions');
  lines.push('# TYPE business_newsletter_subscriptions_total counter');
  lines.push(`business_newsletter_subscriptions_total ${snapshot.business.newsletterSubscriptions.count} ${timestamp}`);

  lines.push('# HELP business_job_applications_total Total job applications');
  lines.push('# TYPE business_job_applications_total counter');
  lines.push(`business_job_applications_total ${snapshot.business.jobApplications.count} ${timestamp}`);

  // System metrics
  lines.push('# HELP process_memory_rss_bytes Process resident set size in bytes');
  lines.push('# TYPE process_memory_rss_bytes gauge');
  lines.push(`process_memory_rss_bytes ${snapshot.system.memoryUsage.rss} ${timestamp}`);

  lines.push('# HELP process_memory_heap_used_bytes Process heap used in bytes');
  lines.push('# TYPE process_memory_heap_used_bytes gauge');
  lines.push(`process_memory_heap_used_bytes ${snapshot.system.memoryUsage.heapUsed} ${timestamp}`);

  lines.push('# HELP process_memory_heap_total_bytes Process heap total in bytes');
  lines.push('# TYPE process_memory_heap_total_bytes gauge');
  lines.push(`process_memory_heap_total_bytes ${snapshot.system.memoryUsage.heapTotal} ${timestamp}`);

  lines.push('# HELP process_uptime_seconds Process uptime in seconds');
  lines.push('# TYPE process_uptime_seconds counter');
  lines.push(`process_uptime_seconds ${(snapshot.system.uptime / 1000).toFixed(3)} ${timestamp}`);

  return lines.join('\n') + '\n';
}

/**
 * Monitoring routes.
 */
const monitoringRoutes: FastifyPluginAsync = async (server) => {
  
  // ==================== Health Checks ====================

  /**
   * GET /health
   * 
   * Basic liveness check (K8s liveness probe).
   * Always returns 200 if process is alive.
   */
  server.get('/health', { schema: healthSchemas.liveness }, async (_request, reply) => {
    const result = await healthCheck.liveness();
    return reply.status(200).send(result);
  });

  /**
   * GET /health/ready
   * 
   * Readiness check (K8s readiness probe).
   * Returns 200 if ready to serve traffic, 503 if not ready.
   */
  server.get('/health/ready', { schema: healthSchemas.readiness }, async (_request, reply) => {
    const result = await healthCheck.readiness();
    const statusCode = result.ready ? 200 : 503;
    return reply.status(statusCode).send(result);
  });

  /**
   * GET /health/full
   * 
   * Detailed health report with component status.
   * Returns 200 if healthy, 200 if degraded, 503 if unhealthy.
   */
  server.get('/health/full', { schema: healthSchemas.full }, async (_request, reply) => {
    const result = await healthCheck.full();
    const statusCode = result.status === 'unhealthy' ? 503 : 200;
    return reply.status(statusCode).send(result);
  });

  // ==================== Metrics ====================

  /**
   * GET /metrics
   * 
   * Prometheus-compatible metrics in text format.
   * Use this with Prometheus scraper.
   */
  server.get('/metrics', { schema: healthSchemas.metrics }, async (_request, reply) => {
    const snapshot = metrics.getSnapshot();
    const prometheusText = toPrometheusFormat(snapshot);
    
    return reply
      .type('text/plain; version=0.0.4; charset=utf-8')
      .send(prometheusText);
  });

  /**
   * GET /metrics/json
   * 
   * Complete metrics snapshot in JSON format.
   * Use for custom monitoring dashboards.
   */
  server.get('/metrics/json', { schema: healthSchemas.metricsJson }, async (_request, reply) => {
    const snapshot = metrics.getSnapshot();
    return reply.send({
      data: snapshot,
      meta: {
        format: 'json',
        version: '1.0.0',
      },
    });
  });

  /**
   * GET /metrics/db
   * 
   * Database-specific performance metrics.
   * Includes slow queries and query pattern analysis.
   */
  server.get('/metrics/db', { schema: healthSchemas.metricsDb }, async (_request, reply) => {
    const slowQueries = getSlowQueryLogs(50);
    const queryPatterns = getQueryPatternAnalysis(20);
    const snapshot = metrics.getSnapshot();

    return reply.send({
      data: {
        overview: {
          totalQueries: snapshot.database.totalQueries,
          avgQueryTime: snapshot.database.queryTime.p50,
          p95QueryTime: snapshot.database.queryTime.p95,
          p99QueryTime: snapshot.database.queryTime.p99,
          errors: snapshot.database.errors,
          errorRate: snapshot.database.totalQueries > 0 
            ? (snapshot.database.errors / snapshot.database.totalQueries * 100).toFixed(2) + '%'
            : '0%',
        },
        connectionPool: {
          size: snapshot.database.connectionPoolSize,
          active: snapshot.database.activeConnections,
          idle: snapshot.database.idleConnections,
          waiting: snapshot.database.waitingClients,
          utilization: snapshot.database.connectionPoolSize > 0
            ? ((snapshot.database.activeConnections / snapshot.database.connectionPoolSize) * 100).toFixed(1) + '%'
            : '0%',
        },
        slowQueries: {
          threshold: process.env.DB_SLOW_QUERY_THRESHOLD_MS || '100ms',
          count: slowQueries.length,
          recent: slowQueries.slice(-10).map(q => ({
            timestamp: new Date(q.timestamp).toISOString(),
            duration: `${q.duration}ms`,
            operation: q.operation,
            table: q.table,
            query: q.query.substring(0, 150) + (q.query.length > 150 ? '...' : ''),
          })),
        },
        queryPatterns: queryPatterns.map(p => ({
          query: p.query.substring(0, 100) + (p.query.length > 100 ? '...' : ''),
          count: p.count,
          avgDuration: `${p.avgDuration.toFixed(2)}ms`,
          totalDuration: `${p.totalDuration.toFixed(2)}ms`,
        })),
      },
      meta: {
        timestamp: Date.now(),
      },
    });
  });

  /**
   * GET /metrics/timeseries
   * 
   * Time-series data for specific metrics.
   * Query params:
   * - metric: Metric name (e.g., 'http.requests', 'db.query_time')
   * - window: Time window in milliseconds (default: 1 hour)
   */
  server.get('/metrics/timeseries', { schema: healthSchemas.timeseries }, async (request, reply) => {
    const query = request.query as { metric?: string; window?: string };
    const metric = query.metric || 'http.requests';
    const window = query.window ? parseInt(query.window, 10) : 60 * 60 * 1000;

    const data = metrics.getTimeSeries(metric, window);

    return reply.send({
      data: {
        metric,
        window,
        points: data,
        count: data.length,
      },
      meta: {
        timestamp: Date.now(),
      },
    });
  });

  /**
   * GET /metrics/aggregated
   * 
   * Aggregated metrics for time window.
   * Query params:
   * - window: Time window in milliseconds (default: 1 minute)
   */
  server.get('/metrics/aggregated', { schema: healthSchemas.aggregated }, async (request, reply) => {
    const query = request.query as { window?: string };
    const window = query.window ? parseInt(query.window, 10) : 60 * 1000;

    const data = metrics.getAggregated(window);

    return reply.send({
      data,
      meta: {
        window,
        timestamp: Date.now(),
      },
    });
  });
};

export default monitoringRoutes;
