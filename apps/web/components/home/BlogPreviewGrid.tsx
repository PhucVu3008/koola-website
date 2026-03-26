'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import type { PostPreview } from '../../src/lib/api/posts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BlogPreviewStaticItem = {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
  href?: string;
};

export type BlogPreviewGridData = {
  title: string;
  items: ReadonlyArray<BlogPreviewStaticItem>;
};

type UnifiedItem = {
  id: string;
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
  href: string;
  /** true → served from API uploads, skip Next.js image optimizer */
  isUploaded: boolean;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AUTO_SLIDE_MS = 5_000;

/**
 * Slug → local public image mapping.
 * Used as fallback when a post has no hero_storage_path (e.g. at build time).
 */
const SLUG_FALLBACK: Record<string, string> = {
  'introduction-to-industrial-iot':                   '/blog/iot.jpg',
  'gioi-thieu-iot-cong-nghiep':                       '/blog/iot.jpg',
  'top-10-automation-trends-2026':                    '/blog/automation.jpg',
  'top-10-xu-huong-tu-dong-hoa-2026':                 '/blog/automation.jpg',
  'building-your-first-iot-solution':                 '/blog/iot-solution.jpg',
  'xay-dung-giai-phap-iot-dau-tien':                  '/blog/iot-solution.jpg',
  'ai-reshaping-software-development-2026':           '/blog/ai-dev.jpg',
  'ai-dinh-hinh-phat-trien-phan-mem-2026':            '/blog/ai-dev.jpg',
  'cloud-migration-best-practices-2026':              '/blog/cloud.jpg',
  'huong-dan-di-chuyen-len-cloud-2026':               '/blog/cloud.jpg',
  'top-cybersecurity-threats-defense-2026':           '/blog/security.jpg',
  'cac-moi-de-doa-bao-mat-va-cach-phong-thu-2026':    '/blog/security.jpg',
};

const DEFAULT_FALLBACK = '/blog/ai-dev.jpg';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveHeroImage(post: PostPreview): { src: string; isUploaded: boolean } {
  const storagePath = (post as any).hero_storage_path as string | null | undefined;
  if (storagePath) {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';
    return { src: `${base}/uploads/${storagePath}`, isUploaded: true };
  }
  return { src: SLUG_FALLBACK[post.slug] ?? DEFAULT_FALLBACK, isUploaded: false };
}

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BlogPreviewGrid({
  data,
  posts,
  locale = 'en',
}: {
  data: BlogPreviewGridData;
  posts?: PostPreview[];
  locale?: string;
}) {
  // Normalise API posts or static fallback into one unified shape
  const items: UnifiedItem[] = useMemo(() => {
    if (posts && posts.length > 0) {
      return posts.map((p) => {
        const { src, isUploaded } = resolveHeroImage(p);
        return {
          id: String(p.id),
          image: src,
          category: p.categories?.[0]?.name ?? 'Blog',
          title: p.title,
          author: '',
          date: formatDate(p.published_at, locale),
          href: `/${locale}/blog/${p.slug}`,
          isUploaded,
        };
      });
    }
    return data.items.map((it, i) => ({
      id: String(i),
      image: it.image,
      category: it.category,
      title: it.title,
      author: it.author,
      date: it.date,
      href: it.href ?? `/${locale}/blog`,
      isUploaded: false,
    }));
  }, [posts, data.items, locale]);

  // -------------------------------------------------------------------------
  // Responsive cards-per-page
  // -------------------------------------------------------------------------
  const [perPage, setPerPage] = useState(3);
  useEffect(() => {
    const sync = () => {
      if (window.innerWidth < 640) setPerPage(1);
      else if (window.innerWidth < 1024) setPerPage(2);
      else setPerPage(3);
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const maxStart = Math.max(0, items.length - perPage);

  // -------------------------------------------------------------------------
  // Slide state
  // -------------------------------------------------------------------------
  const [index, setIndex] = useState(0);
  const [anim, setAnim]   = useState<'idle' | 'out' | 'in'>('idle');
  const [dir, setDir]     = useState<-1 | 1>(1);
  // Use a ref for paused so the interval closure never goes stale
  const pausedRef = useRef(false);

  // Clamp index when perPage changes
  useEffect(() => {
    setIndex((v) => Math.max(0, Math.min(maxStart, v)));
  }, [maxStart]);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const go = useCallback(
    (next: number, forcedDir?: -1 | 1) => {
      const clamped = Math.max(0, Math.min(maxStart, next));
      const d: -1 | 1 = forcedDir ?? (clamped > index ? 1 : -1);
      if (prefersReducedMotion) {
        setIndex(clamped);
        return;
      }
      setDir(d);
      setAnim('out');
      window.setTimeout(() => {
        setIndex(clamped);
        setAnim('in');
        window.setTimeout(() => setAnim('idle'), 180);
      }, 150);
    },
    [index, maxStart, prefersReducedMotion],
  );

  // Stable ref so the interval always calls the latest `go`
  const goRef = useRef(go);
  goRef.current = go;

  // Silent auto-advance — no visible progress indicator
  useEffect(() => {
    if (maxStart === 0) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((cur) => {
          const next = cur < maxStart ? cur + 1 : 0;
          goRef.current(next, 1);
          return cur;
        });
      }
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [maxStart]);

  // -------------------------------------------------------------------------
  // Derived render values
  // -------------------------------------------------------------------------
  const windowItems = useMemo(
    () => Array.from({ length: perPage }, (_, i) => items[index + i]).filter(Boolean),
    [items, index, perPage],
  );

  const animClass =
    anim === 'out'
      ? dir === 1 ? 'opacity-0 -translate-x-3' : 'opacity-0 translate-x-3'
      : 'opacity-100 translate-x-0';

  const totalDots = maxStart + 1;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div
      className="space-y-7"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-10 w-1 rounded-full bg-blue-600" aria-hidden />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {data.title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Slide indicators — pill dots, desktop only */}
          {totalDots > 1 && (
            <div
              className="hidden sm:flex items-center gap-1.5"
              role="tablist"
              aria-label="Blog slides"
            >
              {Array.from({ length: totalDots }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => go(i)}
                  className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    i === index
                      ? 'w-5 h-1.5 bg-blue-600'
                      : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}

          <Link
            href={`/${locale}/blog`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {locale === 'vi' ? 'Xem tất cả →' : 'View all →'}
          </Link>
        </div>
      </div>

      {/* ── Cards ──────────────────────────────────────────────────────────── */}
      <div
        className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 transition-[opacity,transform] duration-[180ms] ease-out will-change-[opacity,transform] ${animClass}`}
      >
        {windowItems.map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className="group block rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:ring-slate-200 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <Image
                src={it.image}
                alt={it.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                unoptimized={it.isUploaded}
              />
              <span className="absolute top-3 left-3 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {it.category}
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-5">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                {it.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {it.author ? `${it.author} · ` : ''}{it.date}
                </span>
                <span className="text-xs font-medium text-blue-500 group-hover:translate-x-0.5 transition-transform duration-200">
                  {locale === 'vi' ? 'Đọc →' : 'Read →'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Mobile: dots + arrows ───────────────────────────────────────────── */}
      {totalDots > 1 && (
        <div className="flex sm:hidden items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalDots }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 h-1.5 bg-blue-600' : 'w-1.5 h-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(index - 1, -1)}
              disabled={index === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(index + 1, 1)}
              disabled={index === maxStart}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
