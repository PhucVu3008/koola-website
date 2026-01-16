'use client';

import { useMemo, useState } from 'react';

import { Card } from '../ui/Card';

export type ValuePropositionSliderData = {
  title: string;
  items: ReadonlyArray<{ icon: string; title: string; description: string }>;
};

function ValueIcon({ name }: { name: string }) {
  const common = 'h-9 w-9 rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200';
  const paths: Record<string, string> = {
    badge: 'M12 2 15 5l4 1v6c0 5-3.4 9.4-7 10-3.6-.6-7-5-7-10V6l4-1 3-3Z',
    award: 'M12 2 7 6v6a5 5 0 0 0 10 0V6l-5-4Z',
    users: 'M16 11a3 3 0 1 0-2.9-3.6A3 3 0 0 0 16 11Zm-8 0a3 3 0 1 0-2.9-3.6A3 3 0 0 0 8 11Zm0 2c-3 0-5 1.5-5 3.5V20h10v-3.5C13 14.5 11 13 8 13Zm8 0c-1.1 0-2.1.2-3 .6 1.3.9 2 2.1 2 3.4V20h9v-3.5c0-2-2-3.5-5-3.5Z',
    settings: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm9 4-2.2.9.3 2.3-2.2 1.3-1.8-1.4-2 .9-2-.9-1.8 1.4-2.2-1.3.3-2.3L3 12l2.2-.9-.3-2.3L7.1 7.5l1.8 1.4 2-.9 2 .9 1.8-1.4 2.2 1.3-.3 2.3L21 12Z',
  };

  return (
    <div className={common} aria-hidden>
      <svg viewBox="0 0 24 24" className="h-full w-full p-2">
        <path
          d={paths[name] ?? paths.badge}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Horizontal value proposition slider.
 */
export function ValuePropositionSlider({
  data,
}: {
  data: ValuePropositionSliderData;
}) {
  const [index, setIndex] = useState(0);
  const total = data.items.length;

  const windowItems = useMemo(() => {
    const start = index;
    return [0, 1, 2]
      .map((offset) => data.items[start + offset])
      .filter(
        (it): it is { icon: string; title: string; description: string } => Boolean(it),
      );
  }, [data.items, index]);

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>

      <div className="relative">
        <div className="grid grid-cols-3 gap-7">
          {windowItems.map((it) => (
            <Card key={it.title} className="p-7">
              <ValueIcon name={it.icon} />
              <div className="mt-5 text-base font-semibold text-slate-900">{it.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{it.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
            onClick={() => setIndex((v: number) => Math.max(0, v - 1))}
            disabled={index === 0}
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
            onClick={() => setIndex((v: number) => Math.min(total - 3, v + 1))}
            disabled={index >= total - 3}
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
