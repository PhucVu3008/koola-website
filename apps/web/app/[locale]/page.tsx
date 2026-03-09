import type { Metadata } from 'next';

import { HomePage } from '../../components/home';
import { getDictionary } from '../../src/i18n/getDictionary';
import { isLocale, type Locale } from '../../src/i18n/locales';
import { getPageBySlug } from '../../src/lib/api/pages';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  // Try to load CMS data for SEO
  let cmsData: Awaited<ReturnType<typeof getPageBySlug>> | null = null;
  try {
    cmsData = await getPageBySlug({ slug: 'home', locale });
  } catch (error) {
    console.warn('[Home] Failed to load CMS SEO data:', error);
  }

  // Use CMS metadata if available, otherwise fallback to dictionary
  if (cmsData?.page) {
    return {
      title: cmsData.page.seo_title || cmsData.page.title,
      description: cmsData.page.seo_description || undefined,
    };
  }

  // Fallback to i18n dictionary
  const dict = getDictionary(locale);
  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
