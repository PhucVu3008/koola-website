'use client';

import Image from 'next/image';
import { useScrollAnimation, useStaggeredAnimation } from '../../src/hooks/useScrollAnimation';

export type CultureBullet = {
  title: string;
  body: string;
};

export type CultureValuesSectionData = {
  title: string;
  bullets: CultureBullet[];
  imageUrl: string;
  imageAlt: string;
};

/**
 * Culture / Values Section
 * Two-column: bullet list left, image right
 */
export function CultureValuesSection({ data }: { data: CultureValuesSectionData }) {
  const [sectionRef, isSectionVisible] = useScrollAnimation<HTMLElement>();
  const [imageRef, isImageVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section 
      ref={sectionRef}
      className={`mx-auto max-w-6xl py-16 px-8 transition-all duration-700 ${
        isSectionVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
    >
      <div className="grid grid-cols-2 items-start gap-16">
        {/* Left: Title + Bullets */}
        <div>
          <h2 className="mb-8 text-2xl font-semibold text-slate-900">
            {data.title}
          </h2>

          <div className="space-y-6">
            {data.bullets.map((bullet, idx) => {
              // Staggered animation for each bullet
              const [bulletRef, isBulletVisible, delay] = useStaggeredAnimation<HTMLDivElement>(idx, 0.2, 0.15);
              
              return (
                <div 
                  key={idx}
                  ref={bulletRef}
                  className={`flex gap-3 transition-all duration-700 ${
                    isBulletVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ 
                    animationDelay: isBulletVisible ? `${delay}s` : undefined,
                    animationFillMode: 'both'
                  }}
                >
                {/* Decorative Emoji/Icon */}
                <div className="mt-0.5 flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-sm">
                    {idx === 0 && '1'}
                    {idx === 1 && '2'}
                    {idx === 2 && '3'}
                    {idx === 3 && '4'}
                    {idx === 4 && '5'}
                    {idx > 4 && '6'}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">{bullet.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {bullet.body}
                  </p>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Right: Image */}
        <div 
          ref={imageRef}
          className={`relative transition-all duration-700 ${
            isImageVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ 
            animationDelay: isImageVisible ? '0.3s' : undefined,
            animationFillMode: 'both'
          }}
        >
          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src={data.imageUrl}
              alt={data.imageAlt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
