import type { Metadata } from 'next';

import { HomePage } from '../../components/home';
import { getDictionary } from '../../src/i18n/getDictionary';
import { isLocale, type Locale } from '../../src/i18n/locales';

/**
 * Home page (locale-prefixed route).
 *
 * SEO:
 * - Pre-rendered for each locale for fast, indexable HTML.
 */
export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

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
