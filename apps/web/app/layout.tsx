import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.svg',
  },
};

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
