'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '../../src/hooks/useScrollAnimation';

export type PrideQuoteSlide = {
  quote: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
};

export type PrideQuoteSliderData = {
  title: string;
  slides: PrideQuoteSlide[];
};

/**
 * Pride Quote Slider Section
 * Full-width blue background with quote carousel
 */
export function PrideQuoteSlider({ data }: { data: PrideQuoteSliderData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionRef, isSectionVisible] = useScrollAnimation<HTMLElement>();

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === data.slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = data.slides[currentIndex];

  if (!currentSlide) return null;

  return (
    <section 
      ref={sectionRef}
      className={`bg-brand-600 py-16 transition-all duration-700 ${
        isSectionVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
    >
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid grid-cols-2 items-center gap-16">
          {/* Left: Title */}
          <div>
            <h2 className="whitespace-pre-line text-4xl font-bold text-white">
              {data.title}
            </h2>
          </div>

          {/* Right: Quote Card */}
          <div className="relative">
            <div className="rounded-2xl bg-white p-8 shadow-xl transition-all duration-500">
              {/* Quote */}
              <blockquote className="text-base leading-relaxed text-slate-700">
                "{currentSlide.quote}"
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                {currentSlide.authorAvatar ? (
                  <Image
                    src={currentSlide.authorAvatar}
                    alt={currentSlide.authorName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-200 to-brand-300" />
                )}
                <div>
                  <div className="font-semibold text-slate-900">
                    {currentSlide.authorName}
                  </div>
                  <div className="text-sm text-slate-500">
                    {currentSlide.authorRole}
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={goToPrevious}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-slate-400">Previous</span>

                <div className="mx-2 h-px flex-1 bg-slate-200" />

                <span className="text-sm text-slate-400">Next</span>
                <button
                  onClick={goToNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl bg-yellow-400 opacity-80" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-xl bg-pink-400 opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
