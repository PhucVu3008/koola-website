'use client';

import { useState } from 'react';
import Image from 'next/image';

import { InteractiveButton } from '../ui/InteractiveButton';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';

export type HeroSectionData = {
  label: string;
  headline: readonly string[];
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: { src: string; alt: string };
  backgroundImage?: string;
  overlayImage?: string; // Static PNG overlay (no mouse tracking)
};

/**
 * Home hero section with animated rainbow gradient particles,
 * DNA helix effect, and mouse-interactive stars.
 * Full-width background design with centered content.
 * 
 * Mobile Optimizations:
 * - Reduced particle effects on mobile for better performance
 * - Simplified animations on small screens
 * - Larger touch targets for CTAs (52px height)
 * - Responsive height using fluid-h-hero
 */
export function HeroSection({ data }: { data: HeroSectionData }) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const { isMobile, isMobileOrTablet } = useMediaQuery();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable mouse tracking on mobile for performance
    if (isMobileOrTablet) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative flex w-full items-center justify-center overflow-hidden fluid-h-hero"
      onMouseMove={handleMouseMove}
    >
      {/* LAYER 0: Background Gradient Base - MOUSE TRACKING (desktop only) */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: isMobileOrTablet 
            ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(2, 6, 23, 0.95) 100%)'
            : `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(30, 41, 59, 0.7) 0%, 
                rgba(15, 23, 42, 0.85) 30%,
                rgba(2, 6, 23, 0.95) 60%,
                rgba(0, 0, 0, 1) 100%)`,
        }}
      />

      {/* LAYER 1: AVIF Background Image - MOUSE TRACKING (desktop only) */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-[1]">
          <Image
            src={data.backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={isMobile ? 75 : 90}
            sizes="100vw"
          />
          {/* Dynamic overlay following mouse - ONLY on desktop */}
          {!isMobileOrTablet && (
            <div 
              className="absolute inset-0 transition-all duration-1000"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                  rgba(59, 130, 246, 0.5) 0%, 
                  rgba(147, 51, 234, 0.35) 25%,
                  rgba(236, 72, 153, 0.25) 50%,
                  transparent 70%)`,
              }}
            />
          )}
          {/* Static overlay on mobile for performance */}
          {isMobileOrTablet && (
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/15 to-transparent" />
          )}
        </div>
      )}

      {/* LAYER 2: PNG Overlay Image - STATIC (NO MOUSE TRACKING) */}
      {data.overlayImage && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <Image
            src={data.overlayImage}
            alt="Hero overlay"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
      )}

      {/* Animated Rainbow Gradient Orbs - Reduced on mobile */}
      <div className="absolute inset-0 z-10 overflow-visible pointer-events-none">
        {/* Large Blue→Purple Orb - Top Left */}
        <div 
          className={`absolute left-[-5%] top-[-5%] rounded-full bg-gradient-to-br from-blue-400/50 via-purple-500/35 to-transparent blur-3xl ${isMobileOrTablet ? '' : 'animate-[float_20s_ease-in-out_infinite]'}`}
          style={{ 
            height: isMobile ? '300px' : '500px',
            width: isMobile ? '300px' : '500px',
          }}
        />
        
        {/* Medium Purple→Pink Orb - Top Right */}
        <div 
          className={`absolute right-[-8%] top-[5%] rounded-full bg-gradient-to-br from-purple-400/45 via-pink-400/30 to-transparent blur-3xl ${isMobileOrTablet ? '' : 'animate-[float_25s_ease-in-out_infinite_3s]'}`}
          style={{ 
            height: isMobile ? '250px' : '400px',
            width: isMobile ? '250px' : '400px',
          }}
        />
        
        {/* Small Cyan→Orange Orb - Bottom (desktop only) */}
        {!isMobile && (
          <div 
            className="absolute bottom-[5%] left-[25%] h-[350px] w-[350px] animate-[float_18s_ease-in-out_infinite_5s] rounded-full bg-gradient-to-br from-cyan-400/50 via-orange-400/35 to-transparent blur-3xl"
          />
        )}
        
        {/* DNA Helix Effect - Desktop only for performance */}
        {!isMobileOrTablet && (
          <>
            <div 
              className="absolute left-1/4 top-1/4 h-[600px] w-2 animate-[spin_30s_linear_infinite] bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"
            />
            <div 
              className="absolute right-1/4 top-1/4 h-[600px] w-2 animate-[spin_30s_linear_infinite_reverse] bg-gradient-to-b from-transparent via-pink-300/20 to-transparent"
            />
          </>
        )}

        {/* Interactive Star Particles - Reduced count on mobile */}
        {/* Top layer stars */}
        <div 
          className="absolute left-[15%] top-[10%] h-1 w-1 animate-pulse rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
        <div 
          className="absolute left-[35%] top-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
          style={{ animationDelay: '0.5s' }}
        />
        <div 
          className="absolute right-[20%] top-[15%] h-1 w-1 animate-pulse rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.5)]"
          style={{ animationDelay: '1s' }}
        />
        
        {/* Bottom layer stars - Desktop only */}
        {!isMobile && (
          <>
            <div 
              className="absolute right-[10%] top-[40%] h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]"
              style={{ animationDelay: '1.5s' }}
            />
            <div 
              className="absolute bottom-[20%] left-[25%] h-1 w-1 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              style={{ animationDelay: '0.3s' }}
            />
            <div 
              className="absolute bottom-[35%] left-[45%] h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
              style={{ animationDelay: '0.8s' }}
            />
            <div 
              className="absolute bottom-[25%] right-[30%] h-1 w-1 animate-pulse rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]"
              style={{ animationDelay: '1.2s' }}
            />
            <div 
              className="absolute bottom-[10%] right-[15%] h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
              style={{ animationDelay: '1.8s' }}
            />
          </>
        )}

        {/* Radial glow - static rainbow effect */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15)_0%,rgba(168,85,247,0.1)_25%,rgba(244,114,182,0.08)_50%,transparent_70%)] opacity-20"
        />
        
        {/* Gradient Overlay - lighter to let effects show */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-50/5" />
      </div>

      {/* Centered Content - Modern Professional Layout - Truly Fluid */}
      <div className="relative z-20 fluid-container-wide text-center">
        {/* Label Badge - Fluid sizing */}
        <div 
          className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm"
          style={{ gap: 'clamp(0.375rem, 1vw, 0.5rem)', padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.75rem, 2vw, 1rem)' }}
        >
          <div 
            className="animate-pulse rounded-full bg-blue-400" 
            style={{ width: 'clamp(0.25rem, 0.8vw, 0.375rem)', height: 'clamp(0.25rem, 0.8vw, 0.375rem)' }}
          />
          <span className="font-medium uppercase tracking-wider text-blue-300 fluid-text-xs">
            {data.label}
          </span>
        </div>
        
        {/* Main Headline - Truly Fluid Typography */}
        <div
          style={{ marginTop: 'clamp(1.5rem, 3vh, 2rem)' }}
        >
          <h1
            className="font-bold text-white"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              {data.headline[0]}
            </span>
            <br />
            <span
              className="block font-light text-slate-200"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 4rem)',
                marginTop: 'clamp(0.25rem, 1vh, 0.5rem)'
              }}
            >
              {data.headline.slice(1).join(' ')}
            </span>
          </h1>
        </div>
        
        {/* Mission Statement with Icon - Fluid padding */}
        <div 
          className="mx-auto flex max-w-2xl items-center justify-center"
          style={{ 
            marginTop: 'clamp(1rem, 2.5vh, 1.5rem)', 
            gap: 'clamp(0.5rem, 2vw, 0.75rem)',
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          <div 
            className="h-px bg-gradient-to-r from-transparent to-blue-400/50" 
            style={{ width: 'clamp(2rem, 5vw, 3rem)' }}
          />
          <p
            className="font-light leading-relaxed text-slate-300"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
          >
            {data.subhead}
          </p>
          <div 
            className="h-px bg-gradient-to-l from-transparent to-blue-400/50" 
            style={{ width: 'clamp(2rem, 5vw, 3rem)' }}
          />
        </div>

        {/* CTA Buttons - Fluid spacing, stack on mobile */}
        <div 
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center"
          style={{ marginTop: 'clamp(1.5rem, 4vh, 2.5rem)', gap: 'clamp(0.75rem, 2vw, 1rem)' }}
        >
          <InteractiveButton href={data.primaryCta.href} variant="primary">
            {data.primaryCta.label}
          </InteractiveButton>
          <InteractiveButton href={data.secondaryCta.href} variant="secondary">
            {data.secondaryCta.label}
          </InteractiveButton>
        </div>

        {/* Trust Indicator - Fluid text, shorter on mobile */}
        <div 
          className="flex items-center justify-center text-slate-400"
          style={{ marginTop: 'clamp(1.25rem, 3vh, 2rem)', gap: 'clamp(0.375rem, 1vw, 0.5rem)' }}
        >
          <svg 
            className="text-blue-400 flex-shrink-0" 
            style={{ width: 'clamp(1rem, 2.5vw, 1.25rem)', height: 'clamp(1rem, 2.5vw, 1.25rem)' }}
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span 
            className="text-center"
            style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}
          >
            {isMobile ? 'Trusted by 500+ organizations' : 'Trusted by 500+ leading organizations worldwide'}
          </span>
        </div>
      </div>
    </div>
  );
}
