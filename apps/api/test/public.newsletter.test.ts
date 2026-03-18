import { beforeEach, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';
import { resetTestDb } from './helpers/db';

/**
 * Public newsletter API integration tests.
 *
 * Coverage:
 * - successful subscription
 * - duplicate email handling
 * - validation errors
 */
describe('POST /v1/newsletter/subscribe', () => {
  beforeEach(async () => {
    await resetTestDb();
  });

  it('subscribes with valid email (201)', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'POST',
      url: '/v1/newsletter/subscribe',
      payload: {
        email: 'subscriber@example.com',
        source_path: 'footer',
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeDefined();
  });

  it('handles duplicate email gracefully', async () => {
    const app = await buildTestApp();
    const payload = { email: 'dup@example.com', source_path: 'footer' };

    // First subscribe
    await app.inject({ method: 'POST', url: '/v1/newsletter/subscribe', payload });

    // Second subscribe — should not error
    const res = await app.inject({ method: 'POST', url: '/v1/newsletter/subscribe', payload });

    // Could be 201 (upsert) or 409 — just shouldn't be 500
    expect(res.statusCode).toBeLessThan(500);
  });

  it('rejects invalid email', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'POST',
      url: '/v1/newsletter/subscribe',
      payload: { email: 'bad-email' },
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.json().error).toBeDefined();
  });
});
