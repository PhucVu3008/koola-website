'use client';

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../../src/lib/ui/cx';

export type RevealOnScrollVariant = 'fade-up' | 'fade-in';

/**
 * Wrapper component — scroll-triggered animation disabled.
 * Content is always fully visible on load.
 * Hover parallax effect is preserved.
 */
export function RevealOnScroll({
  children,
  className,
  hoverParallax = false,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealOnScrollVariant;
  once?: boolean;
  threshold?: number;
  delayMs?: number;
  hoverParallax?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const setVar = (key: string, value: string) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty(key, value);
  };

  // Hover parallax effect only — no scroll reveal.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!hoverParallax) return;

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const cxp = rect.left + rect.width / 2;
      const cyp = rect.top + rect.height / 2;
      const dx = (e.clientX - cxp) / Math.max(1, rect.width);
      const dy = (e.clientY - cyp) / Math.max(1, rect.height);

      const tiltX = (-dy * 2.5).toFixed(3);
      const tiltY = (dx * 2.5).toFixed(3);
      const tx = (dx * 10).toFixed(2);
      const ty = (dy * 10).toFixed(2);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setVar('--k-parallax-ry', `${tiltY}deg`);
        setVar('--k-parallax-rx', `${tiltX}deg`);
        setVar('--k-parallax-tx', `${tx}px`);
        setVar('--k-parallax-ty', `${ty}px`);
      });
    };

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setVar('--k-parallax-ry', '0deg');
        setVar('--k-parallax-rx', '0deg');
        setVar('--k-parallax-tx', '0px');
        setVar('--k-parallax-ty', '0px');
      });
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);

    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
    };
  }, [hoverParallax]);

  return (
    <div
      ref={ref}
      className={cx(className)}
      {...rest}
    >
      {children}
    </div>
  );
}
