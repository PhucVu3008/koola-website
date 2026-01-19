'use client';

import { useMemo, useState, useEffect } from 'react';

import { Card } from '../ui/Card';

import {
  Award,
  BadgeCheck,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type ValuePropositionSliderData = {
  title: string;
  items: ReadonlyArray<{ icon: string; title: string; description: string }>;
};

function ValueIcon({ name }: { name: string }) {
  const common = 'h-9 w-9 rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200';

  const IconByName: Record<string, LucideIcon> = {
    // Expertise / credibility
    badge: BadgeCheck,

    // Track record / outcomes
    award: Award,

    // Collaboration / communication
    users: Users,

    // Process / tailored solutions
    settings: Settings,
  };

  const Icon = IconByName[name] ?? BadgeCheck;

  return (
    <div className={common} aria-hidden>
      <Icon className="h-full w-full p-2" strokeWidth={1.7} />
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

  // Drive a light, premium transition when users navigate.
  const [anim, setAnim] = useState<'idle' | 'in' | 'out'>('idle');
  const [dir, setDir] = useState<-1 | 1>(1);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const go = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(total - 3, nextIndex));
    if (clamped === index) return;

    const nextDir: -1 | 1 = clamped > index ? 1 : -1;
    setDir(nextDir);

    if (prefersReducedMotion) {
      setIndex(clamped);
      return;
    }

    // Phase 1: fade/slide out, then swap content, then fade/slide in.
    setAnim('out');
    window.setTimeout(() => {
      setIndex(clamped);
      setAnim('in');
      window.setTimeout(() => setAnim('idle'), 160);
    }, 140);
  };

  // Keep state sane if data length changes.
  useEffect(() => {
    setIndex((v: number) => Math.max(0, Math.min(Math.max(0, total - 3), v)));
  }, [total]);

  const windowItems = useMemo(() => {
    const start = index;
    return [0, 1, 2]
      .map((offset) => data.items[start + offset])
      .filter(
        (it): it is { icon: string; title: string; description: string } => Boolean(it),
      );
  }, [data.items, index]);

  const canPrev = index > 0;
  const canNext = index < total - 3;

  const gridAnimClass =
    anim === 'idle'
      ? 'opacity-100 translate-x-0'
      : anim === 'out'
        ? dir === 1
          ? 'opacity-0 -translate-x-4'
          : 'opacity-0 translate-x-4'
        : dir === 1
          ? 'opacity-100 translate-x-0'
          : 'opacity-100 translate-x-0';

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>

      <div className="relative">
        <div
          className={`grid grid-cols-3 gap-7 transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] ${gridAnimClass}`}
        >
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
            onClick={() => go(index - 1)}
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
            onClick={() => go(index + 1)}
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
