import type { Metadata } from 'next';
import { DICTIONARIES } from '../src/i18n/generated';
import { ErrorPageContent } from '../components/errors/ErrorPageContent';

export const dynamic = 'force-dynamic';

/**
 * Global 404 Not Found page.
 * 
 * This page is shown when:
 * - A route outside /[locale]/* doesn't exist
 * - The locale prefix is invalid
 * 
 * Defaults to English locale.
 */

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for doesn\'t exist or has been moved.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const dict = DICTIONARIES.en;
  
  return (
    <html lang="en">
      <body>
        <ErrorPageContent dict={dict} locale="en" errorCode={404} />
      </body>
    </html>
  );
}
