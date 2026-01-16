import { apiFetchJson, type ApiSuccessEnvelope } from './http';

export type Page = {
  id: number;
  locale: string;
  slug: string;
  title: string;
  seo_title?: string | null;
  seo_description?: string | null;
  content_md?: string | null;
  status?: string;
  published_at?: string | null;
};

export type PageSection = {
  id: number;
  page_id: number;
  section_key: string;
  payload: unknown;
  sort_order: number;
};

export type PageBySlugPayload = {
  page: Page;
  sections: PageSection[];
};

export type GetPageBySlugParams = {
  slug: string;
  locale: string;
};

/**
 * Fetch a CMS-backed page by slug.
 *
 * @throws Error with `.status` = 404 when page is not found.
 */
export async function getPageBySlug(params: GetPageBySlugParams): Promise<PageBySlugPayload> {
  const res = await apiFetchJson<ApiSuccessEnvelope<PageBySlugPayload>>(
    `/v1/pages/${encodeURIComponent(params.slug)}?locale=${encodeURIComponent(params.locale)}`,
    { next: { revalidate: 300 } } as any
  );

  return res.data;
}
