'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { InteractiveButton } from '../ui/InteractiveButton';

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
 */
export function HeroSection({ data }: { data: HeroSectionData }) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative flex h-[420px] w-full items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* LAYER 0: Background Gradient Base - MOUSE TRACKING */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(30, 41, 59, 0.7) 0%, 
            rgba(15, 23, 42, 0.85) 30%,
            rgba(2, 6, 23, 0.95) 60%,
            rgba(0, 0, 0, 1) 100%)`,
        }}
      />

      {/* LAYER 1: AVIF Background Image - MOUSE TRACKING */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-[1]">
          <Image
            src={data.backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Dynamic overlay following mouse - ONLY on AVIF */}
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

      {/* Animated Rainbow Gradient Orbs - Auto Float */}
      <div className="absolute inset-0 z-10 overflow-visible pointer-events-none">
        {/* Large Blue→Purple Orb - Top Left */}
        <div 
          className="absolute left-[-5%] top-[-5%] h-[500px] w-[500px] animate-[float_20s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-blue-400/50 via-purple-500/35 to-transparent blur-3xl"
        />
        
        {/* Medium Purple→Pink Orb - Top Right */}
        <div 
          className="absolute right-[-8%] top-[5%] h-[400px] w-[400px] animate-[float_25s_ease-in-out_infinite_3s] rounded-full bg-gradient-to-br from-purple-400/45 via-pink-400/30 to-transparent blur-3xl"
        />
        
        {/* Small Cyan→Orange Orb - Bottom */}
        <div 
          className="absolute bottom-[5%] left-[25%] h-[350px] w-[350px] animate-[float_18s_ease-in-out_infinite_5s] rounded-full bg-gradient-to-br from-cyan-400/50 via-orange-400/35 to-transparent blur-3xl"
        />
        
        {/* DNA Helix Effect - Two rotating gradients */}
        <div 
          className="absolute left-1/4 top-1/4 h-[600px] w-2 animate-[spin_30s_linear_infinite] bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"
        />
        <div 
          className="absolute right-1/4 top-1/4 h-[600px] w-2 animate-[spin_30s_linear_infinite_reverse] bg-gradient-to-b from-transparent via-pink-300/20 to-transparent"
        />

        {/* Interactive Star Particles - 8 stars with different colors */}
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
        <div 
          className="absolute right-[10%] top-[40%] h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]"
          style={{ animationDelay: '1.5s' }}
        />
        
        {/* Bottom layer stars */}
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

        {/* Radial glow - static rainbow effect */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15)_0%,rgba(168,85,247,0.1)_25%,rgba(244,114,182,0.08)_50%,transparent_70%)] opacity-20"
        />
        
        {/* Gradient Overlay - lighter to let effects show */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-50/5" />
      </div>

      {/* Centered Content - Modern Professional Layout */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 text-center">
        {/* Label Badge */}
        <div className={`inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 backdrop-blur-sm transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-blue-300">
            {data.label}
          </span>
        </div>
        
        {/* Main Headline - Brand + Tagline Combined */}
        <div className={`mt-8 transition-all duration-1000 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              {data.headline[0]}
            </span>
            <br />
            <span className="mt-2 block text-4xl font-light text-slate-200 md:text-5xl lg:text-6xl">
              {data.headline.slice(1).join(' ')}
            </span>
          </h1>
        </div>
        
        {/* Mission Statement with Icon */}
        <div className={`mx-auto mt-6 flex max-w-2xl items-center justify-center gap-3 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/50" />
          <p className="text-base font-light leading-relaxed text-slate-300 md:text-lg">
            {data.subhead}
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/50" />
        </div>

        {/* CTA Buttons - Enhanced Style */}
        <div className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <InteractiveButton href={data.primaryCta.href} variant="primary">
            {data.primaryCta.label}
          </InteractiveButton>
          <InteractiveButton href={data.secondaryCta.href} variant="secondary">
            {data.secondaryCta.label}
          </InteractiveButton>
        </div>

        {/* Trust Indicator */}
        <div className={`mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 transition-all duration-1000 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Trusted by 500+ leading organizations worldwide</span>
        </div>
      </div>
    </div>
  );
}
