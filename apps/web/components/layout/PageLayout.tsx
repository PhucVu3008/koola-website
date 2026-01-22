import type { ReactNode } from 'react';

import { SiteFooter } from '../SiteFooter';
import { SiteHeader } from '../SiteHeader';
import type { SiteSettingsPayload } from '../../src/lib/api/site';

/**
 * PageLayout provides a consistent desktop container + site chrome.
 */
export function PageLayout({
  locale,
  site,
  children,
}: {
  locale: string;
  site: SiteSettingsPayload | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader locale={locale} />
      <main className="w-full">{children}</main>
      {site ? <SiteFooter locale={locale} site={site} /> : null}
    </div>
  );
}
