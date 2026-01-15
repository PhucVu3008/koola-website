import type { FastifyInstance } from 'fastify';
import { buildServer } from '../../src/server';
import { ensureTestEnv } from './env';

/**
 * Create a Fastify server instance for tests.
 *
 * Notes:
 * - Uses the real production server wiring from `src/server.ts`.
 * - This does not bind to a TCP port; tests should use `server.inject()`.
 */
export const buildTestApp = async (): Promise<FastifyInstance> => {
  ensureTestEnv();

  const server = await buildServer();
  await server.ready();

  return server;
};
