'use client';

import { useEffect, useRef, useState } from 'react';

export type WorkProcessData = {
  title: string;
  subtitle: string;
  steps: Array<{ step: number; title: string; description: string }>;
};

const STEP_ICONS = [
  // Discovery
  <svg key="discovery" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>,
  // Design / Blueprint
  <svg key="design" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>,
  // Build / Code
  <svg key="build" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>,
  // Launch / Rocket
  <svg key="launch" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>,
];

/**
 * Section 4: Work Process — modern connected steps with scroll-reveal animation.
 */
export function WorkProcess({ data }: { data: WorkProcessData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-slate-50 py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-indigo-400" />
            How We Work
            <span aria-hidden="true" className="inline-block h-px w-8 bg-indigo-400" />
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">{data.title}</h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">{data.subtitle}</p>
        </div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Horizontal connector line (desktop only) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgb(199,210,254) 10%, rgb(199,210,254) 90%, transparent 100%)',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {data.steps.map((s, i) => (
              <div
                key={s.step}
                className="relative flex flex-col items-center text-center group"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(32px)',
                  transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`,
                }}
              >
                {/* Step circle */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg shadow-indigo-100/60 border border-indigo-100 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-indigo-200/60 group-hover:border-indigo-300">
                  {/* Inner gradient ring on hover */}
                  <div aria-hidden="true" className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex flex-col items-center transition-colors duration-300">
                    <span className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                      {STEP_ICONS[i] ?? (
                        <span className="text-xl font-bold">{s.step}</span>
                      )}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-400 group-hover:text-indigo-200 transition-colors duration-300 mt-0.5">
                      0{s.step}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-5 font-semibold text-slate-900 text-base">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-[200px]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
