'use client';

import type { FormEvent } from 'react';

import type { SiteSettingsPayload } from '../src/lib/api/site';
import { getDictionary } from '../src/i18n/getDictionary';
import { isLocale } from '../src/i18n/locales';

/**
 * Marketing site footer (desktop-first).
 *
 * Layout matches the provided reference:
 * - Top: 3 link columns (Product / Information / Company) + Subscribe card.
 * - Bottom: brand mark, legal links, and social icons.
 */
export function SiteFooter({
  locale,
  site,
}: {
  locale: string;
  site: SiteSettingsPayload;
}) {
  const dict = getDictionary(isLocale(locale) ? locale : 'en');

  const withLocale = (path: string) => `/${locale}${path}`;

  // Main navigation links
  const companyLinks = [
    { label: dict.nav.home, href: withLocale('/') },
    { label: dict.nav.about, href: withLocale('/about') },
    { label: dict.nav.services, href: withLocale('/services') },
    { label: dict.nav.careers, href: withLocale('/careers') },
    { label: dict.nav.contact, href: withLocale('/contact') },
  ];

  // Resources/support links
  const resourceLinks = [
    { 
      label: locale === 'vi' ? 'Dịch vụ của chúng tôi' : 'Our Services', 
      href: withLocale('/services') 
    },
    { 
      label: locale === 'vi' ? 'Tuyển dụng' : 'Career Opportunities', 
      href: withLocale('/careers') 
    },
    { 
      label: locale === 'vi' ? 'Về chúng tôi' : 'About KOOLA', 
      href: withLocale('/about') 
    },
  ];

  // Legal/policy links
  const legalLinks = [
    { label: dict.footer.terms, href: withLocale('/terms') },
    { label: dict.footer.privacy, href: withLocale('/privacy') },
    { label: dict.footer.cookies, href: withLocale('/cookies') },
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="container pb-8 pt-14">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          {/* Company Links */}
          <div className="col-span-12 md:col-span-3">
            <div className="text-[18px] font-semibold text-slate-900">
              {locale === 'vi' ? 'Công ty' : 'Company'}
            </div>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[16px] leading-7 text-slate-500 hover:text-slate-900"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-12 md:col-span-3">
            <div className="text-[18px] font-semibold text-slate-900">
              {locale === 'vi' ? 'Tài nguyên' : 'Resources'}
            </div>
            <ul className="mt-5 space-y-3">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[16px] leading-7 text-slate-500 hover:text-slate-900"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Section */}
          <div className="col-span-12 md:col-span-6">
            <div className="rounded-[28px] bg-slate-50 p-10">
              <div className="text-[20px] font-semibold text-slate-900">{dict.footer.subscribe}</div>

              <form
                className="mt-6"
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  // UI-only for now. We can wire to `/v1/newsletter/subscribe`.
                  e.preventDefault();
                }}
              >
                <div className="relative max-w-[380px]">
                  <label htmlFor="footer-email" className="sr-only">
                    {dict.footer.emailAddress}
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={dict.footer.emailAddress}
                    className="h-[56px] w-full rounded-full border border-slate-200 bg-white pl-6 pr-16 text-[16px] text-slate-900 placeholder:text-slate-400 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  />
                  <button
                    type="submit"
                    aria-label={dict.footer.subscribeCta}
                    className="absolute right-[6px] top-1/2 grid h-[46px] w-[46px] -translate-y-1/2 place-items-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>

              <p className="mt-6 max-w-[440px] text-[16px] leading-7 text-slate-500">
                {dict.footer.subscribeDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-slate-200" />

        <div className="mt-7 flex items-center justify-between">
          <a href={withLocale('/')} aria-label="Home" className="inline-flex items-center">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50">
              <span className="text-xl font-bold text-indigo-600">K</span>
            </div>
          </a>

          <nav aria-label="Legal" className="flex items-center gap-14">
            {legalLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[16px] text-slate-700 hover:text-slate-900"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {[
              {
                label: 'LinkedIn',
                href: (site as any).social_links?.linkedin ?? '#',
                icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 23.5h4V7.98h-4V23.5zM8.02 7.98h3.83v2.12h.05c.53-1 1.82-2.17 3.74-2.17 4 0 4.74 2.63 4.74 6.04v7.53h-4v-6.68c0-1.59-.03-3.63-2.21-3.63-2.21 0-2.55 1.73-2.55 3.52v6.79h-4V7.98z"
                    />
                  </svg>
                ),
              },
              {
                label: 'Facebook',
                href: (site as any).social_links?.facebook ?? '#',
                icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.87.24-1.46 1.5-1.46H16.7V5.02c-.3-.04-1.33-.12-2.52-.12-2.49 0-4.18 1.52-4.18 4.3V11H7.5v3H10v8h3.5z"
                    />
                  </svg>
                ),
              },
              {
                label: 'Twitter',
                href: (site as any).social_links?.twitter ?? '#',
                icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M18.9 2H22l-6.8 7.8L23.2 22h-6.2l-4.9-6.3L6.5 22H3.4l7.3-8.4L1 2h6.4l4.4 5.7L18.9 2zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z"
                    />
                  </svg>
                ),
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
