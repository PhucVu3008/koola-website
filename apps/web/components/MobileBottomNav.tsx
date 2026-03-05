'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Briefcase, 
  Info, 
  Mail, 
  Menu 
} from 'lucide-react';

import { getDictionary } from '../src/i18n/getDictionary';
import { isLocale, type Locale } from '../src/i18n/locales';

/**
 * Mobile Bottom Navigation Bar
 *
 * Features:
 * - Fixed at bottom on mobile only (hidden on desktop)
 * - 5 main navigation items with icons, all uniform height
 * - Animated sliding indicator that follows active tab
 * - Touch-optimized (64px height for easy thumb access)
 * - Smooth animations and transitions
 * - Safe area inset for notched devices (iPhone X+)
 *
 * Navigation Items (left → right):
 * 1. Home   (index 0)
 * 2. About  (index 1)
 * 3. Services (index 2)
 * 4. Careers  (index 3)
 * 5. Contact  (index 4)
 */
export function MobileBottomNav({ locale }: { locale: string }) {
  const pathname = usePathname() ?? '/';
  
  const parts = pathname.split('/').filter(Boolean);
  const fromPath = parts[0];
  const baseLocale: Locale = isLocale(fromPath) ? fromPath : (isLocale(locale) ? locale : 'en');
  
  const dict = getDictionary(baseLocale);

  // Track active index for sliding indicator animation
  const [activeIndex, setActiveIndex] = useState(0); // Default to Home (index 0)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const withLocale = (href: string) => {
    const clean = href === '/' ? '' : href;
    return `/${baseLocale}${clean}`;
  };

  const isActive = (href: string) => {
    const target = withLocale(href);
    if (target === `/${baseLocale}`) return pathname === `/${baseLocale}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  // Navigation items — Home first (left), then About, Services, Careers, Contact
  const navItems = [
    {
      href: '/',
      label: dict.nav.home,
      icon: Home,
      id: 'home',
    },
    {
      href: '/about',
      label: dict.nav.about,
      icon: Info,
      id: 'about',
    },
    {
      href: '/services',
      label: dict.nav.services,
      icon: Menu,
      id: 'services',
    },
    {
      href: '/careers',
      label: dict.nav.careers,
      icon: Briefcase,
      id: 'careers',
    },
    {
      href: '/contact',
      label: dict.nav.contact,
      icon: Mail,
      id: 'contact',
    },
  ];

  // Update active index when route changes
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => isActive(item.href));
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate sliding indicator position (20% per item in 5-column grid)
  const indicatorPosition = activeIndex * 20; // 0%, 20%, 40%, 60%, 80%

  return (
    <>
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] overflow-visible"
        aria-label="Mobile bottom navigation"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)' // iPhone X+ notch support
        }}
      >
        {/* Animated sliding indicator */}
        <div 
          className="absolute top-0 h-0.5 w-1/5 transition-all duration-500 ease-out"
          style={{
            left: `${indicatorPosition}%`,
            background: activeIndex === 2 
              ? 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)' // Gradient for center (Home)
              : 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
          }}
        >
          {/* Glowing effect */}
          <div 
            className="h-full w-full blur-sm"
            style={{
              background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
            }}
          />
        </div>

        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={withLocale(item.href)}
                className="flex flex-col items-center justify-center gap-1 group relative"
              >
                {/* Icon container */}
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-brand-50'
                      : 'group-hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      active
                        ? 'text-brand-600 scale-110'
                        : 'text-slate-500 group-hover:text-brand-600 group-hover:scale-105'
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {active && (
                    <div className="absolute inset-0 rounded-xl bg-brand-600/10" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-colors duration-300 ${
                    active
                      ? 'text-brand-700 font-semibold'
                      : 'text-slate-500 group-hover:text-brand-600'
                  }`}
                >
                  {item.label}
                </span>

                {/* Tap ripple */}
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-brand-100 opacity-0 group-active:opacity-20 transition-opacity duration-150" />
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
