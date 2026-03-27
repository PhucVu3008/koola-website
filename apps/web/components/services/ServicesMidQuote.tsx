'use client';

import Image from 'next/image';
import { useScrollReveal } from '../../src/lib/ui/useScrollReveal';

export type ServicesMidQuoteData = {
  imageUrl: string;
  headline: string;
  paragraph: string;
};

/**
 * Services Mid-page Quote Section
 * Two-column layout with scroll-reveal slide-in from both sides.
 */
export function ServicesMidQuote({ data }: { data: ServicesMidQuoteData }) {
  const { ref, visible } = useScrollReveal(0.15);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="bg-slate-50 py-12 sm:py-16 lg:py-24">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">

          {/* Left: Image — slide in from left */}
          <div
            className="relative min-w-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="absolute left-0 top-0 z-20 hidden sm:grid grid-cols-3 gap-2 -translate-x-6 -translate-y-6">
              {['bg-indigo-500','bg-violet-500','bg-blue-500','bg-indigo-400','bg-violet-400','bg-blue-400'].map((cls, i) => (
                <div key={i} className={`h-4 w-4 animate-pulse rounded-sm ${cls}`} style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>

            <div className="relative aspect-[4/3] sm:aspect-auto sm:h-[360px] lg:h-[480px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
              <Image
                src={data.imageUrl}
                alt="Team collaboration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-500/20 blur-2xl" />
          </div>

          {/* Right: Quote Block — slide in from right */}
          <div
            className="relative min-w-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
            }}
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-indigo-500/30 bg-white p-5 sm:p-8 lg:p-12 shadow-lg">
              <div className="absolute left-0 top-0 h-16 w-16 sm:h-20 sm:w-20 rounded-tl-2xl sm:rounded-tl-3xl border-l-4 border-t-4 border-indigo-500/40" />

              <blockquote className="space-y-3 sm:space-y-6">
                <p className="break-words text-base sm:text-xl lg:text-2xl font-semibold leading-snug text-slate-900">
                  {data.headline}
                </p>
                <p className="break-words text-sm leading-relaxed text-slate-600">
                  {data.paragraph}
                </p>
              </blockquote>

              <div className="absolute bottom-0 right-0 h-16 w-16 sm:h-20 sm:w-20 rounded-br-2xl sm:rounded-br-3xl border-b-4 border-r-4 border-indigo-500/40" />
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
