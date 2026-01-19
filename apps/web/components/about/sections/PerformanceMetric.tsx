'use client';

import { useEffect, useRef, useState } from 'react';

export type PerformanceMetricData = {
  description: string;
  percent: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Section 8: Performance & Satisfaction Metric (circular progress with animation).
 * Animates from 0 to target percentage when scrolled into view.
 */
export function PerformanceMetric({ data }: { data: PerformanceMetricData }) {
  const targetPct = clamp(Number.isFinite(data.percent) ? data.percent : 0, 0, 100);
  const [currentPct, setCurrentPct] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  // Separate effect for animation to run only when visible
  useEffect(() => {
    if (!isVisible) return;

    // Animate counter from 0 to target using requestAnimationFrame for smooth sync
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0 to 1
      
      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * targetPct;
      
      setCurrentPct(Math.round(current));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentPct(targetPct); // Ensure final value is exact
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, targetPct]);

  // SVG circle math
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - currentPct / 100);

  return (
    <div ref={ref} className="grid grid-cols-2 items-center gap-16">
      <div>
        <p className="max-w-xl text-sm leading-7 text-slate-500">{data.description}</p>
      </div>

      <div className="flex justify-start">
        <div className="relative h-[120px] w-[120px]">
          <svg viewBox="0 0 120 120" className="h-full w-full" aria-label={`${currentPct}%`}>
            {/* Background circle */}
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="10" />
            {/* Animated progress circle - no CSS transition, animated via state */}
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="rgb(79,70,229)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-3xl font-semibold text-brand-700 tabular-nums">
              {currentPct}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
