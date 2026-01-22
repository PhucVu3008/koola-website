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
    title: `${dict.legal.terms.title} — ${dict.meta.siteName}`,
    description: dict.legal.terms.description,
  };
}

/**
 * Terms of Service page.
 * Server-rendered legal content with full i18n.
 */
export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const terms = dict.legal.terms;
  const contactInfo = dict.legal.contactInfo;

  const sections = [
    {
      title: terms.sections.acceptance.title,
      content: terms.sections.acceptance.content,
    },
    {
      title: terms.sections.services.title,
      content: terms.sections.services.content,
    },
    {
      title: terms.sections.userObligations.title,
      content: terms.sections.userObligations.content,
    },
    {
      title: terms.sections.intellectualProperty.title,
      content: terms.sections.intellectualProperty.content,
    },
    {
      title: terms.sections.confidentiality.title,
      content: terms.sections.confidentiality.content,
    },
    {
      title: terms.sections.liability.title,
      content: terms.sections.liability.content,
    },
    {
      title: terms.sections.termination.title,
      content: terms.sections.termination.content,
    },
    {
      title: terms.sections.changes.title,
      content: terms.sections.changes.content,
    },
    {
      title: terms.sections.governing.title,
      content: terms.sections.governing.content,
    },
    {
      title: terms.sections.contact.title,
      content: terms.sections.contact.content,
    },
  ];

  return (
    <LegalPage
      title={terms.title}
      description={terms.description}
      lastUpdated={`${terms.lastUpdated}: ${locale === 'vi' ? '21 tháng 1, 2026' : 'January 21, 2026'}`}
      sections={sections}
      contactInfo={contactInfo}
      locale={locale}
    />
  );
}
