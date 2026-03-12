'use client';

import { useEffect } from 'react';

/**
 * Client-side component that dismisses the loading screen overlay
 * once the page has fully mounted and hydrated.
 *
 * Renders nothing — works purely via side-effect on the DOM element
 * injected by the locale layout's inline HTML.
 */
export function LoadingScreen() {
  useEffect(() => {
    const el = document.getElementById('loading-screen');
    if (!el) return;

    el.classList.add('loading-fade-out');

    const timer = setTimeout(() => el.remove(), 600);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
