'use client';

import { useEffect, useRef, useState } from 'react';

export type MissionValuesData = {
  title: string;
  subtitle: string;
  values: Array<{ icon: string; title: string; description: string }>;
};

/** One accent colour per card — indigo, purple, cyan, emerald */
const ACCENTS = [
  { border: '#6366f1', rule: '#6366f1', label: 'rgba(99,102,241,0.15)'  },
  { border: '#8b5cf6', rule: '#8b5cf6', label: 'rgba(139,92,246,0.15)' },
  { border: '#06b6d4', rule: '#06b6d4', label: 'rgba(6,182,212,0.15)'   },
  { border: '#10b981', rule: '#10b981', label: 'rgba(16,185,129,0.15)'  },
];

function ValueCard({
  value,
  index,
  visible,
}: {
  value: { icon: string; title: string; description: string };
  index: number;
  visible: boolean;
}) {
  const a = ACCENTS[index % ACCENTS.length];

  return (
    <article
      className="group relative overflow-hidden rounded-xl bg-slate-900/60 px-6 py-7 ring-1 ring-white/8 transition-all duration-300 hover:ring-white/20 hover:bg-slate-900/80"
      style={{
        borderTop: `2px solid ${a.border}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 110}ms, transform 0.55s ease ${index * 110}ms`,
      }}
    >
      {/* Small coloured dot — only visual accent, no number */}
      <div
        aria-hidden="true"
        className="mb-5 h-2 w-2 rounded-full"
        style={{ background: a.border }}
      />

      <h3 className="text-base font-semibold leading-snug text-white">
        {value.title}
      </h3>

      {/* Thin rule that grows on hover */}
      <div
        className="my-3 h-px w-6 transition-all duration-300 group-hover:w-12"
        style={{ background: a.rule, opacity: 0.7 }}
      />

      <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
        {value.description}
      </p>
    </article>
  );
}

/**
 * Section 3: Mission & Core Values
 *
 * Accent-border cards with coloured dot marker and expanding rule on hover.
 * No numbers or icons — colour and typography carry the distinction.
 */
export function MissionValues({ data }: { data: MissionValuesData }) {
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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 py-20 sm:py-28">
      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[80px]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header — left-aligned */}
        <div className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-indigo-500" />
            Core Values
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">{data.subtitle}</p>
        </div>

        {/* 4-column grid on large screens */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.values.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}


