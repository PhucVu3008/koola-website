'use client';

import { useEffect, useRef, useState } from 'react';

export type WorkProcessData = {
  title: string;
  subtitle: string;
  steps: Array<{ step: number; title: string; description: string }>;
};

/**
 * Section 4: Work Process
 *
 * Timeline layout with a single step-number pill as the only ordinal element.
 * Desktop: horizontal connector line through pill centres; centre at h-6 (24px = 1.5rem).
 * Mobile: vertical connector from bottom of each pill to top of next.
 * No duplicate numbers or icon shapes.
 */
export function WorkProcess({ data }: { data: WorkProcessData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Faint diagonal stripe texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #6366f1 0, #6366f1 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-600">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-indigo-400" />
            How We Work
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">{data.subtitle}</p>
        </div>

        {/* Timeline grid */}
        <div ref={ref} className="relative">

          {/*
            Desktop horizontal connector.
            Pill height on desktop = h-12 = 48px → centre = 24px = 1.5rem.
            The connector sits at top-[1.5rem] relative to the grid wrapper.
            left/right are trimmed so the line runs pill-centre to pill-centre.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute hidden lg:block"
            style={{
              top: '1.5rem',
              left: 'calc(12.5% - 0px)',   /* centred on first pill */
              right: 'calc(12.5% - 0px)',  /* centred on last pill */
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, #c7d2fe 8%, #c7d2fe 92%, transparent 100%)',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {data.steps.map((s, i) => {
              const num = String(s.step).padStart(2, '0');
              return (
                <div
                  key={s.step}
                  className="group relative flex flex-col lg:items-center lg:text-center"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(28px)',
                    transition: `opacity 0.6s ease ${i * 140}ms, transform 0.6s ease ${i * 140}ms`,
                  }}
                >
                  {/* ── Mobile vertical connector (between steps) ── */}
                  {i < data.steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute lg:hidden"
                      style={{
                        left: '1.5rem',       /* centre of h-12 pill (w-12 → left edge + 24px = 1.5rem) */
                        top: '3rem',          /* just below the pill */
                        bottom: '0',
                        width: '1px',
                        background: 'linear-gradient(to bottom, #c7d2fe, transparent)',
                      }}
                    />
                  )}

                  {/* ── Step pill — the single ordinal element ── */}
                  <div className="relative z-10 mb-6 lg:mb-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-2 ring-indigo-200 shadow-sm transition-all duration-300 group-hover:ring-indigo-500 group-hover:shadow-md group-hover:shadow-indigo-100">
                      <span className="text-sm font-bold tabular-nums text-indigo-600 group-hover:text-indigo-700 leading-none">
                        {num}
                      </span>
                    </div>
                  </div>

                  {/* ── Content ── */}
                  <div className="pl-16 lg:pl-0 lg:mt-8 lg:px-4 -mt-12 lg:-mt-0 pb-10 lg:pb-0">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors duration-200">
                      {s.title}
                    </h3>
                    <div className="my-2.5 h-px w-6 bg-indigo-300 lg:mx-auto transition-all duration-300 group-hover:w-10 group-hover:bg-indigo-500" />
                    <p className="text-sm leading-relaxed text-slate-500 lg:max-w-[200px]">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

