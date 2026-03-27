'use client';

import { useEffect, useRef, useState, type JSX } from 'react';

export type MissionValuesData = {
  title: string;
  subtitle: string;
  values: Array<{ icon: string; title: string; description: string }>;
};

const iconMap: Record<string, JSX.Element> = {
  lightbulb: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 17a1 1 0 0 1-1 1H6l-4-4 2.5-2.5L7 14" />
      <path d="M13 17a1 1 0 0 0 1 1h4l4-4-2.5-2.5L17 14" />
      <path d="m8 8 4-4 4 4" />
      <path d="M12 4v9" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

function ValueCard({
  value,
  index,
  visible,
}: {
  value: { icon: string; title: string; description: string };
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms, box-shadow 0.3s, border-color 0.3s, background-color 0.3s`,
      }}
    >
      {/* Hover gradient overlay */}
      <div aria-hidden="true" className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-violet-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-900/40 transition-transform duration-300 group-hover:scale-110">
          {iconMap[value.icon] ?? iconMap.lightbulb}
        </div>

        {/* Content */}
        <h3 className="mt-5 text-base font-semibold text-white">{value.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{value.description}</p>
      </div>

      {/* Corner dot decoration */}
      <div aria-hidden="true" className="absolute bottom-4 right-4 h-1.5 w-1.5 rounded-full bg-indigo-500/40 group-hover:bg-indigo-400/70 transition-colors" />
    </div>
  );
}

/**
 * Section 3: Mission & Core Values — glassmorphism cards on dark gradient background.
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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-20 sm:py-28">
      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Background orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse-glow" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-violet-600/15 blur-[80px] animate-[pulseGlow_9s_ease-in-out_infinite_3s]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-indigo-500" />
            Our Values
            <span aria-hidden="true" className="inline-block h-px w-8 bg-indigo-500" />
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white">{data.title}</h2>
          <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto">{data.subtitle}</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {data.values.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
