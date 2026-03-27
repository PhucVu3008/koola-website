'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Triggers when the element enters the viewport.
 * Once visible, stays visible (one-shot by default).
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/**
 * Returns inline style for a staggered fade-up animation.
 * `index` controls stagger delay (0-based).
 */
export function revealStyle(
  visible: boolean,
  index = 0,
  {
    duration = 600,
    stagger = 110,
    translateY = 28,
  }: { duration?: number; stagger?: number; translateY?: number } = {}
): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${translateY}px)`,
    transition: `opacity ${duration}ms ease ${index * stagger}ms, transform ${duration}ms ease ${index * stagger}ms`,
  };
}
