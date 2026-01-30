'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export type CareersHeroSectionData = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle: string;
};

/**
 * Careers Hero Banner with Interactive Animations
 * Full-width background image with mouse-reactive geometric shapes
 * Theme: Purple/Pink gradient with squares and triangles
 */
export function CareersHeroSection({ data }: { data: CareersHeroSectionData }) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative h-[420px] w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.imageAlt}
          fill
          className="object-cover"
          priority
        />
        {/* Animated gradient overlay that shifts with mouse */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-800/60 to-purple-900/70 transition-all duration-700"
          style={{
            background: `linear-gradient(${90 + (mousePosition.x - 50) / 5}deg, 
              rgba(88, 28, 135, 0.75) 0%, 
              rgba(157, 23, 77, ${0.55 + (mousePosition.y - 50) / 200}) 50%, 
              rgba(88, 28, 135, 0.75) 100%)`,
          }}
        />
      </div>

      {/* Interactive Geometric Shapes Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative squares that rotate with mouse */}
        <div 
          className={`absolute -left-16 -top-16 h-48 w-48 border-2 border-purple-400/20 bg-purple-500/5 backdrop-blur-sm transition-all duration-[2500ms] ${mounted ? 'translate-x-24 translate-y-24' : ''}`}
          style={{
            transform: `translate(${24 + (mousePosition.x - 50) / 8}px, ${24 + (mousePosition.y - 50) / 8}px) rotate(${(mousePosition.x - 50) / 10}deg)`,
          }}
        />
        <div 
          className={`absolute -right-16 -bottom-16 h-64 w-64 border-2 border-pink-400/20 bg-pink-500/5 backdrop-blur-sm transition-all duration-[3000ms] delay-200 ${mounted ? '-translate-x-24 -translate-y-24' : ''}`}
          style={{
            transform: `translate(${-24 + (mousePosition.x - 50) / 12}px, ${-24 + (mousePosition.y - 50) / 12}px) rotate(${-(mousePosition.x - 50) / 8}deg)`,
          }}
        />

        {/* Floating geometric particles - squares, diamonds, triangles */}
        {/* Square particles */}
        <div 
          className="absolute h-3 w-3 animate-float-slow border border-purple-400/60 bg-purple-400/30 transition-all duration-500"
          style={{
            left: `calc(12% + ${(mousePosition.x - 50) / 6}px)`,
            top: `calc(15% + ${(mousePosition.y - 50) / 6}px)`,
            transform: `rotate(${(mousePosition.x + mousePosition.y) / 4}deg)`,
          }}
        />
        <div 
          className="absolute h-4 w-4 animate-float-medium border border-pink-400/50 bg-pink-400/25 transition-all duration-700"
          style={{
            left: `calc(25% + ${(mousePosition.x - 50) / 10}px)`,
            top: `calc(45% + ${(mousePosition.y - 50) / 8}px)`,
            transform: `rotate(${45 + (mousePosition.x - mousePosition.y) / 3}deg)`,
            animationDelay: '0.8s'
          }}
        />

        {/* Diamond particles (rotated squares) */}
        <div 
          className="absolute h-3 w-3 animate-float-fast border border-purple-300/60 bg-purple-300/30 transition-all duration-600"
          style={{
            right: `calc(18% - ${(mousePosition.x - 50) / 8}px)`,
            top: `calc(25% + ${(mousePosition.y - 50) / 10}px)`,
            transform: `rotate(${45 + (mousePosition.x * 2) / 5}deg)`,
            animationDelay: '1.5s'
          }}
        />
        <div 
          className="absolute h-4 w-4 animate-float-slow border border-pink-300/50 bg-pink-300/25 transition-all duration-800"
          style={{
            right: `calc(30% - ${(mousePosition.x - 50) / 12}px)`,
            top: `calc(65% + ${(mousePosition.y - 50) / 6}px)`,
            transform: `rotate(${45 - (mousePosition.y * 2) / 5}deg)`,
            animationDelay: '1s'
          }}
        />

        {/* Small accent particles */}
        <div 
          className="absolute h-2 w-2 animate-float-medium rounded-sm bg-purple-200/40 transition-all duration-500"
          style={{
            left: `calc(35% + ${(mousePosition.x - 50) / 8}px)`,
            bottom: `calc(25% - ${(mousePosition.y - 50) / 10}px)`,
            animationDelay: '0.3s'
          }}
        />
        <div 
          className="absolute h-2 w-2 animate-float-fast rounded-sm bg-pink-200/40 transition-all duration-700"
          style={{
            right: `calc(12% - ${(mousePosition.x - 50) / 6}px)`,
            bottom: `calc(35% - ${(mousePosition.y - 50) / 8}px)`,
            animationDelay: '2s'
          }}
        />

        {/* Glowing cursor follower effect - purple/pink spotlight */}
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(168, 85, 247, 0.2) 0%, 
              rgba(236, 72, 153, 0.1) 30%,
              transparent 60%)`,
          }}
        />
      </div>

      {/* Content with subtle parallax */}
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div 
          className="space-y-3 px-6"
          style={{
            transform: `translate(${(mousePosition.x - 50) / 40}px, ${(mousePosition.y - 50) / 40}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Title with gradient effect */}
          <h1 className={`text-4xl font-bold text-white transition-all duration-1000 md:text-5xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {data.title}
          </h1>
          
          {/* Subtitle */}
          <p className={`text-lg font-light text-white/95 transition-all duration-1000 delay-200 md:text-xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {data.subtitle}
          </p>

          {/* Decorative elements */}
          <div className={`mx-auto flex items-center justify-center gap-2 transition-all duration-1000 delay-400 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <div className="h-2 w-2 rotate-45 border border-pink-300 bg-pink-300/50" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/50 to-transparent" />
    </div>
  );
}
