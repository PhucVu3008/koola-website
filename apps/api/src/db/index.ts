import { Pool, PoolClient } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute a parameterized SQL query and return all resulting rows.
 *
 * This helper intentionally accepts raw SQL + a separate `params` array to
 * encourage **parameterized** queries (`$1..$n`) and prevent SQL injection.
 *
 * @typeParam T - Row shape returned by the query.
 * @param text - SQL string containing placeholders (`$1`, `$2`, ...).
 * @param params - Values bound to placeholders. Always pass user input here.
 * @returns Array of rows typed as `T[]`.
 *
 * @throws Will throw if the database driver errors (connection issues, SQL
 * syntax errors, constraint violations, etc.). The global error handler should
 * map unexpected errors to 500 without leaking internals.
 */
export const query = async <T = any>(
  text: string,
  params?: any[]
): Promise<T[]> => {
  const result = await pool.query(text, params);
  return result.rows;
};

/**
 * Execute a parameterized SQL query and return the first row (or `null`).
 *
 * Use this for detail lookups like "get by id/slug" to avoid repetitive
 * `rows[0] ?? null` logic.
 *
 * @typeParam T - Row shape returned by the query.
 * @param text - SQL string containing placeholders (`$1`, `$2`, ...).
 * @param params - Values bound to placeholders.
 * @returns First row typed as `T`, or `null` if no rows are returned.
 *
 * @throws Will throw if the underlying query fails.
 */
export const queryOne = async <T = any>(
  text: string,
  params?: any[]
): Promise<T | null> => {
  const rows = await query<T>(text, params);
  return rows[0] || null;
};

/**
 * Run a callback within a DB transaction.
 *
 * Behavior:
 * - Begins a transaction (`BEGIN`).
 * - Commits (`COMMIT`) if the callback resolves.
 * - Rolls back (`ROLLBACK`) if the callback throws.
 * - Always releases the connection.
 *
 * Important:
 * - Use this for multi-table writes (e.g. create service + deliverables + FAQs)
 *   to keep data consistent.
 * - The callback receives a dedicated `PoolClient`; queries inside the
 *   transaction must use `client.query(...)` instead of the global pool.
 *
 * @typeParam T - Return type produced by the callback.
 * @param callback - Function that performs transactional work.
 * @returns The callback result.
 *
 * @throws Will re-throw the callback error after rollback.
 */
export const transaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Build standard pagination metadata.
 *
 * Notes:
 * - `page` is 1-based.
 * - `totalPages` uses `Math.ceil(total / pageSize)`.
 *
 * @param page - Current page number (1-based).
 * @param pageSize - Page size.
 * @param total - Total records matching a query.
 * @returns Pagination metadata for `{ meta: { ... } }` envelopes.
 */
export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  total: number
) => {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};
