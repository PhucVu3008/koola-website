'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export type AboutIntroSectionData = {
  label: string;
  headline: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

const STATS = [
  { value: 5,   suffix: '+', label: 'Years Experience' },
  { value: 100, suffix: '+', label: 'Projects Delivered' },
  { value: 50,  suffix: '+', label: 'Enterprise Clients' },
  { value: 20,  suffix: '+', label: 'Technologies' },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return count;
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1800, active);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center px-6 py-2">
      <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
        {count}<span className="text-indigo-400">{suffix}</span>
      </div>
      <div className="mt-1.5 text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-medium text-center">
        {label}
      </div>
    </div>
  );
}

/**
 * Section 1: About Hero — dark tech-themed full-width section with animated stats.
 */
export function AboutIntroSection({ data }: { data: AboutIntroSectionData }) {
  // Split headline: first half normal, second half gradient
  const words = data.headline.split(' ');
  const mid = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, mid).join(' ');
  const secondHalf = words.slice(mid).join(' ');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-20 sm:py-28 lg:py-32">
      {/* Tech grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Glowing orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-700/25 blur-[120px] animate-pulse-glow" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[100px] animate-[pulseGlow_8s_ease-in-out_infinite_2s]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-emerald-700/10 blur-[90px] animate-[pulseGlow_10s_ease-in-out_infinite_1s]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Two-column hero */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">

          {/* Left: Text */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
              {data.label}
            </span>

            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-white">{firstHalf} </span>
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                {secondHalf}
              </span>
            </h1>

            <div className="mt-6 space-y-4">
              {data.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-7 text-slate-400">{p}</p>
              ))}
            </div>

            {/* Tech accent line */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-indigo-500 to-transparent" />
              <span className="text-xs text-indigo-400 uppercase tracking-widest">KOOLA Technology</span>
            </div>
          </div>

          {/* Right: Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Outer glow ring */}
              <div aria-hidden="true" className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-indigo-500/40 to-violet-600/30 blur-xl" />
              {/* Border gradient */}
              <div aria-hidden="true" className="absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-500/60 to-violet-600/40" />

              <div className="relative h-[300px] w-full max-w-[440px] lg:h-[340px] lg:w-[440px] overflow-hidden rounded-3xl">
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  fill
                  className="object-cover"
                  priority
                  quality={85}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 rounded-xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">ISO Certified</span>
                </div>
                <div className="mt-0.5 text-xs text-slate-400">Quality Assured</div>
              </div>

              {/* Tech corner accent */}
              <div aria-hidden="true" className="absolute -top-3 -right-3 h-16 w-16 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-xl" />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 sm:mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 backdrop-blur-sm">
            {STATS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
