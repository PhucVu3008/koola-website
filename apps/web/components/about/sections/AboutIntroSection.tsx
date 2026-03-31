import Image from 'next/image';

export type AboutIntroSectionData = {
  label: string;
  headline: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

/**
 * About Hero Section — full-bleed, extends behind the transparent header.
 *
 * Features:
 * - Negative top margin to sit behind the fixed header (same pattern as other hero sections)
 * - Organic morphing bubble background: large blobs that continuously change shape and drift
 * - Two-column layout (text left, image right) on large screens; stacked on mobile
 * - data-header-theme="dark" causes the SiteHeader to render in light (white) text mode
 */
export function AboutIntroSection({ data }: { data: AboutIntroSectionData }) {
  return (
    <section
      className="relative overflow-hidden bg-slate-950 -mt-[clamp(3.5rem,8vh,4.5rem)] pt-[clamp(3.5rem,8vh,4.5rem)]"
      data-header-theme="dark"
    >
      {/* ── Morphing Bubble Background ─────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blob 1 — large indigo/violet, top-left */}
        <div
          className="absolute -top-32 -left-32 h-[520px] w-[520px] animate-morph-blob animate-drift-1 bg-indigo-600/25 blur-[80px]"
        />
        {/* Blob 2 — purple/fuchsia, top-right */}
        <div
          className="absolute -top-20 right-[-10%] h-[420px] w-[420px] animate-morph-blob-2 animate-drift-2 bg-violet-500/20 blur-[90px]"
          style={{ animationDelay: '3s, 3s' }}
        />
        {/* Blob 3 — cyan/teal, bottom-left */}
        <div
          className="absolute bottom-[-10%] left-[10%] h-[380px] w-[380px] animate-morph-blob-3 animate-drift-3 bg-cyan-600/15 blur-[100px]"
          style={{ animationDelay: '6s, 6s' }}
        />
        {/* Blob 4 — small blue, centre-right — adds depth */}
        <div
          className="absolute top-[40%] right-[20%] h-[260px] w-[260px] animate-morph-blob animate-drift-1 bg-blue-500/15 blur-[70px]"
          style={{ animationDelay: '1.5s, 9s' }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8 lg:py-32">
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

            <div className="mt-6 space-y-4 border-l-2 border-indigo-700 pl-5">
              {data.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-7 text-slate-400">{p}</p>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[500px]">
              {/* Corner accents */}
              <div aria-hidden="true" className="absolute -top-3 -left-3 h-12 w-12 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-sm" />
              <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-12 w-12 border-b-2 border-r-2 border-indigo-500/50 rounded-br-sm" />

              <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/5">
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

      {/* Soft fade to next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent"
      />
    </section>
  );
}

