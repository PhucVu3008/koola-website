'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Contact Hero Section
 * 
 * Full-width hero with background image, animated floating icons,
 * mouse-interactive particles, and staggered text animations.
 */

export type ContactHeroData = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
};

export type ContactHeroSectionProps = {
  data: ContactHeroData;
};

export function ContactHeroSection({ data }: ContactHeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image with Overlay */}
      {data.backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={data.backgroundImage}
            alt="Contact hero background"
            fill
            className="object-cover opacity-20"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/80" />
        </div>
      )}

      {/* Animated Floating Icons with Mouse Interaction */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles that follow mouse subtly */}
        <div 
          className={`absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl transition-all duration-[3000ms] ${mounted ? 'translate-x-32 translate-y-32' : ''}`}
          style={{
            transform: `translate(${32 + (mousePosition.x - 50) / 10}px, ${32 + (mousePosition.y - 50) / 10}px)`,
          }}
        />
        <div 
          className={`absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-[4000ms] delay-300 ${mounted ? '-translate-x-32 -translate-y-32' : ''}`}
          style={{
            transform: `translate(${-32 + (mousePosition.x - 50) / 15}px, ${-32 + (mousePosition.y - 50) / 15}px)`,
          }}
        />
        
        {/* Floating particles that react to mouse position */}
        <div 
          className="absolute h-2 w-2 animate-float-slow rounded-full bg-blue-400/40 transition-all duration-500"
          style={{
            left: `calc(10% + ${(mousePosition.x - 50) / 8}px)`,
            top: `calc(20% + ${(mousePosition.y - 50) / 8}px)`,
          }}
        />
        <div 
          className="absolute h-3 w-3 animate-float-medium rounded-full bg-emerald-400/30 transition-all duration-700"
          style={{
            left: `calc(20% + ${(mousePosition.x - 50) / 12}px)`,
            top: `calc(40% + ${(mousePosition.y - 50) / 10}px)`,
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute h-2 w-2 animate-float-fast rounded-full bg-purple-400/40 transition-all duration-600"
          style={{
            right: `calc(15% - ${(mousePosition.x - 50) / 10}px)`,
            top: `calc(30% + ${(mousePosition.y - 50) / 12}px)`,
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute h-3 w-3 animate-float-slow rounded-full bg-blue-300/30 transition-all duration-800"
          style={{
            right: `calc(25% - ${(mousePosition.x - 50) / 15}px)`,
            top: `calc(60% + ${(mousePosition.y - 50) / 8}px)`,
            animationDelay: '1.5s'
          }}
        />
        <div 
          className="absolute h-2 w-2 animate-float-medium rounded-full bg-emerald-300/40 transition-all duration-500"
          style={{
            left: `calc(30% + ${(mousePosition.x - 50) / 10}px)`,
            bottom: `calc(20% - ${(mousePosition.y - 50) / 12}px)`,
            animationDelay: '0.5s'
          }}
        />
        <div 
          className="absolute h-3 w-3 animate-float-fast rounded-full bg-purple-300/30 transition-all duration-700"
          style={{
            right: `calc(10% - ${(mousePosition.x - 50) / 8}px)`,
            bottom: `calc(30% - ${(mousePosition.y - 50) / 10}px)`,
            animationDelay: '2.5s'
          }}
        />

        {/* Additional interactive light rays */}
        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Content with subtle parallax effect */}
      <div className="relative z-10 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-screen-xl">
          <div 
            className="mx-auto max-w-3xl text-center"
            style={{
              transform: `translate(${(mousePosition.x - 50) / 50}px, ${(mousePosition.y - 50) / 50}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* Title with staggered animation */}
            <h1 className={`text-4xl font-bold tracking-tight text-white transition-all duration-1000 md:text-5xl lg:text-6xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {data.title}
            </h1>
            
            {/* Subtitle with delay */}
            <p className={`mt-6 text-lg leading-relaxed text-white/90 transition-all duration-1000 delay-300 md:text-xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {data.subtitle}
            </p>

            {/* Decorative line */}
            <div className={`mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-1000 delay-500 ${mounted ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
