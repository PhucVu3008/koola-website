'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import type { PostPreview } from '../../src/lib/api/posts';

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
  isUploaded: boolean;
};

const AUTO_SLIDE_MS = 5_000;

function resolveHeroImage(post: PostPreview): string {
  const sp = (post as any).hero_storage_path as string | null | undefined;
  if (sp) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
    return `${base}/uploads/${sp}`;
  }
  return '/home/blog-1.png';
}

function formatPostDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function BlogPreviewGrid({
  data,
  posts,
  locale = 'en',
}: {
  data: BlogPreviewGridData;
  posts?: PostPreview[];
  locale?: string;
}) {
  const items: UnifiedItem[] = useMemo(() => {
    if (posts && posts.length > 0) {
      return posts.map((p) => ({
        id: String(p.id),
        image: resolveHeroImage(p),
        category: p.categories?.[0]?.name ?? 'Blog',
        title: p.title,
        author: '',
        date: formatPostDate(p.published_at, locale),
        href: `/${locale}/blog/${p.slug}`,
        isUploaded: !!(p as any).hero_storage_path,
      }));
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

  const [itemsPerPage, setItemsPerPage] = useState(3);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxStart = Math.max(0, items.length - itemsPerPage);
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState<'idle' | 'out' | 'in'>('idle');
  const [dir, setDir] = useState<-1 | 1>(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

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
      if (clamped === index && forcedDir === undefined) return;
      const d: -1 | 1 = forcedDir ?? (clamped > index ? 1 : -1);
      setDir(d);
      setProgress(0);
      if (prefersReducedMotion) { setIndex(clamped); return; }
      setAnim('out');
      window.setTimeout(() => {
        setIndex(clamped);
        setAnim('in');
        window.setTimeout(() => setAnim('idle'), 160);
      }, 140);
    },
    [index, maxStart, prefersReducedMotion]
  );

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const goRef = useRef(go);
  goRef.current = go;

  useEffect(() => {
    if (maxStart === 0) return;
    setProgress(0);

    const progressTimer = setInterval(() => {
      if (!pausedRef.current)
        setProgress((p) => Math.min(100, p + 100 / (AUTO_SLIDE_MS / 50)));
    }, 50);

    const slideTimer = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((cur) => {
          const next = cur < maxStart ? cur + 1 : 0;
          goRef.current(next, 1);
          return cur;
        });
      }
    }, AUTO_SLIDE_MS);

    return () => {
      clearInterval(progressTimer);
      clearInterval(slideTimer);
    };
  }, [maxStart]);

  const windowItems = useMemo(
    () => Array.from({ length: itemsPerPage }, (_, i) => items[index + i]).filter(Boolean),
    [items, index, itemsPerPage]
  );

  const canPrev = index > 0;
  const canNext = index < maxStart;
  const totalSlides = maxStart + 1;

  const animClass =
    anim === 'idle' ? 'opacity-100 translate-x-0'
    : anim === 'out' ? (dir === 1 ? 'opacity-0 -translate-x-4' : 'opacity-0 translate-x-4')
    : 'opacity-100 translate-x-0';

  return (
    <div
      className="space-y-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
          <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>
        </div>
        <Link
          href={`/${locale}/blog`}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {locale === 'vi' ? 'Xem tất cả' : 'View all'} →
        </Link>
      </div>

      {maxStart > 0 && (
        <div className="h-0.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] ${animClass}`}
      >
        {windowItems.map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className="group block rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden hover:shadow-md hover:ring-blue-200 transition-all duration-300"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <Image
                src={it.image}
                alt={it.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                unoptimized={it.isUploaded}
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {it.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col p-5">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
                {it.title}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {it.author ? `${it.author} · ` : ''}{it.date}
                </p>
                <span className="text-xs font-medium text-blue-500 group-hover:translate-x-0.5 transition-transform">
                  {locale === 'vi' ? 'Đọc →' : 'Read →'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {maxStart > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }, (_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === index ? 'w-6 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(index - 1)}
              disabled={!canPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(index + 1)}
              disabled={!canNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="sm:hidden text-center">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {locale === 'vi' ? 'Xem tất cả bài viết' : 'View all posts'} →
        </Link>
      </div>
    </div>
  );
}
