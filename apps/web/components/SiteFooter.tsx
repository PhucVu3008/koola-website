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
      {/* Full-width background, contained content */}
      <div className="w-full">
        <div className="fluid-container fluid-p-lg" style={{ paddingTop: 'clamp(2rem, 5vh, 3.5rem)', paddingBottom: 'clamp(1.5rem, 4vh, 2rem)' }}>
          {/* Main Footer Content - Truly Fluid Grid */}
          <div 
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(160px, 25vw, 300px), 1fr))',
              gap: 'clamp(1.25rem, 4vw, 3rem)'
            }}
          >
            {/* Company Links */}
            <div>
              <div className="font-semibold text-slate-900 fluid-text-lg">
                {locale === 'vi' ? 'Công ty' : 'Company'}
              </div>
              <ul style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)' }} className="flex flex-col">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-slate-500 hover:text-slate-900 transition-colors fluid-text-sm"
                      style={{ lineHeight: '1.6' }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <div className="font-semibold text-slate-900 fluid-text-lg">
                {locale === 'vi' ? 'Tài nguyên' : 'Resources'}
              </div>
              <ul style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)' }} className="flex flex-col">
                {resourceLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-slate-500 hover:text-slate-900 transition-colors fluid-text-sm"
                      style={{ lineHeight: '1.6' }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Section - Full width on mobile, spans columns on desktop */}
            <div className="col-span-full md:col-span-2">
              <div className="rounded-xl bg-slate-50 fluid-p-lg">
                <div className="font-semibold text-slate-900 fluid-text-xl">{dict.footer.subscribe}</div>

                <form
                  style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)' }}
                  onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    // UI-only for now. We can wire to `/v1/newsletter/subscribe`.
                    e.preventDefault();
                  }}
                >
                <div className="relative w-full max-w-[420px]">
                  <label htmlFor="footer-email" className="sr-only">
                    {dict.footer.emailAddress}
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={dict.footer.emailAddress}
                    className="w-full rounded-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200 transition-all fluid-h-md fluid-text-sm"
                    style={{ 
                      paddingLeft: 'clamp(1rem, 3vw, 1.5rem)', 
                      paddingRight: 'clamp(3.5rem, 15vw, 4rem)' 
                    }}
                  />
                  <button
                    type="submit"
                    aria-label={dict.footer.subscribeCta}
                    className="absolute right-[4px] top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors"
                    style={{ 
                      width: 'clamp(2.25rem, 10vw, 2.875rem)', 
                      height: 'clamp(2.25rem, 10vw, 2.875rem)' 
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      style={{ width: 'clamp(14px, 3vw, 16px)', height: 'clamp(14px, 3vw, 16px)' }}
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

              <p style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)' }} className="max-w-[480px] text-slate-500 fluid-text-sm">
                {dict.footer.subscribeDescription}
              </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Legal Info + Map */}
        <div className="fluid-container" style={{ marginTop: 'clamp(2rem, 5vh, 3rem)' }}>
          <div className="rounded-xl bg-slate-50 overflow-hidden">
            <div className="fluid-p-lg">
              <div className="font-semibold text-slate-900 fluid-text-base">
                {locale === 'vi'
                  ? 'CÔNG TY TNHH THỰC PHẨM QUỐC TẾ AN BÌNH'
                  : 'AN BINH INTERNATIONAL FOODS CO., LTD'}
              </div>
              <div className="mt-3 flex flex-col gap-1.5 text-slate-500 fluid-text-sm" style={{ lineHeight: '1.6' }}>
                <p>
                  <span className="font-medium text-slate-600">{locale === 'vi' ? 'Địa chỉ' : 'Address'}:</span>{' '}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Đức+Hạnh,+Đức+Linh,+Bình+Thuận,+Vietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-slate-300 underline-offset-2 hover:text-brand-600 hover:decoration-brand-400 transition-colors"
                  >
                    {locale === 'vi'
                      ? 'Số 58, đường 3, thôn 4, Đức Hạnh, Đức Linh, Bình Thuận, Việt Nam'
                      : '58 Road 3, Village 4, Duc Hanh, Duc Linh, Binh Thuan, Vietnam'}
                  </a>
                </p>
                <p>
                  <span className="font-medium text-slate-600">{locale === 'vi' ? 'Điện thoại' : 'Phone'}:</span>{' '}
                  <a href="tel:0941508468" className="hover:text-brand-600 transition-colors">0941 508 468</a>
                </p>
                <p>
                  <span className="font-medium text-slate-600">Email:</span>{' '}
                  <a href="mailto:sales@anbinhfoods.com" className="hover:text-brand-600 transition-colors">sales@anbinhfoods.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="fluid-container">
          <div className="h-px w-full bg-slate-200" style={{ marginTop: 'clamp(1.5rem, 4vh, 2rem)', marginBottom: 'clamp(1.5rem, 4vh, 1.75rem)' }} />
        </div>

        {/* Footer Bottom - Fluid layout */}
        <div className="fluid-container" style={{ paddingBottom: 'clamp(1.5rem, 4vh, 2rem)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between" style={{ gap: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
            {/* Logo/Brand - Fluid size */}
            <a href={withLocale('/')} aria-label="Home" className="inline-flex items-center order-1 md:order-1">
              <div className="grid place-items-center rounded-xl bg-slate-50" style={{ width: 'clamp(2.25rem, 4vw, 2.75rem)', height: 'clamp(2.25rem, 4vw, 2.75rem)' }}>
                <span className="font-bold text-indigo-600 fluid-text-lg">K</span>
              </div>
            </a>

            {/* Legal Links - Fluid gap */}
            <nav aria-label="Legal" className="flex flex-wrap items-center justify-center order-3 md:order-2" style={{ gap: 'clamp(1rem, 3vw, 3.5rem)' }}>
              {legalLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap fluid-text-sm"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Social Icons - Fluid sizing */}
            <div className="flex items-center order-2 md:order-3" style={{ gap: 'clamp(0.625rem, 2vw, 1rem)' }}>
              {[
                {
                  label: 'LinkedIn',
                  href: (site as any).social_links?.linkedin ?? '#',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
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
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
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
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
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
                  className="grid place-items-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-all"
                  style={{ width: 'clamp(2.25rem, 4vw, 2.75rem)', height: 'clamp(2.25rem, 4vw, 2.75rem)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
