import type { ReactNode } from 'react';

import './globals.css';

/**
 * Base (non-locale) layout.
 *
 * Locale-prefixed routes are implemented under `app/[locale]/*`.
 * This wrapper intentionally does not fetch site chrome to avoid duplicate
 * headers/footers and conflicting metadata.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
