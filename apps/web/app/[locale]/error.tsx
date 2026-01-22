'use client';

import { useEffect } from 'react';
import { DICTIONARIES } from '../../src/i18n/generated';
import { isLocale, type Locale } from '../../src/i18n/locales';
import { ErrorPageContent } from '../../components/errors/ErrorPageContent';

/**
 * Locale-specific error page.
 * 
 * This page catches unhandled errors within /[locale]/* routes.
 * Uses the locale-specific layout (with header/footer).
 */

export default function LocaleError({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  params: { locale: string };
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Locale error:', error);
  }, [error]);

  const effectiveLocale = isLocale(params.locale) ? params.locale : ('en' as Locale);
  const dict = DICTIONARIES[effectiveLocale];

  return <ErrorPageContent dict={dict} locale={effectiveLocale} errorCode={500} />;
}
