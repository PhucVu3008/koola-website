'use client';

import Image from 'next/image';

import { Button } from '../ui/Button';

export type TrustedLogosData = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref?: string;
  logos: ReadonlyArray<string>;
};

/**
 * Trusted logos strip with infinite scroll animation.
 * 
 * Logos scroll continuously from right to left in an endless loop.
 * Uses duplicate sets for seamless looping.
 */
export function TrustedLogos({ data }: { data: TrustedLogosData }) {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...data.logos, ...data.logos, ...data.logos];
  
  return (
    <div className="text-center">
      <div className="mb-8 text-base leading-relaxed text-slate-900">{data.title}</div>

      {/* Infinite scroll container */}
      <div className="relative overflow-hidden">
        {/* Gradient fade edges for smooth visual */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent" />
        
        {/* Scrolling logos track */}
        <div className="flex animate-infinite-scroll items-center gap-16 py-4">
          {duplicatedLogos.map((logo, idx) => (
            <div
              key={`${logo}-${idx}`}
              className="flex-shrink-0 transition-all duration-300 hover:scale-110"
            >
              <Image
                src={`/home/logos/${logo}.svg`}
                alt={logo}
                width={120}
                height={48}
                className="h-12 w-auto opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button href={data.ctaHref || '/contact'} variant="secondary" className="text-sm">
          {data.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
