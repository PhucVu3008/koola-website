/**
 * RelatedContent Component
 *
 * Section with:
 * - Section title "Related"
 * - Three-column grid of related cards
 * - Each card: image, title, excerpt, "more →" link
 *
 * Matches reference image exactly.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export type RelatedContentItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  type: 'service' | 'post';
};

export type RelatedContentData = {
  title: string;
  items: RelatedContentItem[];
};

export function RelatedContent({ data, locale }: { data: RelatedContentData; locale: string }) {
  return (
    <section className="bg-white py-24">
      <div className="container px-6">
        {/* Section Title - Enhanced */}
        <h2 className="mb-16 text-4xl font-bold text-slate-900">{data.title}</h2>

        {/* Related Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {data.items.map((item, index) => (
            <RelatedCard key={item.id} item={item} locale={locale} delay={index * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCard({
  item,
  locale,
  delay,
}: {
  item: RelatedContentItem;
  locale: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const href = item.type === 'service' ? `/${locale}/services/${item.slug}` : `/${locale}/blog/${item.slug}`;

  return (
    <div
      ref={ref}
      className={`group overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-700 hover:border-emerald-500 hover:shadow-2xl hover:scale-105 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-7">
        <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
          {item.title}
        </h3>
        <p className="mb-5 line-clamp-2 text-slate-600">{item.excerpt}</p>

        {/* More Link */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-all hover:gap-4"
        >
          <span>more</span>
          <ArrowRight
            className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          />
        </Link>
      </div>
    </div>
  );
}
