import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { AboutPage } from '../../../components/about';
import { getAboutPage } from '../../../src/lib/api/about';
import { isLocale, type Locale } from '../../../src/i18n/locales';
import { getDictionary } from '../../../src/i18n/getDictionary';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    title: dict.meta?.aboutTitle ?? dict.nav.about,
    description: dict.meta?.aboutDescription ?? '',
  };
}

/**
 * About page (API-driven via `/v1/pages/about/aggregate`).
 */
export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const data = await getAboutPage({ locale });

  return <AboutPage data={data as any} />;
}
