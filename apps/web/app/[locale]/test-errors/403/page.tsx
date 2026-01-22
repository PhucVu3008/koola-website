import { DICTIONARIES } from '../../../../src/i18n/generated';
import { ErrorPageContent } from '../../../../components/errors/ErrorPageContent';
import type { Locale } from '../../../../src/i18n/locales';

interface ErrorTestPageProps {
  params: Promise<{ locale: string }>;
}

export default async function Error403Page({ params }: ErrorTestPageProps) {
  const { locale } = await params;
  const dict = DICTIONARIES[locale as Locale] || DICTIONARIES.en;

  return <ErrorPageContent dict={dict} locale={locale as Locale} errorCode={403} />;
}
