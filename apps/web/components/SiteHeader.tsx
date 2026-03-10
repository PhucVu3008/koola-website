'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logger } from '../src/lib/logger';

import { getDictionary, getSupportedLocales } from '../src/i18n/getDictionary';
import { isLocale, type Locale } from '../src/i18n/locales';

/**
 * Marketing site header - Fully responsive.
 *
 * Features:
 * - Desktop: Horizontal navigation with locale switcher and CTA button
 * - Mobile: Hamburger menu with slide-in drawer
 * - Active route highlighting (brand color)
 * - i18n support with locale-prefixed paths
 */
export function SiteHeader({ locale }: { locale: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  const parts = pathname.split('/').filter(Boolean);
  const fromPath = parts[0];

  const baseLocale: Locale = isLocale(fromPath) ? fromPath : (isLocale(locale) ? locale : 'en');

  const dict = getDictionary(baseLocale);

  const withLocale = (href: string) => {
    const clean = href === '/' ? '' : href;
    return `/${baseLocale}${clean}`;
  };

  const isActive = (href: string) => {
    const target = withLocale(href);
    if (target === `/${baseLocale}`) return pathname === `/${baseLocale}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const linkClass = (href: string) =>
    isActive(href)
      ? 'fluid-text-sm font-semibold text-brand-700'
      : 'fluid-text-sm font-medium text-slate-700 hover:text-slate-900';
  
  const mobileLinkClass = (href: string) =>
    isActive(href)
      ? 'block rounded-lg font-semibold text-brand-700 bg-brand-50 transition-colors fluid-text-base'
      : 'block rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors fluid-text-base';

  const switchTo = async (next: string) => {
    const nextLocale = isLocale(next) ? next : 'en';
    const newParts = pathname.split('/').filter(Boolean);
    
    if (newParts.length === 0) return `/${nextLocale}`;
    
    // Check if we're on a service detail page: /[locale]/services/[slug]
    if (newParts.length >= 3 && newParts[1] === 'services') {
      const currentSlug = newParts[2];
      const currentLocale = isLocale(newParts[0]) ? newParts[0] : baseLocale;

      try {
        // Call API to get translated slug
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/v1/services/slug-map?from_slug=${currentSlug}&from_locale=${currentLocale}&to_locale=${nextLocale}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data?.to_slug) {
            return `/${nextLocale}/services/${data.data.to_slug}`;
          }
        }
      } catch (error) {
        logger.warn('Failed to map service slug', { fromSlug: currentSlug, fromLocale: currentLocale, toLocale: nextLocale, error });
      }
      // If slug mapping failed, go to services list instead of keeping wrong slug
      return `/${nextLocale}/services`;
    }
    
    // Check if we're on a job detail page: /[locale]/careers/[slug]
    if (newParts.length >= 3 && newParts[1] === 'careers') {
      const currentSlug = newParts[2];
      const currentLocale = isLocale(newParts[0]) ? newParts[0] : baseLocale;
      
      try {
        // Call API to get translated job slug
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/v1/jobs/slug-map?from_slug=${currentSlug}&from_locale=${currentLocale}&to_locale=${nextLocale}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.data?.slug) {
            return `/${nextLocale}/careers/${data.data.slug}`;
          }
        }
      } catch (error) {
        logger.warn('Failed to map job slug', { fromSlug: currentSlug, fromLocale: currentLocale, toLocale: nextLocale, error });
      }
    }
    
    // Default behavior: just replace locale
    if (isLocale(newParts[0])) newParts[0] = nextLocale;
    else newParts.unshift(nextLocale);
    return `/${newParts.join('/')}`;
  };

  const supportedLocales = getSupportedLocales();

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-slate-100">
      {/* Full-width background, contained content */}
      <div className="w-full">
        <div className="fluid-container">
          <div className="flex items-center justify-between" style={{ height: 'clamp(3.5rem, 8vh, 4.5rem)' }}>
            {/* Logo - Fluid size */}
            <Link 
              href={`/${baseLocale}`} 
              className="z-50 font-semibold tracking-tight text-slate-900 fluid-text-base"
            >
              KOOLA
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav aria-label="Primary" className="hidden lg:flex items-center fluid-gap-lg">
              <Link href={withLocale('/')} className={linkClass('/')}>{dict.nav.home}</Link>
              <Link href={withLocale('/about')} className={linkClass('/about')}>{dict.nav.about}</Link>
              <Link href={withLocale('/services')} className={linkClass('/services')}>{dict.nav.services}</Link>
              <Link href={withLocale('/careers')} className={linkClass('/careers')}>{dict.nav.careers}</Link>
              <Link href={withLocale('/contact')} className={linkClass('/contact')}>{dict.nav.contact}</Link>
            </nav>

            {/* Desktop Actions - Hidden on mobile */}
            <div className="hidden lg:flex items-center fluid-gap-sm">
              <div className="relative flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5" role="radiogroup" aria-label="Language">
                {supportedLocales.map((l) => (
                  <button
                    key={l}
                    role="radio"
                    aria-checked={baseLocale === l}
                    disabled={isSwitching}
                    onClick={async () => {
                      if (l === baseLocale || isSwitching) return;
                      setIsSwitching(true);
                      try {
                        const newUrl = await switchTo(l);
                        router.push(newUrl);
                      } finally {
                        setIsSwitching(false);
                      }
                    }}
                    className={`relative z-10 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                      baseLocale === l
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    } ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              <Link
                href={withLocale('/contact')}
                className="inline-flex items-center justify-center rounded-full bg-brand-600 text-white font-medium transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 fluid-h-sm fluid-text-xs"
                style={{ paddingLeft: 'clamp(0.75rem, 2.5vw, 1.25rem)', paddingRight: 'clamp(0.75rem, 2.5vw, 1.25rem)' }}
              >
                {dict.nav.scheduleCall}
              </Link>
            </div>

            {/* Mobile Menu Button - Shown on mobile only */}
            <button
              type="button"
              className="lg:hidden z-50 p-2 -mr-2 text-slate-700 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
            {mobileMenuOpen ? (
              // Close Icon (X)
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger Icon
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide-in drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto" style={{ 
          paddingTop: 'clamp(4rem, 15vh, 5rem)', 
          paddingBottom: 'clamp(1.5rem, 5vh, 2rem)',
          paddingLeft: 'clamp(1rem, 5vw, 1.5rem)',
          paddingRight: 'clamp(1rem, 5vw, 1.5rem)'
        }}>
          {/* Mobile Navigation */}
          <nav aria-label="Mobile navigation" style={{ marginBottom: 'clamp(2rem, 8vh, 3rem)' }} className="space-y-2">
            <Link 
              href={withLocale('/')} 
              className={mobileLinkClass('/')}
              style={{ 
                paddingTop: 'clamp(0.75rem, 3vw, 1rem)', 
                paddingBottom: 'clamp(0.75rem, 3vw, 1rem)',
                paddingLeft: 'clamp(1rem, 4vw, 1.25rem)',
                paddingRight: 'clamp(1rem, 4vw, 1.25rem)'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.home}
            </Link>
            <Link 
              href={withLocale('/about')} 
              className={mobileLinkClass('/about')}
              style={{ 
                paddingTop: 'clamp(0.75rem, 3vw, 1rem)', 
                paddingBottom: 'clamp(0.75rem, 3vw, 1rem)',
                paddingLeft: 'clamp(1rem, 4vw, 1.25rem)',
                paddingRight: 'clamp(1rem, 4vw, 1.25rem)'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.about}
            </Link>
            <Link 
              href={withLocale('/services')} 
              className={mobileLinkClass('/services')}
              style={{ 
                paddingTop: 'clamp(0.75rem, 3vw, 1rem)', 
                paddingBottom: 'clamp(0.75rem, 3vw, 1rem)',
                paddingLeft: 'clamp(1rem, 4vw, 1.25rem)',
                paddingRight: 'clamp(1rem, 4vw, 1.25rem)'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.services}
            </Link>
            <Link 
              href={withLocale('/careers')} 
              className={mobileLinkClass('/careers')}
              style={{ 
                paddingTop: 'clamp(0.75rem, 3vw, 1rem)', 
                paddingBottom: 'clamp(0.75rem, 3vw, 1rem)',
                paddingLeft: 'clamp(1rem, 4vw, 1.25rem)',
                paddingRight: 'clamp(1rem, 4vw, 1.25rem)'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.careers}
            </Link>
            <Link 
              href={withLocale('/contact')} 
              className={mobileLinkClass('/contact')}
              style={{ 
                paddingTop: 'clamp(0.75rem, 3vw, 1rem)', 
                paddingBottom: 'clamp(0.75rem, 3vw, 1rem)',
                paddingLeft: 'clamp(1rem, 4vw, 1.25rem)',
                paddingRight: 'clamp(1rem, 4vw, 1.25rem)'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.contact}
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            {/* Locale Toggle */}
            <div>
              <span className="block fluid-text-sm font-medium text-slate-700 mb-2">
                {locale === 'vi' ? 'Ngôn ngữ' : 'Language'}
              </span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1" role="radiogroup" aria-label="Language">
                {supportedLocales.map((l) => (
                  <button
                    key={l}
                    role="radio"
                    aria-checked={baseLocale === l}
                    disabled={isSwitching}
                    onClick={async () => {
                      if (l === baseLocale || isSwitching) return;
                      setIsSwitching(true);
                      try {
                        const newUrl = await switchTo(l);
                        router.push(newUrl);
                        setMobileMenuOpen(false);
                      } finally {
                        setIsSwitching(false);
                      }
                    }}
                    className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all duration-200 ${
                      baseLocale === l
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    } ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {l === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={withLocale('/contact')}
              className="block w-full flex items-center justify-center rounded-lg bg-brand-600 px-4 fluid-text-base font-medium text-white transition-colors hover:bg-brand-700 fluid-h-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.nav.scheduleCall}
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
