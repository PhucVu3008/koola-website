'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';

import type { SiteSettingsPayload } from '../src/lib/api/site';
import { getDictionary } from '../src/i18n/getDictionary';
import { isLocale } from '../src/i18n/locales';
import { env } from '../src/lib/env';

/**
 * Marketing site footer — compact, clean layout.
 *
 * Layout:
 * - Top: Brand info + nav links + newsletter subscribe (3 columns)
 * - Bottom: Copyright, legal links, Zalo social icon
 *
 * Social: Zalo only (links to phone 0941508468)
 * Cookie banner: removed per product decision
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

  const navLinks = [
    { label: dict.nav.home, href: withLocale('/') },
    { label: dict.nav.about, href: withLocale('/about') },
    { label: dict.nav.services, href: withLocale('/services') },
    { label: dict.nav.careers, href: withLocale('/careers') },
    { label: dict.nav.contact, href: withLocale('/contact') },
  ];

  // Zalo deep link — opens chat with phone number 0941508468
  const zaloHref = 'https://zalo.me/0941508468';

  return (
    <footer className="w-full border-t border-slate-200 bg-white">

      {/* ── Main section ── */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

          {/* Col 1: Brand + Company info */}
          <div className="flex flex-col gap-4">
            <a href={withLocale('/')} className="inline-flex items-center gap-2 w-fit">
              <Image
                src="/images/koola-logo.png"
                alt="KOOLA"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <span className="font-semibold text-slate-900 text-base">KOOLA</span>
            </a>

            <div className="text-sm text-slate-500 leading-relaxed space-y-1">
              <p className="font-medium text-slate-700 text-xs uppercase tracking-wide">
                {locale === 'vi' ? 'CÔNG TY TNHH THỰC PHẨM QUỐC TẾ AN BÌNH' : 'AN BINH INTERNATIONAL FOODS CO., LTD'}
              </p>
              <p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Số+58+đường+3+thôn+4+Đức+Hạnh+Đức+Linh+Bình+Thuận+Vietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 transition-colors"
                >
                  {locale === 'vi'
                    ? 'Số 58, đường 3, thôn 4, Đức Hạnh, Đức Linh, Bình Thuận'
                    : '58 Road 3, Village 4, Duc Hanh, Duc Linh, Binh Thuan'}
                </a>
              </p>
              <p>
                <a href="tel:0941508468" className="hover:text-brand-600 transition-colors">
                  0941 508 468
                </a>
              </p>
              <p>
                <a href="mailto:sales@anbinhfoods.com" className="hover:text-brand-600 transition-colors">
                  sales@anbinhfoods.com
                </a>
              </p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-4">
              {locale === 'vi' ? 'Điều hướng' : 'Navigation'}
            </div>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div>
            <div className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-4">
              {dict.footer.subscribe}
            </div>
            <form
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
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                {dict.footer.subscribeDescription}
              </p>
              <div className="relative w-full">
                <label htmlFor="footer-email" className="sr-only">{dict.footer.emailAddress}</label>
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
                    <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
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
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="w-full border-t border-slate-100 px-6 sm:px-10 lg:px-16 xl:px-20 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <span className="text-xs text-slate-400 order-2 sm:order-1">
            © {new Date().getFullYear()} KOOLA. {locale === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}
          </span>

          {/* Zalo social icon */}
          <div className="flex items-center order-3">
            <a
              href={zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on Zalo"
              className="grid place-items-center rounded-full border border-slate-200 text-[#0068FF] hover:border-[#0068FF]/40 hover:bg-[#0068FF]/5 transition-all w-9 h-9"
            >
              {/* Zalo official icon — source: Zalo brand assets */}
              <svg viewBox="0 0 100 100" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M50 5C25.15 5 5 25.15 5 50c0 9.14 2.7 17.65 7.34 24.77L5 95l21.05-6.73C33.02 92.7 41.26 95 50 95c24.85 0 45-20.15 45-45S74.85 5 50 5zm-8.5 55.7L32.8 70.3l-9.3-9.6 9.7-9.3-9.4-14.9h9.4l6.3 9.9 8-9.9h9l-13.3 16.3 8 7.9zm24.3 9.6c-7.7 0-14.6-3.4-19.3-8.8l4.1-4.5c3.5 4.3 8.8 7 14.6 7 5.1 0 9.2-2.1 9.2-5.5 0-3-2.6-4.7-8.7-6.3-8.5-2.2-14-5.4-14-12 0-6.7 5.9-11.5 14.2-11.5 6.1 0 11.5 2.3 15.3 6l-4 4.6c-3-3-7.2-4.9-11.4-4.9-4.5 0-7.3 2-7.3 4.8 0 2.9 2.6 4.3 8.9 6 9 2.4 13.8 5.8 13.8 12.4 0 6.9-5.9 12.7-15.4 12.7z"/>
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

