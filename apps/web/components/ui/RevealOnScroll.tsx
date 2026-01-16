'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../../src/lib/ui/cx';

export type RevealOnScrollVariant = 'fade-up' | 'fade-in';

/**
 * Reveals content with a modern scroll animation.
 *
 * Design goals:
 * - Smooth: avoid layout thrash and keep transforms on the GPU.
 * - Predictable: reveal transition should not feel like a "load then pop".
 * - Accessible: respects `prefers-reduced-motion`.
 */
export function RevealOnScroll({
  children,
  className,
  variant = 'fade-up',
  once = true,
  threshold = 0.12,
  delayMs = 0,
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
  const timeoutRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  // Compose transforms via CSS variables so scroll-reveal and hover-parallax don't fight.
  const setVar = (key: string, value: string) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty(key, value);
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Defaults.
    setVar('--k-parallax-tx', '0px');
    setVar('--k-parallax-ty', '0px');
    setVar('--k-parallax-rx', '0deg');
    setVar('--k-parallax-ry', '0deg');

    if (prefersReducedMotion) {
      setVar('--k-reveal-y', '0px');
      setVar('--k-reveal-opacity', '1');
      setVar('--k-reveal-blur', '0px');
      setIsVisible(true);
      return;
    }

    // Start slightly offset so the browser has a stable initial transform state.
    if (variant === 'fade-in') {
      setVar('--k-reveal-y', '0px');
    } else {
      setVar('--k-reveal-y', '16px');
    }
    setVar('--k-reveal-opacity', '0');
    setVar('--k-reveal-blur', '10px');

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        if (entry.isIntersecting) {
          // Schedule on next frame to avoid "pop" when entering viewport.
          const run = () => {
            setVar('--k-reveal-y', '0px');
            setVar('--k-reveal-opacity', '1');
            setVar('--k-reveal-blur', '0px');
            setIsVisible(true);
          };

          if (delayMs > 0) {
            timeoutRef.current = window.setTimeout(() => {
              if (rafRef.current) cancelAnimationFrame(rafRef.current);
              rafRef.current = requestAnimationFrame(run);
            }, delayMs);
          } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(run);
          }

          if (once) observer.disconnect();
        } else if (!once) {
          // Hide again (rarely used) with the same baseline.
          if (variant === 'fade-in') {
            setVar('--k-reveal-y', '0px');
          } else {
            setVar('--k-reveal-y', '16px');
          }
          setVar('--k-reveal-opacity', '0');
          setVar('--k-reveal-blur', '10px');
          setIsVisible(false);
        }
      },
      {
        root: null,
        // Trigger a little earlier so the animation starts before it's fully on screen.
        rootMargin: '0px 0px -18% 0px',
        threshold,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [delayMs, once, prefersReducedMotion, threshold, variant]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!hoverParallax) return;
    if (prefersReducedMotion) return;

    const onMove = (e: MouseEvent) => {
      if (!isVisible) return;

      const rect = node.getBoundingClientRect();
      const cxp = rect.left + rect.width / 2;
      const cyp = rect.top + rect.height / 2;

      // A touch more noticeable but still premium.
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
  }, [hoverParallax, isVisible, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={cx(
        // GPU-friendly animation.
        'transform-gpu will-change-transform will-change-opacity',
        // Use separate transitions for transform and opacity/filter; longer + smoother.
        'transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'motion-reduce:transition-none',
        className,
      )}
      style={{
        opacity: 'var(--k-reveal-opacity, 1)' as unknown as number,
        filter: 'blur(var(--k-reveal-blur, 0px))',
        transform:
          'translate3d(var(--k-parallax-tx, 0px), var(--k-parallax-ty, 0px), 0px) translate3d(0px, var(--k-reveal-y, 0px), 0px) rotateX(var(--k-parallax-rx, 0deg)) rotateY(var(--k-parallax-ry, 0deg))',
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
