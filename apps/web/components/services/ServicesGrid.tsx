'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

export type ServiceGridItem = {
  id: number;
  slug: string;
  title: string;
  imageUrl: string;
  order: number;
};

export type ServicesGridData = {
  title: string;
  items: ServiceGridItem[];
};

/**
 * Services Masonry Grid
 *
 * Fully fluid layout — fills available width at every breakpoint.
 * Mobile: 1 col | Tablet: 2 cols | Desktop: 3 cols | Wide (≥1280px): 3 cols, taller cards
 * No outer container — parent (fluid-container in HomePage) controls the max-width.
 */
export function ServicesGrid({ data, locale }: { data: ServicesGridData; locale: string }) {
  return (
    <section className="bg-white">
      {/* Section Title */}
      <div className="mb-8 sm:mb-10 lg:mb-12">
        <h2 className="inline-flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900">
          <span className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex-shrink-0" />
          {data.title}
        </h2>
      </div>

      {/* Fluid Grid: expands to fill available width.
          col height scales with viewport via aspect-ratio so cards are always proportional. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {data.items.map((item, index) => (
          <ServiceCard key={item.id} item={item} order={index + 1} locale={locale} delay={index * 100} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  item,
  order,
  locale,
  delay,
}: {
  item: ServiceGridItem;
  order: number;
  locale: string;
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      href={`/${locale}/services/${item.slug}`}
      className="group relative block h-[220px] sm:h-[280px] lg:h-[320px] xl:h-[360px] 2xl:h-[400px] overflow-hidden rounded-xl sm:rounded-2xl shadow-lg transition-all duration-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent" />
        
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-brand-600/20 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6">
        {/* Order Number */}
        <div className={`text-sm sm:text-base font-bold transition-all duration-300 ${
          isHovered ? 'text-white' : 'text-white/50'
        }`}>
          {String(order).padStart(2, '0')}
        </div>

        {/* Title */}
        <div className="space-y-1.5 sm:space-y-2">
          <h3
            className={`text-base sm:text-xl font-semibold leading-tight text-white transition-all duration-300 ${
              isHovered ? 'translate-y-[-8px]' : 'translate-y-0'
            }`}
          >
            {item.title}
          </h3>
          
          {/* Underline on hover */}
          <div
            className={`h-0.5 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 ${
              isHovered ? 'w-12 sm:w-16 opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>
      </div>

      {/* Border glow on hover */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isHovered ? 'ring-2 ring-emerald-400/50 ring-offset-0' : ''
        }`}
      />
    </Link>
  );
}
