import { apiFetchJson, type ApiSuccessEnvelope } from './http';

export type NavItem = {
  id: number;
  locale: string;
  placement: 'header' | 'footer';
  label: string;
  href: string;
  sort_order: number;
  is_external: boolean;
};

export type SiteSetting = {
  key: string;
  value: unknown;
};

export type SiteSettingsPayload = {
  settings: SiteSetting[];
  header_nav: NavItem[];
  footer_nav: NavItem[];
};

/**
 * Fetch global site settings (meta + nav).
 *
 * @param locale Locale code (e.g. `en`)
 * @returns Bundled settings payload
 */
export async function getSiteSettings(locale: string): Promise<SiteSettingsPayload> {
  const res = await apiFetchJson<ApiSuccessEnvelope<SiteSettingsPayload>>(
    `/v1/site/settings?locale=${encodeURIComponent(locale)}`,
    {
      // Cache for SEO pages
      next: { revalidate: 300 },
    } as any
  );

  return res.data;
}
