import { useEffect, useState } from 'react';

/**
 * Custom hook to detect mobile/tablet/desktop screen sizes.
 * 
 * Returns boolean flags for common device categories.
 * Handles SSR gracefully (returns false on server).
 * 
 * Usage:
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useMediaQuery();
 * 
 * return (
 *   <div className={isMobile ? 'animate-none' : 'animate-float'}>
 *     {isMobile ? <SimplifiedContent /> : <FullContent />}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery() {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setMounted(true);
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial measurement
    updateDimensions();

    // Listen for resize
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Return false on server or before mount
  if (!mounted) {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isMobileOrTablet: false,
      width: 0,
      height: 0,
      mounted: false,
    };
  }

  const { width } = dimensions;

  return {
    isMobile: width < 768,           // < 768px (mobile phones)
    isTablet: width >= 768 && width < 1024,  // 768px - 1024px (tablets)
    isDesktop: width >= 1024,        // >= 1024px (laptops, desktops)
    isMobileOrTablet: width < 1024,  // < 1024px (mobile + tablet)
    width: dimensions.width,
    height: dimensions.height,
    mounted: true,
  };
}

/**
 * Simple media query hook for single breakpoint.
 * 
 * Usage:
 * ```tsx
 * const isMobile = useMediaQuerySimple('(max-width: 768px)');
 * ```
 */
export function useMediaQuerySimple(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Legacy browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return mounted && matches;
}
