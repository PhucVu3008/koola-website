import { describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';

/**
 * Basic smoke test to ensure the server boots and the health endpoint responds.
 */
describe('GET /health', () => {
  it('returns 200', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(res.statusCode).toBe(200);
  });
});
