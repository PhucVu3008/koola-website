'use client';

import { useState } from 'react';
import Image from 'next/image';

export type ServicesHeroData = {
  label: string;
  title: string;
  backgroundImage: string;
};

/**
 * Services Hero Banner
 *
 * Full-width hero with background image, mouse-interactive hexagon particles,
 * and wave animations. Theme: Green/Orange with tech hexagons.
 */
export function ServicesHero({ data }: { data: ServicesHeroData }) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600 -mt-[clamp(3.5rem,8vh,4.5rem)]"
      style={{ height: 'calc(clamp(3.5rem,8vh,4.5rem) + clamp(300px,40vw,420px))' }}
      data-header-theme="dark"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={data.backgroundImage}
          alt={data.title}
          fill
          sizes="100vw"
          className="object-cover opacity-90"
          priority
        />
        {/* Dynamic gradient overlay that shifts with mouse */}
        <div 
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `linear-gradient(${45 + (mousePosition.x - 50) / 5}deg, rgba(5, 150, 105, 0.7) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Interactive Hexagon Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large hexagon decorations with mouse interaction */}
        <div 
          className="absolute transition-all duration-1000 opacity-20"
          style={{
            right: `calc(15% - ${(mousePosition.x - 50) / 15}px)`,
            top: `calc(15% + ${(mousePosition.y - 50) / 15}px)`,
            width: '80px',
            height: '80px',
          }}
        >
          <div 
            className="h-full w-full animate-float-slow"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.4) 0%, rgba(249, 115, 22, 0.4) 100%)',
              backdropFilter: 'blur(4px)',
            }}
          />
        </div>

        <div 
          className="absolute transition-all duration-800 opacity-25"
          style={{
            right: `calc(25% + ${(mousePosition.x - 50) / 20}px)`,
            top: `calc(40% - ${(mousePosition.y - 50) / 18}px)`,
            width: '60px',
            height: '60px',
          }}
        >
          <div 
            className="h-full w-full animate-float-medium"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.4) 100%)',
              backdropFilter: 'blur(4px)',
              animationDelay: '0.5s',
            }}
          />
        </div>

        <div 
          className="absolute transition-all duration-600 opacity-20"
          style={{
            right: `calc(35% - ${(mousePosition.x - 50) / 12}px)`,
            top: `calc(25% + ${(mousePosition.y - 50) / 20}px)`,
            width: '50px',
            height: '50px',
          }}
        >
          <div 
            className="h-full w-full animate-float-fast"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.4) 100%)',
              backdropFilter: 'blur(4px)',
              animationDelay: '1s',
            }}
          />
        </div>

        {/* Small floating hexagons */}
        <div 
          className="absolute transition-all duration-500 opacity-30"
          style={{
            right: `calc(10% + ${(mousePosition.x - 50) / 25}px)`,
            top: `calc(60% - ${(mousePosition.y - 50) / 22}px)`,
            width: '35px',
            height: '35px',
          }}
        >
          <div 
            className="h-full w-full animate-float-slow"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              background: 'rgba(254, 243, 199, 0.5)',
              backdropFilter: 'blur(2px)',
              animationDelay: '1.5s',
            }}
          />
        </div>

        <div 
          className="absolute transition-all duration-700 opacity-25"
          style={{
            right: `calc(45% - ${(mousePosition.x - 50) / 18}px)`,
            top: `calc(55% + ${(mousePosition.y - 50) / 25}px)`,
            width: '40px',
            height: '40px',
          }}
        >
          <div 
            className="h-full w-full animate-float-medium"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              background: 'rgba(167, 243, 208, 0.5)',
              backdropFilter: 'blur(2px)',
              animationDelay: '0.8s',
            }}
          />
        </div>

        {/* Fade to white at bottom (like Careers hero) */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/40 to-transparent" />

        {/* Dynamic radial glow following mouse */}
        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(251, 191, 36, 0.2) 0%, transparent 40%)`,
          }}
        />
      </div>

      {/* Content with subtle parallax */}
      <div className="container relative z-10 flex h-full items-center px-4 sm:px-6">
        <div 
          className="max-w-2xl transition-transform duration-300"
          style={{
            transform: `translate(${(mousePosition.x - 50) / 80}px, ${(mousePosition.y - 50) / 80}px)`,
          }}
        >
          <div className="mb-3 sm:mb-4 inline-block rounded-full border border-amber-400/40 bg-amber-500/20 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-amber-300 backdrop-blur-sm">
            {data.label}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">{data.title}</h1>
        </div>
      </div>
    </section>
  );
}
