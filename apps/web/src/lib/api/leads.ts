import { env } from '../env';

export type CreateLeadInput = {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  source?: string;
};

/**
 * Create a lead via public API.
 *
 * @throws Error for non-2xx responses.
 */
export async function createLead(payload: CreateLeadInput): Promise<void> {
  const url = new URL('/v1/leads', env.NEXT_PUBLIC_API_BASE_URL);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as any) : null;

  if (!res.ok) {
    const message = json?.error?.message ?? `Lead submit failed: ${res.status} ${res.statusText}`;
    const e = new Error(message);
    (e as any).code = json?.error?.code ?? 'API_ERROR';
    (e as any).status = res.status;
    (e as any).details = json?.error?.details;
    throw e;
  }
}
