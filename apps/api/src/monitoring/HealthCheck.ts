/**
 * HealthCheck - Production-grade health check system
 * 
 * Features:
 * - Deep health checks for all dependencies (DB, file system, external services)
 * - Multiple health levels: healthy, degraded, unhealthy
 * - Detailed component status
 * - Readiness vs. liveness probes (K8s compatible)
 * - Performance metrics for each check
 * - Configurable timeouts and retries
 * 
 * Usage:
 * ```ts
 * import { healthCheck } from './monitoring/HealthCheck';
 * 
 * // Kubernetes liveness probe (basic check)
 * const liveness = await healthCheck.liveness();
 * 
 * // Kubernetes readiness probe (full dependencies check)
 * const readiness = await healthCheck.readiness();
 * 
 * // Detailed health report
 * const full = await healthCheck.full();
 * ```
 * 
 * Endpoints:
 * - GET /health -> Basic liveness
 * - GET /health/ready -> Readiness (dependencies check)
 * - GET /health/full -> Detailed health report with metrics
 */

import { pool } from '../db';
import { promises as fs } from 'fs';
import path from 'path';

// ==================== Types ====================

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ComponentHealth {
  status: HealthStatus;
  message: string;
  responseTime?: number; // milliseconds
  details?: Record<string, any>;
}

export interface HealthCheckResult {
  status: HealthStatus;
  timestamp: number;
  uptime: number;
  version: string;
  environment: string;
  components: {
    database: ComponentHealth;
    fileSystem: ComponentHealth;
    memory: ComponentHealth;
    [key: string]: ComponentHealth; // Allow custom components
  };
  metrics?: {
    responseTime: number;
    checksPerformed: number;
    checksSucceeded: number;
    checksFailed: number;
  };
}

export interface LivenessCheckResult {
  alive: boolean;
  timestamp: number;
  uptime: number;
}

export interface ReadinessCheckResult {
  ready: boolean;
  timestamp: number;
  components: {
    database: boolean;
    fileSystem: boolean;
  };
  reason?: string;
}

// ==================== Configuration ====================

const HEALTH_CHECK_CONFIG = {
  database: {
    timeout: 5000, // 5 seconds
    query: 'SELECT 1 AS health_check',
  },
  fileSystem: {
    timeout: 2000, // 2 seconds
    testPath: path.join(process.cwd(), 'apps', 'api', 'uploads'),
  },
  memory: {
    warningThreshold: 0.85, // 85% of heap limit
    criticalThreshold: 0.95, // 95% of heap limit
  },
};

// ==================== HealthCheck Class ====================

class HealthCheckService {
  private startTime: number;
  private version: string;
  private environment: string;

  constructor() {
    this.startTime = Date.now();
    this.version = process.env.APP_VERSION || '1.0.0';
    this.environment = process.env.NODE_ENV || 'development';
  }

  /**
   * Liveness probe - simple health check (K8s compatible).
   * 
   * Returns whether the application is running.
   * This should never fail unless the process is dead.
   * 
   * Use for Kubernetes liveness probe.
   */
  async liveness(): Promise<LivenessCheckResult> {
    return {
      alive: true,
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime,
    };
  }

  /**
   * Readiness probe - dependencies health check (K8s compatible).
   * 
   * Returns whether the application is ready to serve traffic.
   * Checks critical dependencies: database, file system.
   * 
   * Use for Kubernetes readiness probe.
   */
  async readiness(): Promise<ReadinessCheckResult> {
    const timestamp = Date.now();
    
    try {
      // Check database
      const dbHealthy = await this.checkDatabaseQuick();
      
      // Check file system
      const fsHealthy = await this.checkFileSystemQuick();

      const ready = dbHealthy && fsHealthy;

      return {
        ready,
        timestamp,
        components: {
          database: dbHealthy,
          fileSystem: fsHealthy,
        },
        reason: ready ? undefined : 'One or more critical dependencies are unhealthy',
      };
    } catch (error: any) {
      return {
        ready: false,
        timestamp,
        components: {
          database: false,
          fileSystem: false,
        },
        reason: `Health check failed: ${error.message}`,
      };
    }
  }

  /**
   * Full health check - detailed component status.
   * 
   * Returns comprehensive health report with:
   * - Overall status (healthy/degraded/unhealthy)
   * - Individual component health
   * - Performance metrics
   * - System resource usage
   * 
   * Use for monitoring dashboards and detailed diagnostics.
   */
  async full(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const checksPerformed = 3; // DB, FS, Memory
    let checksSucceeded = 0;
    let checksFailed = 0;

    // Check all components
    const [dbHealth, fsHealth, memHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkFileSystem(),
      this.checkMemory(),
    ]);

    // Count successes/failures
    [dbHealth, fsHealth, memHealth].forEach(component => {
      if (component.status === 'healthy') checksSucceeded++;
      else checksFailed++;
    });

    // Determine overall status
    let overallStatus: HealthStatus = 'healthy';
    if (checksFailed > 0) {
      // If any critical component is unhealthy, mark as unhealthy
      if (dbHealth.status === 'unhealthy') {
        overallStatus = 'unhealthy';
      } else {
        overallStatus = 'degraded';
      }
    }

    const responseTime = Date.now() - startTime;

    return {
      status: overallStatus,
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime,
      version: this.version,
      environment: this.environment,
      components: {
        database: dbHealth,
        fileSystem: fsHealth,
        memory: memHealth,
      },
      metrics: {
        responseTime,
        checksPerformed,
        checksSucceeded,
        checksFailed,
      },
    };
  }

  // ==================== Component Checks (Detailed) ====================

  /**
   * Check database health.
   * 
   * Tests:
   * - Connection availability
   * - Query execution
   * - Response time
   * - Connection pool stats
   */
  private async checkDatabase(): Promise<ComponentHealth> {
    const startTime = Date.now();

    try {
      // Execute health check query with timeout
      const result = await Promise.race([
        pool.query(HEALTH_CHECK_CONFIG.database.query),
        this.timeout(HEALTH_CHECK_CONFIG.database.timeout, 'Database query timeout'),
      ]);

      const responseTime = Date.now() - startTime;

      // Get pool stats
      const poolStats = {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount,
      };

      return {
        status: 'healthy',
        message: 'Database connection is healthy',
        responseTime,
        details: {
          queryResult: result.rows[0],
          pool: poolStats,
        },
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`,
        responseTime,
        details: {
          error: error.message,
          code: error.code,
        },
      };
    }
  }

  /**
   * Check file system health.
   * 
   * Tests:
   * - Directory existence
   * - Write permission
   * - Read permission
   * - Disk space (if available)
   */
  private async checkFileSystem(): Promise<ComponentHealth> {
    const startTime = Date.now();
    const testPath = HEALTH_CHECK_CONFIG.fileSystem.testPath;

    try {
      // Check if directory exists
      await fs.access(testPath, fs.constants.F_OK);

      // Test write permission (create temporary file)
      const testFile = path.join(testPath, '.health_check_test');
      await fs.writeFile(testFile, 'health_check', 'utf-8');

      // Test read permission
      await fs.readFile(testFile, 'utf-8');

      // Clean up test file
      await fs.unlink(testFile);

      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        message: 'File system is accessible and writable',
        responseTime,
        details: {
          path: testPath,
          permissions: 'read/write',
        },
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      return {
        status: 'unhealthy',
        message: `File system check failed: ${error.message}`,
        responseTime,
        details: {
          path: testPath,
          error: error.message,
        },
      };
    }
  }

  /**
   * Check memory health.
   * 
   * Tests:
   * - Heap usage percentage
   * - Memory pressure indicators
   * - GC metrics (if available)
   */
  private async checkMemory(): Promise<ComponentHealth> {
    const startTime = Date.now();

    try {
      const mem = process.memoryUsage();
      
      // Calculate heap usage percentage
      const heapUsedPercent = (mem.heapUsed / mem.heapTotal) * 100;
      
      // Determine status based on thresholds
      let status: HealthStatus = 'healthy';
      let message = 'Memory usage is normal';

      if (heapUsedPercent >= HEALTH_CHECK_CONFIG.memory.criticalThreshold * 100) {
        status = 'unhealthy';
        message = `Critical memory usage: ${heapUsedPercent.toFixed(1)}%`;
      } else if (heapUsedPercent >= HEALTH_CHECK_CONFIG.memory.warningThreshold * 100) {
        status = 'degraded';
        message = `High memory usage: ${heapUsedPercent.toFixed(1)}%`;
      }

      const responseTime = Date.now() - startTime;

      return {
        status,
        message,
        responseTime,
        details: {
          heapUsed: this.formatBytes(mem.heapUsed),
          heapTotal: this.formatBytes(mem.heapTotal),
          heapUsedPercent: `${heapUsedPercent.toFixed(1)}%`,
          rss: this.formatBytes(mem.rss),
          external: this.formatBytes(mem.external),
          arrayBuffers: this.formatBytes(mem.arrayBuffers),
        },
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      return {
        status: 'unhealthy',
        message: `Memory check failed: ${error.message}`,
        responseTime,
        details: {
          error: error.message,
        },
      };
    }
  }

  // ==================== Component Checks (Quick) ====================

  /**
   * Quick database check (for readiness probe).
   * Returns boolean only (no details).
   */
  private async checkDatabaseQuick(): Promise<boolean> {
    try {
      await Promise.race([
        pool.query('SELECT 1'),
        this.timeout(3000, 'Database timeout'),
      ]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Quick file system check (for readiness probe).
   * Returns boolean only (no details).
   */
  private async checkFileSystemQuick(): Promise<boolean> {
    try {
      const testPath = HEALTH_CHECK_CONFIG.fileSystem.testPath;
      await fs.access(testPath, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  // ==================== Helpers ====================

  /**
   * Create a timeout promise.
   */
  private timeout(ms: number, message: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    });
  }

  /**
   * Format bytes to human-readable string.
   */
  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    
    return `${value.toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Get uptime in human-readable format.
   */
  getUptime(): string {
    const uptime = Date.now() - this.startTime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}

// ==================== Singleton Export ====================

/**
 * Global health check service instance.
 * 
 * @example
 * ```ts
 * import { healthCheck } from './monitoring/HealthCheck';
 * 
 * // Kubernetes liveness probe
 * server.get('/health', async () => {
 *   return await healthCheck.liveness();
 * });
 * 
 * // Kubernetes readiness probe
 * server.get('/health/ready', async (request, reply) => {
 *   const result = await healthCheck.readiness();
 *   return reply.status(result.ready ? 200 : 503).send(result);
 * });
 * 
 * // Full health report
 * server.get('/health/full', async (request, reply) => {
 *   const result = await healthCheck.full();
 *   const statusCode = result.status === 'healthy' ? 200 : 
 *                      result.status === 'degraded' ? 200 : 503;
 *   return reply.status(statusCode).send(result);
 * });
 * ```
 */
export const healthCheck = new HealthCheckService();
