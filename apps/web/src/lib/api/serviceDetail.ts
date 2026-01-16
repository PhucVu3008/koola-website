import { apiFetchJson, type ApiSuccessEnvelope } from './http';

export type ServiceDetail = {
  id: number;
  locale: string;
  slug: string;
  title: string;
  seo_title?: string | null;
  seo_description?: string | null;
  content_md?: string | null;
};

export type ServiceDeliverable = {
  id: number;
  service_id: number;
  title: string;
  description?: string | null;
  sort_order: number;
};

export type ServiceProcessStep = {
  id: number;
  service_id: number;
  title: string;
  description?: string | null;
  sort_order: number;
};

export type ServiceFaq = {
  id: number;
  service_id: number;
  question: string;
  answer: string;
  sort_order: number;
};

export type RelatedService = {
  id: number;
  slug: string;
  title: string;
};

export type ServiceSidebar = {
  tags: Array<{ id: number; slug: string; name: string }>;
  ads?: unknown[];
  read_more_posts?: unknown[];
};

export type ServiceDetailPayload = {
  service: ServiceDetail;
  deliverables: ServiceDeliverable[];
  process_steps: ServiceProcessStep[];
  faqs: ServiceFaq[];
  related_services: RelatedService[];
  sidebar: ServiceSidebar;
};

/**
 * Fetch bundled service detail payload.
 */
export async function getServiceDetail(params: { slug: string; locale: string }): Promise<ServiceDetailPayload> {
  const res = await apiFetchJson<ApiSuccessEnvelope<ServiceDetailPayload>>(
    `/v1/services/${encodeURIComponent(params.slug)}?locale=${encodeURIComponent(params.locale)}`,
    { next: { revalidate: 300 } } as any
  );

  return res.data;
}
