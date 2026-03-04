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
 * - 5 main navigation items with icons
 * - Animated sliding indicator that follows active tab
 * - Center item with premium elevated design
 * - Touch-optimized (56px height for easy thumb access)
 * - Smooth animations and transitions
 * - Safe area inset for notched devices (iPhone X+)
 * 
 * Navigation Items:
 * 1. About (index 0)
 * 2. Services (index 1)
 * 3. Home (center, index 2, elevated)
 * 4. Careers (index 3)
 * 5. Contact (index 4)
 */
export function MobileBottomNav({ locale }: { locale: string }) {
  const pathname = usePathname() ?? '/';
  
  const parts = pathname.split('/').filter(Boolean);
  const fromPath = parts[0];
  const baseLocale: Locale = isLocale(fromPath) ? fromPath : (isLocale(locale) ? locale : 'en');
  
  const dict = getDictionary(baseLocale);

  // Track active index for sliding indicator animation
  const [activeIndex, setActiveIndex] = useState(2); // Default to Home (center)
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

  // Navigation items configuration
  // Layout: About - Services - HOME (center) - Careers - Contact
  const navItems = [
    {
      href: '/about',
      label: dict.nav.about,
      icon: Info,
      id: 'about'
    },
    {
      href: '/services',
      label: dict.nav.services,
      icon: Menu,
      id: 'services'
    },
    {
      href: '/',
      label: dict.nav.home,
      icon: Home,
      id: 'home',
      isCenter: true
    },
    {
      href: '/careers',
      label: dict.nav.careers,
      icon: Briefcase,
      id: 'careers'
    },
    {
      href: '/contact',
      label: dict.nav.contact,
      icon: Mail,
      id: 'contact'
    }
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
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
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

            // Center item (Home) - Premium elevated design with double ring
            if (item.isCenter) {
              return (
                <Link
                  key={item.id}
                  href={withLocale(item.href)}
                  className="relative flex flex-col items-center justify-center group"
                >
                  {/* Outer glow ring - subtle pulse animation */}
                  <div 
                    className={`absolute -top-8 h-16 w-16 rounded-full transition-all duration-500 ${
                      active 
                        ? 'bg-brand-500/20 animate-pulse' 
                        : 'bg-transparent group-hover:bg-brand-500/10'
                    }`}
                  />
                  
                  {/* Main elevated button with premium design */}
                  <div 
                    className={`absolute -top-7 h-[58px] w-[58px] rounded-full transition-all duration-300 ${
                      active 
                        ? 'shadow-[0_8px_30px_rgba(79,70,229,0.4)]' 
                        : 'shadow-[0_4px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_6px_25px_rgba(79,70,229,0.25)]'
                    }`}
                  >
                    {/* Double ring border effect */}
                    <div 
                      className={`h-full w-full rounded-full p-[2px] transition-all duration-300 ${
                        active 
                          ? 'bg-gradient-to-br from-brand-400 via-brand-600 to-purple-600' 
                          : 'bg-gradient-to-br from-slate-200 to-slate-300 group-hover:from-brand-300 group-hover:to-purple-400'
                      }`}
                    >
                      {/* Inner circle with icon */}
                      <div 
                        className={`flex h-full w-full items-center justify-center rounded-full transition-all duration-300 ${
                          active 
                            ? 'bg-gradient-to-br from-brand-600 to-brand-700 scale-105' 
                            : 'bg-white group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 group-hover:scale-105'
                        }`}
                      >
                        <Icon 
                          className={`h-6 w-6 transition-all duration-300 ${
                            active 
                              ? 'text-white scale-110' 
                              : 'text-slate-700 group-hover:text-brand-600 group-hover:scale-105'
                          }`}
                          strokeWidth={active ? 2.5 : 2}
                        />
                      </div>
                    </div>
                    
                    {/* Sparkle particles when active */}
                    {active && (
                      <>
                        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
                        <div className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" style={{ animationDelay: '0.3s' }} />
                        <div className="absolute top-0 left-1/2 h-1 w-1 rounded-full bg-purple-400 animate-ping" style={{ animationDelay: '0.6s' }} />
                      </>
                    )}
                  </div>
                  
                  {/* Label below with gradient on active */}
                  <span 
                    className={`mt-6 text-[10px] font-semibold tracking-wide transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent' 
                        : 'text-slate-600 group-hover:text-brand-600'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator bar underneath */}
                  {active && (
                    <div className="absolute bottom-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 animate-pulse" />
                  )}
                </Link>
              );
            }

            // Regular nav items
            return (
              <Link
                key={item.id}
                href={withLocale(item.href)}
                className="flex flex-col items-center justify-center gap-1 group relative"
              >
                {/* Icon with background on active */}
                <div 
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${
                    active 
                      ? 'bg-brand-50' 
                      : 'group-hover:bg-slate-50'
                  }`}
                >
                  <Icon 
                    className={`h-5 w-5 transition-all duration-500 ${
                      active 
                        ? 'text-brand-600 scale-110' 
                        : 'text-slate-600 group-hover:text-brand-600 group-hover:scale-105'
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />

                  {/* Active glow effect */}
                  {active && (
                    <div className="absolute inset-0 rounded-xl bg-brand-600/10 animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <span 
                  className={`text-[10px] font-medium transition-all duration-500 ${
                    active 
                      ? 'text-brand-700 font-semibold' 
                      : 'text-slate-600 group-hover:text-brand-600'
                  }`}
                >
                  {item.label}
                </span>

                {/* Ripple effect on tap */}
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-brand-100 opacity-0 group-active:opacity-30 transition-opacity duration-150" />
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
