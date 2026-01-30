'use client';

import Image from 'next/image';

import { Card } from '../ui/Card';
import { InteractiveCard } from '../ui/InteractiveCard';
import { useMemo, useState } from 'react';

export type BlogPreviewGridData = {
  title: string;
  items: ReadonlyArray<{
    image: string;
    category: string;
    title: string;
    author: string;
    date: string;
  }>;
};

/**
 * Blog preview section (exactly three items).
 */
export function BlogPreviewGrid({ data }: { data: BlogPreviewGridData }) {
  const [index, setIndex] = useState(0);

  const [anim, setAnim] = useState<'idle' | 'in' | 'out'>('idle');
  const [dir, setDir] = useState<-1 | 1>(1);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const maxStart = Math.max(0, data.items.length - 3);

  const go = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(maxStart, nextIndex));
    if (clamped === index) return;

    const nextDir: -1 | 1 = clamped > index ? 1 : -1;
    setDir(nextDir);

    if (prefersReducedMotion) {
      setIndex(clamped);
      return;
    }

    setAnim('out');
    window.setTimeout(() => {
      setIndex(clamped);
      setAnim('in');
      window.setTimeout(() => setAnim('idle'), 160);
    }, 140);
  };

  const windowItems = useMemo(() => {
    const start = index;
    return [0, 1, 2]
      .map((offset) => data.items[start + offset])
      .filter(
        (it): it is BlogPreviewGridData['items'][number] => Boolean(it),
      );
  }, [data.items, index]);

  const canPrev = index > 0;
  const canNext = index < maxStart;

  const gridAnimClass =
    anim === 'idle'
      ? 'opacity-100 translate-x-0'
      : anim === 'out'
        ? dir === 1
          ? 'opacity-0 -translate-x-4'
          : 'opacity-0 translate-x-4'
        : 'opacity-100 translate-x-0';

  return (
    <div className="space-y-10">
      {/* Section header with simple accent bar */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
        <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>
      </div>

      <div
        className={`grid grid-cols-3 gap-7 transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] ${gridAnimClass}`}
      >
        {windowItems.map((it) => (
          <InteractiveCard key={it.title} className="hover:translate-y-0 hover:scale-100">
            <Card className="flex h-full flex-col overflow-hidden p-0">
              <Image
                src={it.image}
                alt={it.title}
                width={420}
                height={240}
                className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {it.category}
                </div>
                <div className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                  {it.title}
                </div>
                <div className="mt-auto pt-4 text-xs text-slate-500">
                  {it.author} {it.date}
                </div>
              </div>
            </Card>
          </InteractiveCard>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
            aria-label="Previous"
            onClick={() => go(index - 1)}
            disabled={!canPrev}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="M15 18 9 12l6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
            aria-label="Next"
            onClick={() => go(index + 1)}
            disabled={!canNext}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="m9 18 6-6-6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
