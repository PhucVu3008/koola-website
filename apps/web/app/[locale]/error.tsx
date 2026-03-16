'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DICTIONARIES } from '../../src/i18n/generated';
import { isLocale, type Locale } from '../../src/i18n/locales';
import { extractLocaleFromPath } from '../../src/utils/error-context';
import { ErrorPageContent } from '../../components/errors/ErrorPageContent';

/**
 * Locale-specific error page.
 *
 * This page catches unhandled errors within /[locale]/* routes.
 * Uses the locale-specific layout (with header/footer).
 *
 * Note: error boundaries only receive `error` and `reset` — NOT `params`.
 * Locale is extracted from the current pathname instead.
 */

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = extractLocaleFromPath(pathname);

  useEffect(() => {
    console.error('Locale error:', error);
  }, [error]);

  const effectiveLocale = isLocale(locale) ? locale : ('en' as Locale);
  const dict = DICTIONARIES[effectiveLocale];

  return <ErrorPageContent dict={dict} locale={effectiveLocale} errorCode={500} pathname={pathname} />;
}
