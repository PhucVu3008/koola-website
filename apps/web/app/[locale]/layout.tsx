import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { notFound } from 'next/navigation';
import { Roboto } from 'next/font/google';

import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { CookieBanner } from '../../components/CookieBanner';
import { getSiteSettings, type SiteSettingsPayload } from '../../src/lib/api/site';
import { getDictionary, getSupportedLocales } from '../../src/i18n/getDictionary';
import { isLocale, type Locale } from '../../src/i18n/locales';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  combineSchemas,
  serializeJsonLd,
} from '../../src/lib/seo/structuredData';

import '../globals.css';

/**
 * Roboto loaded here (locale layout) so the font variable is available
 * on the <html> tag that sets `lang`. next/font deduplicates the request
 * automatically — no double-download even though it's also in root layout.
 */
const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
  preload: true,
});

/**
 * Generate static params so supported locales are pre-rendered.
 */
export function generateStaticParams(): Array<{ locale: Locale }> {
  return getSupportedLocales().map((locale) => ({ locale }));
}

/**
 * Locale-aware site metadata.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const supported = getSupportedLocales();
  const languages: Record<string, string> = {};
  for (const l of supported) languages[l] = `/${l}`;

  // Generate structured data schemas
  const schemas = combineSchemas(
    generateOrganizationSchema(baseUrl),
    generateWebSiteSchema(baseUrl, locale)
  );

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dict.meta.homeTitle,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      type: 'website',
      locale,
      url: `/${locale}`,
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
      siteName: dict.meta.siteName,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KOOLA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
      images: ['/og-image.png'],
    },
    icons: {
      icon: [
        // SVG first — modern browsers pick this (scalable, correct color)
        { url: '/favicon.svg', type: 'image/svg+xml' },
        // ICO fallback for older browsers
        { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      ],
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
  };
}

/**
 * Root layout for locale-prefixed marketing routes.
 *
 * Notes:
 * - Server Components for SEO.
 * - Fetches site chrome on the server.
 * - Admin routes bypass this layout's PageLayout wrapper.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const site = await getSiteSettings(locale).catch((err) => {
    console.error(`[LocaleLayout] Failed to fetch site settings for locale="${locale}":`, err);
    return { settings: [], header_nav: [], footer_nav: [] } satisfies SiteSettingsPayload;
  });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const schemas = combineSchemas(
    generateOrganizationSchema(baseUrl),
    generateWebSiteSchema(baseUrl, locale)
  );

  return (
    <html lang={locale} className={roboto.variable}>
      <head>
        {/* Preconnect to API origin to reduce DNS + TLS handshake latency */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SITE_URL ?? ''} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }}
        />
      </head>
      <body>
        {/* Loading screen — inline styles so it renders before CSS bundle loads */}
        <div id="loading-screen" aria-hidden="true">
          <style dangerouslySetInnerHTML={{ __html: `
            #loading-screen {
              position: fixed;
              inset: 0;
              z-index: 9999;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: #fff;
              /* contain prevents layout recalculations from propagating */
              contain: strict;
              will-change: opacity;
            }
            #loading-screen.loading-fade-out {
              opacity: 0;
              transition: opacity 0.6s ease-out;
              pointer-events: none;
            }
            #loading-screen .ls-mark {
              width: 56px;
              height: 56px;
              margin-bottom: 12px;
            }
            #loading-screen .ls-text {
              font-family: var(--font-roboto), system-ui, -apple-system, sans-serif;
              font-size: 20px;
              font-weight: 600;
              letter-spacing: -0.025em;
              color: #1e293b;
              margin-bottom: 24px;
            }
            #loading-screen .ls-bar-track {
              width: 120px;
              height: 3px;
              background: #e0e7ff;
              border-radius: 2px;
              overflow: hidden;
              /* contain the bar animation to its own layer */
              contain: strict;
            }
            #loading-screen .ls-bar-fill {
              width: 40%;
              height: 100%;
              background: #4f46e5;
              border-radius: 2px;
              /* Use transform only — avoids reflow */
              will-change: transform;
              animation: lsSlide 1.2s ease-in-out infinite;
            }
            @keyframes lsSlide {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(200%); }
              100% { transform: translateX(-100%); }
            }
            @media (prefers-reduced-motion: reduce) {
              #loading-screen .ls-bar-fill { animation: none; transform: none; width: 100%; opacity: 0.5; }
              #loading-screen.loading-fade-out { transition: none; }
            }
          `}} />
          <svg className="ls-mark" viewBox="0 0 32 32" width="56" height="56" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#4f46e5" />
            <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle"
              fill="#fff" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold">K</text>
          </svg>
          <div className="ls-text">KOOLA</div>
          <div className="ls-bar-track">
            <div className="ls-bar-fill" />
          </div>
        </div>

        <PageLayout locale={locale} site={site}>
          {children}
        </PageLayout>
        <LoadingScreen />
        <CookieBanner locale={locale} />
      </body>
    </html>
  );
}
