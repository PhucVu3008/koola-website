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

export type AboutMissionValuesPayload = {
  title: string;
  subtitle: string;
  values: Array<{ icon: string; title: string; description: string }>;
};

export type AboutTeamRolesPayload = {
  title: string;
  ctaLabel: string;
  ctaHref?: string;
  roles: Array<{ role: string; image: string }>;
  intro: string;
};

export type AboutProcessPayload = {
  title: string;
  subtitle: string;
  steps: Array<{ step: number; title: string; description: string }>;
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
  missionValues: AboutMissionValuesPayload;
  team: AboutTeamRolesPayload;
  process: AboutProcessPayload;
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
