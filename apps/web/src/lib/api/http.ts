import { env } from '../env';

export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiSuccessEnvelope<T> = {
  data: T;
  meta?: unknown;
};

/**
 * Fetch JSON from KOOLA API.
 *
 * @param path API path starting with `/` (e.g. `/v1/services`)
 * @param init Fetch init options
 * @returns Parsed JSON body
 * @throws Error for non-2xx responses, including API error envelope.
 */
export async function apiFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  // Use server-side URL if available (for Docker internal network),
  // otherwise fallback to client-side URL (for browser and local dev).
  const baseUrl = typeof window === 'undefined' 
    ? (env.API_BASE_URL_SERVER || env.NEXT_PUBLIC_API_BASE_URL)
    : env.NEXT_PUBLIC_API_BASE_URL;

  const url = new URL(path, baseUrl);

  const res = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
    // Next.js caching is controlled at call sites via `next: { revalidate }`.
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const err = json as Partial<ApiErrorEnvelope> | null;
    const message = err?.error?.message ?? `API request failed: ${res.status} ${res.statusText}`;
    const code = err?.error?.code ?? 'API_ERROR';

    const e = new Error(message);
    (e as any).code = code;
    (e as any).status = res.status;
    (e as any).details = err?.error?.details;
    throw e;
  }

  return json as T;
}
