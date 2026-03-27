'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export type OurStorySectionData = {
  label: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/**
 * Section 2: Our Story — timeline layout with tech corner brackets on image.
 */
export function OurStorySection({ data }: { data: OurStorySectionData }) {
  const { ref, visible } = useReveal();

  return (
    <section ref={ref} className="bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-start">

          {/* Left: Story timeline */}
          <div className={visible ? 'animate-slide-in-left' : 'opacity-0'}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-indigo-400" />
              {data.label}
            </span>

            <div className="mt-8 space-y-0">
              {data.paragraphs.map((p, i) => (
                <div key={i} className="relative flex gap-5 pb-8 last:pb-0">
                  {/* Vertical connector */}
                  {i < data.paragraphs.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-indigo-300 to-indigo-50"
                    />
                  )}
                  {/* Step dot */}
                  <div className="relative mt-1 flex-shrink-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-all ${
                        i === 0
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-200'
                          : 'border-2 border-indigo-200 bg-white text-indigo-600'
                      }`}
                    >
                      {i + 1}
                    </div>
                  </div>
                  {/* Paragraph */}
                  <div className="pt-1">
                    <p className="text-base leading-7 text-slate-600">{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image with tech frame */}
          <div className={`flex justify-center lg:justify-end ${visible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="relative group">
              {/* Corner brackets */}
              <div aria-hidden="true" className="absolute -top-4 -left-4 h-14 w-14 border-t-2 border-l-2 border-indigo-400/60 rounded-tl-sm transition-all duration-500 group-hover:border-indigo-500" />
              <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-14 w-14 border-b-2 border-r-2 border-indigo-400/60 rounded-br-sm transition-all duration-500 group-hover:border-indigo-500" />

              {/* Shadow halo */}
              <div aria-hidden="true" className="absolute inset-0 rounded-xl bg-indigo-500/10 blur-2xl scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-[380px] w-full max-w-[440px] lg:w-[440px] overflow-hidden rounded-xl shadow-xl">
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  quality={85}
                />
                {/* Subtle gradient overlay */}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
