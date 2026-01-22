'use client';

import { useEffect } from 'react';
import { DICTIONARIES } from '../src/i18n/generated';
import { ErrorPageContent } from '../components/errors/ErrorPageContent';

/**
 * Global error page.
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
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
  }, [error]);

  const dict = DICTIONARIES.en;

  return (
    <html lang="en">
      <body>
        <ErrorPageContent dict={dict} locale="en" errorCode={500} />
      </body>
    </html>
  );
}
