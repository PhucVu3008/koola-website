'use client';

import { useState, type FormEvent } from 'react';

import type { SiteSettingsPayload } from '../src/lib/api/site';
import { getDictionary } from '../src/i18n/getDictionary';
import { isLocale } from '../src/i18n/locales';
import { env } from '../src/lib/env';

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
  const [subStatus, setSubStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
      {/* Top section: link columns + subscribe */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Links */}
          <div>
            <div className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
              {locale === 'vi' ? 'Công ty' : 'Company'}
            </div>
            <ul className="mt-4 flex flex-col gap-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <div className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
              {locale === 'vi' ? 'Tài nguyên' : 'Resources'}
            </div>
            <ul className="mt-4 flex flex-col gap-2.5">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe — spans 2 cols on lg */}
          <div className="sm:col-span-2">
            <div className="rounded-xl bg-slate-50 p-5 sm:p-6">
              <div className="font-semibold text-slate-900 text-base">{dict.footer.subscribe}</div>
              <form
                className="mt-3"
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const email = new FormData(form).get('email')?.toString().trim();
                  if (!email) return;

                  setSubStatus('submitting');
                  try {
                    const url = `${env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')}/v1/newsletter/subscribe`;
                    const res = await fetch(url, {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({ email, source_path: 'footer' }),
                    });
                    if (!res.ok) throw new Error();
                    setSubStatus('success');
                    form.reset();
                  } catch {
                    setSubStatus('error');
                  }
                }}
              >
                <div className="relative w-full max-w-md">
                  <label htmlFor="footer-email" className="sr-only">
                    {dict.footer.emailAddress}
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={dict.footer.emailAddress}
                    className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-4 pr-14 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'submitting'}
                    aria-label={dict.footer.subscribeCta}
                    className={`absolute right-1 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors w-9 h-9 ${subStatus === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m13 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
              {subStatus === 'success' && (
                <p className="mt-2 text-xs text-emerald-600 font-medium">
                  {locale === 'vi' ? 'Đăng ký thành công!' : 'Subscribed successfully!'}
                </p>
              )}
              {subStatus === 'error' && (
                <p className="mt-2 text-xs text-rose-600 font-medium">
                  {locale === 'vi' ? 'Có lỗi xảy ra, vui lòng thử lại.' : 'Something went wrong, please try again.'}
                </p>
              )}
              <p className="mt-3 max-w-md text-xs text-slate-500 leading-relaxed">
                {dict.footer.subscribeDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Legal Info */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pb-6">
        <div className="rounded-xl bg-slate-50 overflow-hidden p-5 sm:p-6">
          <div className="font-semibold text-slate-900 text-sm">
            {locale === 'vi'
              ? 'CÔNG TY TNHH THỰC PHẨM QUỐC TẾ AN BÌNH'
              : 'AN BINH INTERNATIONAL FOODS CO., LTD'}
          </div>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-500 leading-relaxed">
            <p>
              <span className="font-medium text-slate-600">{locale === 'vi' ? 'Địa chỉ' : 'Address'}:</span>{' '}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Số+58+đường+3+thôn+4+Đức+Hạnh+Đức+Linh+Bình+Thuận+Vietnam"
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

      {/* Divider */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="h-px w-full bg-slate-200" />
      </div>

      {/* Footer Bottom */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-3 order-1">
            <a href={withLocale('/')} aria-label="Home" className="inline-flex items-center">
              <div className="grid place-items-center rounded-xl bg-slate-50 w-9 h-9">
                <span className="font-bold text-indigo-600 text-base">K</span>
              </div>
            </a>
            <span className="text-xs text-slate-400">
              © {new Date().getFullYear()} KOOLA. {locale === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}
            </span>
          </div>

          {/* Legal Links */}
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 order-3 md:order-2">
            {legalLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5 order-2 md:order-3">
            {[
              {
                label: 'LinkedIn',
                href: (site as any).social_links?.linkedin || 'https://koola.vn',
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 23.5h4V7.98h-4V23.5zM8.02 7.98h3.83v2.12h.05c.53-1 1.82-2.17 3.74-2.17 4 0 4.74 2.63 4.74 6.04v7.53h-4v-6.68c0-1.59-.03-3.63-2.21-3.63-2.21 0-2.55 1.73-2.55 3.52v6.79h-4V7.98z" />
                  </svg>
                ),
              },
              {
                label: 'Facebook',
                href: (site as any).social_links?.facebook || 'https://koola.vn',
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path fill="currentColor" d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.87.24-1.46 1.5-1.46H16.7V5.02c-.3-.04-1.33-.12-2.52-.12-2.49 0-4.18 1.52-4.18 4.3V11H7.5v3H10v8h3.5z" />
                  </svg>
                ),
              },
              {
                label: 'Twitter',
                href: (site as any).social_links?.twitter || 'https://koola.vn',
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.2l-4.9-6.3L6.5 22H3.4l7.3-8.4L1 2h6.4l4.4 5.7L18.9 2zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z" />
                  </svg>
                ),
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid place-items-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-all w-9 h-9"
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
