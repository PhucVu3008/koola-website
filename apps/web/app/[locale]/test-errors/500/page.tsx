import type { Metadata } from 'next';
import { DICTIONARIES } from '../../../../src/i18n/generated';
import { ErrorPageContent } from '../../../../components/errors/ErrorPageContent';
import type { Locale } from '../../../../src/i18n/locales';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface ErrorTestPageProps {
  params: Promise<{ locale: string }>;
}

export default async function Error500Page({ params }: ErrorTestPageProps) {
  const { locale } = await params;
  const dict = DICTIONARIES[locale as Locale] || DICTIONARIES.en;

  return <ErrorPageContent dict={dict} locale={locale as Locale} errorCode={500} />;
}
