'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

/**
 * GoogleAnalytics wrapper component.
 *
 * Uses `@next/third-parties/google` which:
 * - Loads the GA4 script with `afterInteractive` strategy (non-blocking)
 * - Deduplicates the script tag across navigations
 * - Works correctly with Next.js App Router
 *
 * Rendering rules:
 * - Renders nothing if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not set
 *   (safe in local/dev environments where GA is not needed)
 * - Renders nothing if the ID doesn't match GA4 format (G-XXXXXXXXXX)
 *   to prevent silent misconfiguration
 *
 * @example
 *   // In layout.tsx:
 *   <GoogleAnalytics />
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Guard: skip entirely if env var is not configured
  if (!gaId || !gaId.startsWith('G-')) {
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
}
