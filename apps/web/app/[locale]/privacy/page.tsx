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
    title: `${dict.legal.privacy.title} — ${dict.meta.siteName}`,
    description: dict.legal.privacy.description,
  };
}

/**
 * Privacy Policy page.
 * Server-rendered legal content with full i18n.
 */
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const privacy = dict.legal.privacy;
  const contactInfo = dict.legal.contactInfo;

  const sections = [
    {
      title: privacy.sections.intro.title,
      content: privacy.sections.intro.content,
    },
    {
      title: privacy.sections.collection.title,
      content: privacy.sections.collection.content,
    },
    {
      title: privacy.sections.usage.title,
      content: privacy.sections.usage.content,
    },
    {
      title: privacy.sections.sharing.title,
      content: privacy.sections.sharing.content,
    },
    {
      title: privacy.sections.cookies.title,
      content: privacy.sections.cookies.content,
    },
    {
      title: privacy.sections.security.title,
      content: privacy.sections.security.content,
    },
    {
      title: privacy.sections.retention.title,
      content: privacy.sections.retention.content,
    },
    {
      title: privacy.sections.rights.title,
      content: privacy.sections.rights.content,
    },
    {
      title: privacy.sections.international.title,
      content: privacy.sections.international.content,
    },
    {
      title: privacy.sections.children.title,
      content: privacy.sections.children.content,
    },
    {
      title: privacy.sections.changes.title,
      content: privacy.sections.changes.content,
    },
    {
      title: privacy.sections.contact.title,
      content: privacy.sections.contact.content,
    },
  ];

  return (
    <LegalPage
      title={privacy.title}
      description={privacy.description}
      lastUpdated={`${privacy.lastUpdated}: ${locale === 'vi' ? '21 tháng 1, 2026' : 'January 21, 2026'}`}
      sections={sections}
      contactInfo={contactInfo}
      locale={locale}
    />
  );
}
