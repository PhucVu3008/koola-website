import { apiFetchJson, type ApiSuccessEnvelope } from './http';

export type ServiceListItem = {
  id: number;
  locale: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  hero_image_url?: string | null; // URL to uploaded hero image
  icon_name?: string | null; // Icon identifier for service card (e.g., 'brain', 'spark', 'cloud')
  status?: string;
  published_at?: string | null;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ServicesListPayload = {
  items: ServiceListItem[];
  meta: PaginationMeta;
};

export type GetServicesParams = {
  locale: string;
  page?: number;
  pageSize?: number;
  sort?: 'order' | 'newest';
  tag?: string;
  category?: string;
};

/**
 * Fetch services list.
 */
export async function getServices(params: GetServicesParams): Promise<ServicesListPayload> {
  const search = new URLSearchParams();
  search.set('locale', params.locale);
  if (params.page) search.set('page', String(params.page));
  if (params.pageSize) search.set('pageSize', String(params.pageSize));
  if (params.sort) search.set('sort', params.sort);
  if (params.tag) search.set('tag', params.tag);
  if (params.category) search.set('category', params.category);

  const res = await apiFetchJson<ApiSuccessEnvelope<any>>(`/v1/services?${search.toString()}`, {
    next: { revalidate: 300 },
  } as any);

  // API response for list is generally { data: { items }, meta: {...pagination} }
  // Normalize into a stable shape for UI.
  return {
    items: (res as any).data?.items ?? (res as any).data ?? [],
    meta: ((res as any).meta ?? { page: 1, pageSize: 9, total: 0, totalPages: 0 }) as PaginationMeta,
  };
}

export type ServiceDetailService = {
  id: number;
  locale: string;
  slug: string;
  slug_group?: string | null;
  title: string;
  excerpt?: string | null;
  content_md?: string | null;
  benefits_subtitle?: string | null;
  hero_image_url?: string | null; // URL to uploaded hero image
};

export type ServiceDetailPayload = {
  service: ServiceDetailService;
  deliverables?: Array<{ id: number; title: string; description?: string | null }>;
  process_steps?: Array<{ id: number; title: string; description?: string | null; sort_order?: number }>;
  faqs?: Array<{ id: number; question: string; answer: string }>;
  benefits?: Array<{ id: number; title: string; description?: string | null; icon_name?: string | null }>;
  related_services?: Array<{ id: number; slug: string; title: string; excerpt?: string | null }>;
  sidebar?: unknown;
};

/**
 * Fetch a bundled service detail payload.
 *
 * Endpoint contract: `GET /v1/services/:slug?locale=en`
 *
 * @param params.slug Service slug (URL segment)
 * @param params.locale Locale code (e.g. `en`)
 * @returns Bundled service detail payload (service + nested lists)
 * @throws Error when the API returns a non-2xx response.
 */
export async function getServiceBySlug(params: {
  slug: string;
  locale: string;
}): Promise<ServiceDetailPayload> {
  const search = new URLSearchParams();
  search.set('locale', params.locale);

  const res = await apiFetchJson<ApiSuccessEnvelope<ServiceDetailPayload>>(
    `/v1/services/${encodeURIComponent(params.slug)}?${search.toString()}`,
    {
      // Cache service detail pages for SEO; callers can override via route segment config.
      next: { revalidate: 300 },
    } as any
  );

  return res.data;
}

/**
 * Services Page Content Types
 */
export type ServicesHeroPayload = {
  label: string;
  title: string;
  backgroundImage: string;
};

export type ServicesMidQuotePayload = {
  imageUrl: string;
  headline: string;
  paragraph: string;
};

export type ServicesCtaPayload = {
  title: string;
  buttonLabel: string;
  image: string;
};

export type ServicesPagePayload = {
  hero: ServicesHeroPayload;
  midQuote: ServicesMidQuotePayload;
  cta: ServicesCtaPayload;
};

/**
 * Fetch services page aggregate content.
 *
 * Endpoint: `GET /v1/services/page?locale=en`
 */
export async function getServicesPage(params: { locale: string }): Promise<ServicesPagePayload> {
  const search = new URLSearchParams();
  search.set('locale', params.locale);

  const res = await apiFetchJson<ApiSuccessEnvelope<ServicesPagePayload>>(
    `/v1/services/page?${search.toString()}`,
    {
      next: { revalidate: 300 },
    } as any
  );

  return (res as any).data;
}
