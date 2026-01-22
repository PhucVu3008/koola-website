import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '../../../src/i18n/locales';
import { getDictionary } from '../../../src/i18n/getDictionary';
import { LegalPage } from '../../../components/legal';

export const revalidate = 86400; // Revalidate daily

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    title: `${dict.legal.cookies.title} — ${dict.meta.siteName}`,
    description: dict.legal.cookies.description,
  };
}

/**
 * Cookie Policy page.
 * Server-rendered legal content with full i18n.
 */
export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const cookies = dict.legal.cookies;
  const contactInfo = dict.legal.contactInfo;

  const sections = [
    {
      title: cookies.sections.intro.title,
      content: cookies.sections.intro.content,
    },
    {
      title: cookies.sections.types.title,
      content: cookies.sections.types.content,
    },
    {
      title: cookies.sections.essential.title,
      content: cookies.sections.essential.content,
    },
    {
      title: cookies.sections.analytics.title,
      content: cookies.sections.analytics.content,
    },
    {
      title: cookies.sections.thirdParty.title,
      content: cookies.sections.thirdParty.content,
    },
    {
      title: cookies.sections.management.title,
      content: cookies.sections.management.content,
    },
    {
      title: cookies.sections.duration.title,
      content: cookies.sections.duration.content,
    },
    {
      title: cookies.sections.updates.title,
      content: cookies.sections.updates.content,
    },
    {
      title: cookies.sections.contact.title,
      content: cookies.sections.contact.content,
    },
  ];

  return (
    <LegalPage
      title={cookies.title}
      description={cookies.description}
      lastUpdated={`${cookies.lastUpdated}: ${locale === 'vi' ? '21 tháng 1, 2026' : 'January 21, 2026'}`}
      sections={sections}
      contactInfo={contactInfo}
      locale={locale}
    />
  );
}
