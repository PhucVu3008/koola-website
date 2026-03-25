import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import './globals.css';

/**
 * Roboto font loaded via next/font/google.
 * - subsets: latin + vietnamese (needed for VI locale)
 * - weight: 300 (light), 400 (regular), 500 (medium), 700 (bold)
 * - display: swap — text stays visible while font loads (no FOIT)
 * - variable: exposes --font-roboto CSS custom property site-wide
 */
const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
  preload: true,
});

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
 *
 * Font: Roboto is loaded here once at the root and applied via CSS variable
 * `--font-roboto`, which Tailwind's `font-sans` resolves to.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={roboto.variable}>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
