import type { Metadata } from 'next';
import { DICTIONARIES } from '../../src/i18n/generated';
import { ErrorPageContent } from '../../components/errors/ErrorPageContent';

/**
 * Locale-specific 404 Not Found page.
 * 
 * This page is shown when a route within /[locale]/* doesn't exist.
 * Uses the locale-specific layout (with header/footer).
 * 
 * Note: not-found pages don't receive params in Next.js 14+
 * We default to English and let the layout handle locale detection.
 */

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for doesn\'t exist or has been moved.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocaleNotFound() {
  // Default to English - the layout will show correct locale's header/footer
  const dict = DICTIONARIES.en;

  return <ErrorPageContent dict={dict} locale="en" errorCode={404} />;
}
