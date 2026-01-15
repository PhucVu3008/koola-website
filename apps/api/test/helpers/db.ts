import { pool } from '../../src/db';

/**
 * Reset the test database to a clean state.
 *
 * Why we need this:
 * - Integration tests write to DB.
 * - We want deterministic tests and no coupling between test cases.
 *
 * Implementation notes:
 * - Uses `TRUNCATE ... RESTART IDENTITY CASCADE` for speed.
 * - Runs inside a single explicit transaction to keep the lock acquisition
 *   consistent and reduce deadlock risk when multiple test files reset.
 * - Keep this list in sync with DB schema when adding new tables.
 */
export const resetTestDb = async () => {
  const client = await pool.connect();
  try {
    // Fail fast if something else is holding locks for too long.
    await client.query(`SET lock_timeout = '3s'`);
    await client.query(`SET statement_timeout = '15s'`);

    // Serialize resets across test files/processes.
    await client.query(`SELECT pg_advisory_lock(4242424242);`);

    await client.query(`
      TRUNCATE TABLE
        refresh_tokens,
        user_roles,
        roles,
        users,
        nav_items,
        site_settings,
        pages,
        page_sections,
        tags,
        categories,
        posts,
        post_tags,
        post_categories,
        post_related,
        services,
        service_deliverables,
        service_process_steps,
        service_faqs,
        service_related,
        service_related_posts,
        leads,
        newsletter_subscribers,
        media_assets
      RESTART IDENTITY CASCADE;
    `);
  } finally {
    try {
      await client.query(`SELECT pg_advisory_unlock(4242424242);`);
    } catch {
      // ignore unlock errors
    }
    client.release();
  }
};
