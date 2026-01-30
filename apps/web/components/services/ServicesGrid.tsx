'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

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
 * 2 rows x 3 columns grid of service cards.
 * Each card: large image, top-left number (01..06), title overlay bottom-left.
 */
export function ServicesGrid({ data, locale }: { data: ServicesGridData; locale: string }) {
  return (
    <section className="bg-white py-20">
      <div className="container">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="inline-flex items-center gap-3 text-2xl font-semibold text-slate-900">
            <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-500" />
            {data.title}
          </h2>
        </div>

        {/* Grid with stagger animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, index) => (
            <ServiceCard key={item.id} item={item} order={index + 1} locale={locale} delay={index * 100} />
          ))}
        </div>
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
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <Link
      ref={ref}
      href={`/${locale}/services/${item.slug}`}
      className={`group relative block h-[320px] overflow-hidden rounded-2xl shadow-lg transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
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
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        {/* Order Number */}
        <div className={`text-base font-bold transition-all duration-300 ${
          isHovered ? 'text-white' : 'text-white/50'
        }`}>
          {String(order).padStart(2, '0')}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h3
            className={`text-xl font-semibold leading-tight text-white transition-all duration-300 ${
              isHovered ? 'translate-y-[-8px]' : 'translate-y-0'
            }`}
          >
            {item.title}
          </h3>
          
          {/* Underline that appears on hover */}
          <div
            className={`h-0.5 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 ${
              isHovered ? 'w-16 opacity-100' : 'w-0 opacity-0'
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
