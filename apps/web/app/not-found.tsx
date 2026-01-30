'use client';

import { usePathname } from 'next/navigation';
import { DICTIONARIES } from '../src/i18n/generated';
import { ErrorPageContent } from '../components/errors/ErrorPageContent';
import { extractLocaleFromPath } from '../src/utils/error-context';

/**
 * Global 404 Not Found page with context-aware navigation.
 * 
 * This page is shown when:
 * - A route outside /[locale]/* doesn't exist
 * - The locale prefix is invalid
 * 
 * Detects locale from pathname and adapts navigation based on context (admin/public).
 */

export default function NotFound() {
  const pathname = usePathname();
  const locale = extractLocaleFromPath(pathname);
  const dict = DICTIONARIES[locale as 'en' | 'vi'] || DICTIONARIES.en;
  
  return (
    <html lang={locale}>
      <body>
        <ErrorPageContent 
          dict={dict} 
          locale={locale} 
          errorCode={404}
          pathname={pathname}
        />
      </body>
    </html>
  );
}
