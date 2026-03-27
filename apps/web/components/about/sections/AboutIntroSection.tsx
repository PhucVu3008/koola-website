'use client';

import Image from 'next/image';

export type AboutIntroSectionData = {
  label: string;
  headline: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

/**
 * Section 1: About Hero — two-column layout with clean dark tech background.
 */
export function AboutIntroSection({ data }: { data: AboutIntroSectionData }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28 lg:py-32">
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '60px 60px',
        }}
      />
      {/* Single glow orb — subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full bg-indigo-800/20 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 items-center">

          {/* Left: Text */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-indigo-500" />
              {data.label}
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-tight text-white">
              {data.headline}
            </h1>

            <div className="mt-6 space-y-4 border-l-2 border-indigo-800 pl-5">
              {data.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-7 text-slate-400">{p}</p>
              ))}
            </div>
          </div>

          {/* Right: Image — clean frame */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[500px]">
              {/* Corner accents */}
              <div aria-hidden="true" className="absolute -top-3 -left-3 h-12 w-12 border-t-2 border-l-2 border-indigo-600/50 rounded-tl-sm" />
              <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-12 w-12 border-b-2 border-r-2 border-indigo-600/50 rounded-br-sm" />

              <div className="overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  width={500}
                  height={360}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  quality={85}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

