'use client';

import { useRef } from 'react';

/**
 * Hook — scroll animation disabled.
 * Always returns isVisible = true so all content renders immediately on load.
 *
 * @returns [ref, isVisible] — isVisible is always true
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  _options: IntersectionObserverInit = {}
) {
  const ref = useRef<T>(null);
  // Always visible — no IntersectionObserver needed.
  return [ref, true] as const;
}

/**
 * Hook for staggered animations — animation disabled.
 * Always returns isVisible = true, delay = 0.
 *
 * @param index - Index of element (unused, kept for API compatibility)
 * @returns [ref, isVisible, delay]
 */
export function useStaggeredAnimation<T extends HTMLElement = HTMLDivElement>(
  _index: number,
  _baseDelay: number = 0,
  _staggerDelay: number = 0.1
) {
  const [ref, isVisible] = useScrollAnimation<T>();
  // Delay is always 0 — no staggering needed.
  return [ref, isVisible, 0] as const;
}
