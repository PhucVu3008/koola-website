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
 * Clean typographic timeline layout. Steps are presented with large muted
 * ordinal numbers as visual anchors, a connecting rule on desktop, and
 * a vertical connector on mobile. No icon boxes — typography carries the design.
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

        {/* Timeline */}
        <div ref={ref} className="relative">

          {/* ── Desktop: horizontal connector ─────────────────────── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[2.75rem] hidden lg:block"
            style={{ left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, #c7d2fe 15%, #c7d2fe 85%, transparent)' }}
          />

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
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
                  {/* ── Mobile: vertical connector ───────────────── */}
                  {i < data.steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-[1.45rem] top-[5.5rem] h-full w-px lg:hidden"
                      style={{ background: 'linear-gradient(to bottom, #c7d2fe, transparent)' }}
                    />
                  )}

                  {/* Step marker — number pill */}
                  <div className="relative z-10 flex items-center gap-5 lg:flex-col lg:gap-0">
                    <div className="flex-shrink-0">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-2 ring-indigo-200 transition-all duration-300 group-hover:ring-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-100 lg:h-12 lg:w-12"
                      >
                        <span className="text-xs font-black tabular-nums text-indigo-600 group-hover:text-indigo-700">
                          {num}
                        </span>
                      </div>
                    </div>

                    {/* Content block */}
                    <div className="pb-10 lg:pb-0 lg:mt-7 lg:px-3">
                      {/* Large muted number — decorative */}
                      <div
                        aria-hidden="true"
                        className="mb-1 select-none text-[3rem] font-black leading-none tabular-nums text-slate-100 lg:mb-2 lg:text-[3.5rem]"
                      >
                        {num}
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors duration-200">
                        {s.title}
                      </h3>
                      <div className="my-2 h-[2px] w-6 bg-indigo-400 lg:mx-auto transition-all duration-300 group-hover:w-10" />
                      <p className="text-sm leading-relaxed text-slate-500 lg:max-w-[180px]">
                        {s.description}
                      </p>
                    </div>
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

