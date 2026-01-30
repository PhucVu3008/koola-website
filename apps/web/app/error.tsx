'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DICTIONARIES } from '../src/i18n/generated';
import { ErrorPageContent } from '../components/errors/ErrorPageContent';
import { extractLocaleFromPath } from '../src/utils/error-context';

/**
 * Global error page with context-aware navigation.
 * 
 * This page catches unhandled errors in the application.
 * Client component required for error boundary functionality.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = extractLocaleFromPath(pathname);
  
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
  }, [error]);

  const dict = DICTIONARIES[locale as 'en' | 'vi'] || DICTIONARIES.en;

  return (
    <html lang={locale}>
      <body>
        <ErrorPageContent 
          dict={dict} 
          locale={locale} 
          errorCode={500}
          pathname={pathname}
        />
      </body>
    </html>
  );
}
