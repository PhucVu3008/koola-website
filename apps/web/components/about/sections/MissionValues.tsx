'use client';

import { useEffect, useRef, useState } from 'react';

export type MissionValuesData = {
  title: string;
  subtitle: string;
  values: Array<{ icon: string; title: string; description: string }>;
};

const ACCENT_COLORS = [
  { line: '#6366f1', num: 'rgba(99,102,241,0.12)' },
  { line: '#8b5cf6', num: 'rgba(139,92,246,0.12)' },
  { line: '#06b6d4', num: 'rgba(6,182,212,0.12)'  },
  { line: '#10b981', num: 'rgba(16,185,129,0.12)' },
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
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const num = String(index + 1).padStart(2, '0');

  return (
    <article
      className="group relative overflow-hidden rounded-xl bg-slate-900/60 p-7 ring-1 ring-white/8 transition-all duration-300 hover:ring-white/20 hover:bg-slate-900/80"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 110}ms, transform 0.55s ease ${index * 110}ms`,
        borderTop: `2px solid ${accent.line}`,
      }}
    >
      {/* Large muted number — decorative background accent */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-3 select-none font-black leading-none tracking-tight"
        style={{
          fontSize: '5rem',
          color: accent.num,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {num}
      </span>

      {/* Small label */}
      <span
        className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: accent.line }}
      >
        {num}
      </span>

      {/* Title */}
      <h3 className="text-base font-semibold leading-snug text-white group-hover:text-white/90">
        {value.title}
      </h3>

      {/* Thin rule */}
      <div
        className="my-3 h-px w-8 transition-all duration-300 group-hover:w-14"
        style={{ background: accent.line, opacity: 0.6 }}
      />

      {/* Description */}
      <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
        {value.description}
      </p>
    </article>
  );
}

/**
 * Section 3: Mission & Core Values
 *
 * Editorial numbered card grid — accent top-border, large muted numeral as background
 * texture, no generic icon boxes. Each value gets its own accent colour drawn from a
 * four-colour palette (indigo → purple → cyan → emerald).
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
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      {/* Soft glow orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[80px]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-400">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-indigo-500" />
            Core Values
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">{data.subtitle}</p>
        </div>

        {/* Cards grid — 2 cols on sm+, 4 on lg */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.values.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

