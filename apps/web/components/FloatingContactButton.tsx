'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Floating contact button — draggable phone icon at bottom-right.
 * Ringing animation to attract attention.
 * Hidden on /contact page and admin routes.
 */
export function FloatingContactButton({ locale }: { locale: string }) {
  const pathname = usePathname() ?? '';
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => { setMounted(true); }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    setHasMoved(false);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setHasMoved(true);
    setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Hide on contact page or admin
  if (pathname.includes('/contact') || pathname.startsWith('/admin')) return null;

  return (
    <Link
      ref={btnRef}
      href={`/${locale}/contact`}
      onClick={(e) => { if (hasMoved) e.preventDefault(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 transition-shadow select-none ${
        dragging ? 'cursor-grabbing shadow-xl' : 'cursor-grab hover:shadow-xl hover:shadow-brand-500/40'
      } ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} transition-all duration-300`}
      style={{
        bottom: `calc(5rem + ${-pos.y}px)`,
        right: `calc(1.25rem + ${-pos.x}px)`,
        touchAction: 'none',
      }}
      aria-label="Contact us"
    >
      {/* Ping ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/40" style={{ animationDuration: '2s' }} />

      {/* Phone icon with ringing animation */}
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
