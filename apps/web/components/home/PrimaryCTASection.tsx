'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '../ui/Button';

export type PrimaryCTASectionData = {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref?: string;
  image: string;
};

/**
 * Final primary CTA section with unique animations.
 * - Floating title animation
 * - Pulse + ripple effect on button
 * - Image blend with background using opacity and blend modes
 */
export function PrimaryCTASection({ data }: { data: PrimaryCTASectionData }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl text-center">
        {/* Title with floating animation */}
        <h2 className="animate-float text-3xl font-semibold leading-tight text-white">
          {data.title}
        </h2>
        
        {data.subtitle && (
          <p className="mt-6 text-base leading-relaxed text-white/90 transition-all duration-500 hover:text-white">
            {data.subtitle}
          </p>
        )}
        
        {/* Button with pulse + ripple effect */}
        <div className="mt-8 flex justify-center">
          <div className="relative">
            {/* Ripple rings */}
            {isHovered && (
              <>
                <div className="absolute inset-0 animate-ping rounded-full bg-white/30 opacity-75" 
                     style={{ animationDuration: '1.5s' }} />
                <div className="absolute inset-0 animate-ping rounded-full bg-white/20 opacity-50" 
                     style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
              </>
            )}
            
            <Button 
              href={data.ctaHref || '/contact'} 
              variant="primary"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-blue-600 shadow-lg shadow-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/95 hover:shadow-xl hover:shadow-white/30"
            >
              <span className="relative z-10">{data.ctaLabel}</span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Image with blend effect to harmonize with background */}
      <div className="mt-12 flex justify-center">
        <div className="group relative w-full max-w-4xl overflow-hidden rounded-[42px] bg-gradient-to-br from-white/5 to-white/10 p-1 backdrop-blur-sm">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          <div className="relative overflow-hidden rounded-[40px]">
            <Image
              src={data.image}
              alt="Team collaboration"
              width={980}
              height={420}
              className="h-[320px] w-full object-cover opacity-90 mix-blend-luminosity transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:mix-blend-normal"
            />
            
            {/* Overlay gradient to blend with background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
