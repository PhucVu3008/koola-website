import { apiFetchJson, type ApiSuccessEnvelope } from './http';

export type AboutIntroPayload = {
  label: string;
  headline: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

export type AboutStoryPayload = {
  label: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

export type AboutMilestonePayload = {
  label: string;
  headline: string;
  iconAlt: string;
};

export type AboutTeamRolesPayload = {
  title: string;
  ctaLabel: string;
  ctaHref?: string;
  roles: Array<{ role: string; image: string }>;
  intro: string;
};

export type AboutTrustedPayload = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref?: string;
  logos: string[];
};

export type AboutTestimonialsPayload = {
  title: string;
  subtitle: string;
  helper: string;
  items: Array<{ stars: number; quote: string; name: string }>;
};

export type AboutTimelinePayload = {
  label: string;
  items: Array<{ year: string; title: string; description: string }>;
};

export type AboutPerformancePayload = {
  description: string;
  percent: number;
};

export type AboutCtaPayload = {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref?: string;
  image: string;
};

export type AboutPagePayload = {
  intro: AboutIntroPayload;
  story: AboutStoryPayload;
  milestone: AboutMilestonePayload;
  team: AboutTeamRolesPayload;
  trusted: AboutTrustedPayload;
  testimonials: AboutTestimonialsPayload;
  timeline: AboutTimelinePayload;
  performance: AboutPerformancePayload;
  cta: AboutCtaPayload;
};

/**
 * Fetch About page aggregate payload.
 */
export async function getAboutPage(params: { locale: string }): Promise<AboutPagePayload> {
  const res = await apiFetchJson<ApiSuccessEnvelope<AboutPagePayload>>(
    `/v1/pages/about/aggregate?locale=${encodeURIComponent(params.locale)}`,
    { next: { revalidate: 300 } } as any
  );

  return res.data;
}
