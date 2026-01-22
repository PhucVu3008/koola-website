/**
 * KeyBenefits Component
 *
 * Section with:
 * - Centered title + subtitle
 * - Three-column grid of benefit items
 * - Each item: dynamic icon + title + description
 *
 * Enhanced with scroll animations and hover effects.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';

export type KeyBenefitItem = {
  title: string;
  description: string;
  icon?: string; // Lucide icon name
};

export type KeyBenefitsData = {
  title: string;
  subtitle: string;
  items: KeyBenefitItem[];
};

export function KeyBenefits({ data }: { data: KeyBenefitsData }) {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="container px-6">
        {/* Section Header - Enhanced */}
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 lg:text-5xl">{data.title}</h2>
          {data.subtitle && (
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-600">{data.subtitle}</p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {data.items.map((item, index) => (
            <BenefitCard key={index} item={item} delay={index * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ item, delay }: { item: KeyBenefitItem; delay: number }) {
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

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-lg transition-all duration-700 hover:border-emerald-500 hover:shadow-2xl hover:scale-105 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      {/* Gradient accent on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-blue-50 opacity-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : ''
        }`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Dynamic Icon */}
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
          {(() => {
            const iconName = item.icon || 'Zap';
            const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Zap;
            return <IconComponent className="h-7 w-7 text-white" strokeWidth={2.5} />;
          })()}
        </div>

        <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600">
          {item.title}
        </h3>
        <p className="leading-relaxed text-slate-600">{item.description}</p>
      </div>
    </div>
  );
}
