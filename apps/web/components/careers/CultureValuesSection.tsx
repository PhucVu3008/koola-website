'use client';

import Image from 'next/image';
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
  return (
    <section
      className="mx-auto max-w-6xl py-10 sm:py-16 px-4 sm:px-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 sm:gap-16">
        {/* Left: Title + Bullets */}
        <div>
          <h2 className="mb-8 text-2xl font-semibold text-slate-900">
            {data.title}
          </h2>

          <div className="space-y-6">
            {data.bullets.map((bullet, idx) => {
              return (
                <div
                  key={idx}
                  className="flex gap-3"
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
        <div className="relative">
          <div className="relative h-[240px] sm:h-[320px] lg:h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src={data.imageUrl}
              alt={data.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
