'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Floating contact button — fixed phone icon at bottom-right.
 * Hidden on /contact page and admin routes.
 */
export function FloatingContactButton({ locale }: { locale: string }) {
  const pathname = usePathname() ?? '';

  if (pathname.includes('/contact') || pathname.startsWith('/admin')) return null;

  return (
    <Link
      href={`/${locale}/contact`}
      className="fixed bottom-40 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-105"
      aria-label="Contact us"
    >
      {/* Ping ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/40" style={{ animationDuration: '2s' }} />

      {/* Phone icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 h-6 w-6 animate-[ring_2s_ease-in-out_infinite]"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </Link>
  );
}
