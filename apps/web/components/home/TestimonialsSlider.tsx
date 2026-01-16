'use client';

import { useState } from 'react';

import { Card } from '../ui/Card';

export type TestimonialsSliderData = {
  title: string;
  subtitle: string;
  helper: string;
  items: ReadonlyArray<{ stars: number; quote: string; name: string }>;
};

function Stars({ count }: { count: number }) {
  const full = Math.max(0, Math.min(5, count));
  return (
    <div className="flex items-center gap-1 text-amber-400" aria-label={`${full} star rating`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="M12 2l2.8 6.7 7.2.6-5.5 4.7 1.7 7.1L12 17.8 5.8 21l1.7-7.1L2 9.3l7.2-.6L12 2Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

/**
 * Testimonials carousel (navigation arrows only).
 */
export function TestimonialsSlider({ data }: { data: TestimonialsSliderData }) {
  const [index, setIndex] = useState(0);
  const max = data.items.length;

  const item = data.items[index] ?? data.items[0];

  const canPrev = index > 0;
  const canNext = index < max - 1;

  return (
    <div className="grid grid-cols-2 items-center gap-12">
      <div>
        <h2 className="text-3xl font-semibold leading-tight text-slate-900">
          {data.title}
          <br />
          {data.subtitle}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">{data.helper}</p>
      </div>

      <div>
        <Card className="relative p-7">
          <Stars count={item.stars} />
          <p className="mt-4 text-sm leading-6 text-slate-700">{item.quote}</p>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-200" aria-hidden />
            <div className="text-sm font-semibold text-slate-900">{item.name}</div>
          </div>
        </Card>

        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
            onClick={() => setIndex((v) => Math.max(0, v - 1))}
            disabled={!canPrev}
            aria-label="Previous"
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
            onClick={() => setIndex((v) => Math.min(max - 1, v + 1))}
            disabled={!canNext}
            aria-label="Next"
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
