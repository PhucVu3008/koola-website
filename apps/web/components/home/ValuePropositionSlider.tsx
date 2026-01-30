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
  // Icon with distinct animation - bounce + color shift (different from Services rotation)
  const common = 'relative h-9 w-9 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 ring-1 ring-slate-200 transition-all duration-500 group-hover:from-emerald-50 group-hover:to-teal-50 group-hover:ring-2 group-hover:ring-emerald-300 group-hover:shadow-md group-hover:shadow-emerald-200/40';

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
      {/* Shimmer effect layer */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" 
           style={{ transform: 'translateX(-100%)' }} />
      
      {/* Icon with bounce animation */}
      <Icon className="relative h-full w-full p-2 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-emerald-600" strokeWidth={1.7} />
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
      {/* Section header with simple accent bar */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
        <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>
      </div>

      <div className="relative">
        <div
          className={`grid grid-cols-3 gap-7 transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] ${gridAnimClass}`}
        >
          {windowItems.map((it) => (
            <div 
              key={it.title} 
              className="group perspective-1000"
              style={{ perspective: '1000px' }}
            >
              {/* Animated gradient border wrapper */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 via-emerald-200 to-teal-200 p-[1px] transition-all duration-500 group-hover:from-emerald-300 group-hover:via-teal-300 group-hover:to-cyan-300 group-hover:shadow-lg group-hover:shadow-emerald-200/50">
                {/* 3D tilt effect on card */}
                <Card className="relative p-7 transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:[transform:rotateX(2deg)_rotateY(-2deg)]">
                  {/* Shine overlay effect */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <ValueIcon name={it.icon} />
                  <div className="relative mt-5 text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-emerald-700">
                    {it.title}
                  </div>
                  <p className="relative mt-2 text-sm leading-6 text-slate-500 transition-colors duration-300 group-hover:text-slate-700">
                    {it.description}
                  </p>
                </Card>
              </div>
            </div>
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
