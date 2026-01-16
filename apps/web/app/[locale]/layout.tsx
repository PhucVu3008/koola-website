import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { notFound } from 'next/navigation';

import { PageLayout } from '../../components/layout/PageLayout';
import { getSiteSettings } from '../../src/lib/api/site';
import { getDictionary, getSupportedLocales } from '../../src/i18n/getDictionary';
import { isLocale, type Locale } from '../../src/i18n/locales';

import '../globals.css';

/**
 * Generate static params so supported locales are pre-rendered.
 */
export function generateStaticParams(): Array<{ locale: Locale }> {
  return getSupportedLocales().map((locale) => ({ locale }));
}

/**
 * Locale-aware site metadata.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const supported = getSupportedLocales();
  const languages: Record<string, string> = {};
  for (const l of supported) languages[l] = `/${l}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dict.meta.homeTitle,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      type: 'website',
      locale,
      url: `/${locale}`,
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
      siteName: dict.meta.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
    },
  };
}

/**
 * Root layout for locale-prefixed marketing routes.
 *
 * Notes:
 * - Server Components for SEO.
 * - Fetches site chrome on the server.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const site = await getSiteSettings(locale).catch(() => null);

  return (
    <html lang={locale}>
      <body>
        <PageLayout locale={locale} site={site}>
          {children}
        </PageLayout>
      </body>
    </html>
  );
}
