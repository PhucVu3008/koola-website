# Mobile Responsive Strategy

**Created**: 2026-03-04  
**Status**: Implementation Guide  
**Scope**: Full website mobile optimization

---

## 1. Design Philosophy

### Core Principles
1. **Mobile-First Thinking**: Design for smallest screens first, then scale up
2. **Fluid Everything**: No hard breakpoints, use `clamp()` for smooth scaling
3. **Touch-Friendly**: Minimum 44px touch targets (Apple HIG), 48px preferred (Material Design)
4. **Performance**: Lazy load images, reduce animations on mobile
5. **Cross-Platform**: Test on iOS Safari, Android Chrome, and various screen sizes

---

## 2. Screen Size Categories

### Target Devices
```
📱 Mobile Small:  320px - 375px  (iPhone SE, old Android)
📱 Mobile Medium: 376px - 414px  (iPhone 12/13/14, standard Android)
📱 Mobile Large:  415px - 480px  (iPhone 14 Pro Max, large Android)
📱 Phablet:       481px - 640px  (Small tablets in portrait)
🖥️ Tablet:        641px - 1024px (iPad, Android tablets)
🖥️ Desktop:       1025px+         (Laptops, desktops)
```

### Breakpoint Strategy (Tailwind)
```typescript
// Use Tailwind breakpoints ONLY when fluid design can't achieve the goal
sm: '640px'   // Small tablet/large phone landscape
md: '768px'   // Tablet portrait
lg: '1024px'  // Tablet landscape/small laptop
xl: '1280px'  // Desktop
2xl: '1400px' // Large desktop
```

**Rule**: Prefer `clamp()` over breakpoints whenever possible.

---

## 3. Typography Scale (Mobile Optimized)

### Fluid Text Classes (already in `globals.css`)
```css
.fluid-text-xs:    clamp(0.6875rem, 1.8vw + 0.4rem, 0.75rem)    /* 11px → 12px */
.fluid-text-sm:    clamp(0.8125rem, 2vw + 0.4rem, 0.875rem)     /* 13px → 14px */
.fluid-text-base:  clamp(0.875rem, 2vw + 0.5rem, 1rem)          /* 14px → 16px */
.fluid-text-lg:    clamp(1rem, 2.5vw + 0.5rem, 1.125rem)        /* 16px → 18px */
.fluid-text-xl:    clamp(1.125rem, 3vw + 0.5rem, 1.25rem)       /* 18px → 20px */
.fluid-text-2xl:   clamp(1.25rem, 3.5vw + 0.6rem, 1.5rem)       /* 20px → 24px */
.fluid-text-3xl:   clamp(1.5rem, 4vw + 0.7rem, 1.875rem)        /* 24px → 30px */
.fluid-text-4xl:   clamp(1.875rem, 5vw + 0.8rem, 2.25rem)       /* 30px → 36px */
.fluid-text-5xl:   clamp(2rem, 6vw + 1rem, 3rem)                /* 32px → 48px */
```

### Mobile-Specific Adjustments Needed
```css
/* NEW: Hero headlines need larger mobile scaling */
.fluid-text-hero: clamp(2.25rem, 8vw + 1rem, 4rem)  /* 36px → 64px */

/* NEW: Section titles */
.fluid-text-section: clamp(1.75rem, 5vw + 0.8rem, 2.5rem)  /* 28px → 40px */

/* NEW: Card titles */
.fluid-text-card: clamp(1.125rem, 3vw + 0.6rem, 1.5rem)  /* 18px → 24px */
```

---

## 4. Spacing System (Mobile Optimized)

### Current Fluid Spacing (already in `globals.css`)
```css
.fluid-gap-sm:  clamp(0.5rem, 2vw, 1rem)     /* 8px → 16px */
.fluid-gap-md:  clamp(1rem, 3vw, 1.5rem)     /* 16px → 24px */
.fluid-gap-lg:  clamp(1.5rem, 4vw, 2.5rem)   /* 24px → 40px */
.fluid-gap-xl:  clamp(2rem, 5vw, 3rem)       /* 32px → 48px */
```

### Additional Spacing Needed
```css
/* NEW: Section vertical spacing */
.fluid-section-gap: clamp(3rem, 8vh, 6rem)  /* 48px → 96px */

/* NEW: Component internal padding */
.fluid-p-card: clamp(1rem, 4vw, 2rem)  /* 16px → 32px */

/* NEW: Hero section height */
.fluid-h-hero: clamp(500px, 80vh, 900px)  /* Maintain aspect ratio */
```

---

## 5. Component-Specific Mobile Optimizations

### A. Header (`SiteHeader.tsx`)
**Current Status**: ✅ Good (mobile menu implemented)

**Improvements Needed**:
- [ ] Reduce header height on mobile: `clamp(56px, 8vh, 72px)` → `clamp(48px, 6vh, 64px)`
- [ ] Make logo smaller on mobile
- [ ] Add subtle shadow on scroll

### B. Hero Section (`HeroSection.tsx`)
**Current Status**: ⚠️ Needs work

**Required Changes**:
```tsx
// Before: minHeight: 'clamp(26.25rem, 60vh, 56.25rem)'
// After: minHeight: 'clamp(500px, 75vh, 900px)'

// Mobile-specific:
// - Stack content vertically on mobile
// - Reduce particle effects (performance)
// - Larger CTA buttons (touch-friendly)
// - Simplified background on mobile
```

### C. Services Grid (`HomeServicesSection.tsx`)
**Current Status**: ⚠️ Unknown (needs inspection)

**Mobile Requirements**:
- Single column on mobile (< 640px)
- 2 columns on tablet (640px - 1024px)
- 3+ columns on desktop (> 1024px)
- Card spacing: `fluid-gap-md`
- Image lazy loading

### D. Forms (`ContactForm.tsx`)
**Current Status**: ⚠️ Needs inspection

**Mobile Requirements**:
- Full-width inputs on mobile
- Large touch targets (48px height minimum)
- Proper keyboard types (`tel`, `email`, `text`)
- Error messages below inputs (not floating)
- Submit button: full-width on mobile, fixed width on desktop

### E. Footer (`SiteFooter.tsx`)
**Current Status**: ✅ Good (fluid grid implemented)

**Minor Improvements**:
- [ ] Single column on mobile (< 480px)
- [ ] 2 columns on tablet (480px - 768px)
- [ ] 4 columns on desktop (> 768px)

---

## 6. Touch Interaction Guidelines

### Minimum Touch Targets
```css
/* Buttons and clickable elements */
.touch-target {
  min-height: 44px;  /* iOS minimum */
  min-width: 44px;
  padding: 12px 20px; /* Comfortable spacing */
}

/* Preferred for primary actions */
.touch-target-large {
  min-height: 48px;  /* Material Design recommendation */
  min-width: 120px;
  padding: 14px 24px;
}
```

### Apply To:
- [ ] All CTA buttons
- [ ] Navigation links (mobile menu)
- [ ] Form inputs
- [ ] Card click areas
- [ ] Icon buttons

---

## 7. Mobile Performance Optimizations

### Image Loading Strategy
```tsx
// Hero images: priority load
<Image src="/hero.jpg" priority quality={90} />

// Above fold: eager loading
<Image src="/service-1.jpg" loading="eager" />

// Below fold: lazy loading (default)
<Image src="/team-photo.jpg" loading="lazy" />
```

### Animation Considerations
```tsx
// Disable heavy animations on mobile
'use client';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 768px)');

return (
  <div className={isMobile ? '' : 'animate-float-slow'}>
    {/* Content */}
  </div>
);
```

### Reduce Motion for Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Cross-Platform Testing Checklist

### iOS Safari
- [ ] Touch targets work correctly
- [ ] Viewport height (`vh`) issues (address bar)
- [ ] Form inputs don't zoom in (use `font-size: 16px` minimum)
- [ ] Smooth scrolling works
- [ ] Fixed positioning behaves correctly

### Android Chrome
- [ ] Material Design touch ripples
- [ ] Navigation gestures don't conflict
- [ ] Performance on mid-range devices
- [ ] Viewport units work correctly

### Common Mobile Issues
- [ ] Horizontal scrolling prevented (`overflow-x: hidden`)
- [ ] Text doesn't overflow on small screens
- [ ] Images don't exceed container width
- [ ] Forms are usable with on-screen keyboard
- [ ] Loading states are clear

---

## 9. Accessibility (Mobile Context)

### Focus Management
```tsx
// Trap focus in mobile menu when open
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, [mobileMenuOpen]);
```

### Screen Reader Considerations
```tsx
// Mobile menu button
<button
  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={mobileMenuOpen}
>
  {/* Icon */}
</button>
```

### Keyboard Navigation on Touch Devices
- Ensure keyboard users can navigate mobile menu
- Provide skip links
- Visible focus indicators

---

## 10. Implementation Priority

### Phase 1: Critical (Week 1)
1. ✅ Header mobile menu (already done)
2. 🔄 Hero section mobile optimization
3. 🔄 Forms mobile optimization
4. 🔄 Touch target sizes

### Phase 2: Important (Week 2)
5. 🔄 Service grid responsive layout
6. 🔄 Image lazy loading
7. 🔄 Performance optimizations
8. ✅ Footer responsive (already done)

### Phase 3: Polish (Week 3)
9. 🔄 Animation optimizations
10. 🔄 Cross-browser testing
11. 🔄 Accessibility audit
12. 🔄 Performance metrics

---

## 11. Testing Devices (Minimum)

### Physical Devices (Recommended)
- iPhone 13 (iOS 16+)
- iPhone SE (small screen)
- Samsung Galaxy S21 (Android 12+)
- iPad (tablet view)

### Browser DevTools (Minimum)
- Chrome DevTools responsive mode
- Firefox responsive design mode
- Safari responsive design mode

### Test Screen Sizes
```
320px  (iPhone SE portrait)
375px  (iPhone 13 portrait)
414px  (iPhone 13 Pro Max portrait)
768px  (iPad portrait)
1024px (iPad landscape)
1440px (Desktop)
```

---

## 12. Code Review Checklist

Before merging mobile optimizations:
- [ ] All touch targets are minimum 44px
- [ ] Text is readable on smallest screen (320px)
- [ ] No horizontal scrolling
- [ ] Images use Next.js `<Image>` component
- [ ] Forms work with mobile keyboard
- [ ] Navigation is clear and accessible
- [ ] Loading states are visible
- [ ] Error messages are clear
- [ ] Performance budget met (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Tested on iOS Safari and Android Chrome

---

## Reference Resources

- [Apple Human Interface Guidelines - iOS](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Material Design - Touch Targets](https://m3.material.io/foundations/interaction/gestures)
- [Web.dev - Responsive Design](https://web.dev/responsive-web-design-basics/)
- [MDN - Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
