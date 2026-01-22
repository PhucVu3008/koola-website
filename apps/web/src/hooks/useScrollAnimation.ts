'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook to trigger animations when element enters viewport
 * 
 * @param options - IntersectionObserver options
 * @returns [ref, isVisible] - Attach ref to element, isVisible indicates if element is in viewport
 * 
 * @example
 * const [ref, isVisible] = useScrollAnimation();
 * return <div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>Content</div>
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once when element becomes visible
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element fully enters viewport
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, options]);

  return [ref, isVisible] as const;
}

/**
 * Hook for staggered animations with custom delays
 * 
 * @param index - Index of element in list (for staggered delay)
 * @param baseDelay - Base delay in seconds (default: 0)
 * @param staggerDelay - Delay between each item in seconds (default: 0.1)
 * @returns [ref, isVisible, delay] - Attach ref to element, isVisible state, calculated delay
 * 
 * @example
 * items.map((item, index) => {
 *   const [ref, isVisible, delay] = useStaggeredAnimation(index);
 *   return <div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'} style={{ animationDelay: `${delay}s` }}>{item}</div>
 * })
 */
export function useStaggeredAnimation<T extends HTMLElement = HTMLDivElement>(
  index: number,
  baseDelay: number = 0,
  staggerDelay: number = 0.1
) {
  const [ref, isVisible] = useScrollAnimation<T>();
  const delay = baseDelay + index * staggerDelay;
  
  return [ref, isVisible, delay] as const;
}
