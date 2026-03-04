# Mobile Testing Guide

**Created**: 2026-03-04  
**Purpose**: Step-by-step guide for testing mobile responsiveness

---

## Quick Test Checklist

### Before Testing
- [ ] Clear browser cache
- [ ] Disable browser extensions (they can interfere)
- [ ] Check that Docker containers are running
- [ ] Verify API is accessible (`http://localhost:4000/health`)
- [ ] Verify frontend is running (`http://localhost:3000`)

---

## 1. Browser DevTools Testing (Fastest)

### Chrome DevTools
```bash
1. Open website: http://localhost:3000/en
2. Press F12 (or Cmd+Opt+I on Mac)
3. Click "Toggle Device Toolbar" icon (or Cmd+Shift+M)
4. Select device from dropdown
```

### Test These Devices (Priority Order)
1. **iPhone SE (2016)** - 320px width (smallest)
   - Tests: Text readability, button sizes, no horizontal scroll
   
2. **iPhone 13 Pro** - 390px width (most common)
   - Tests: Overall mobile experience, touch targets
   
3. **iPhone 14 Pro Max** - 430px width (largest phone)
   - Tests: Spacing, layout doesn't look empty
   
4. **iPad** - 768px width (tablet)
   - Tests: Grid layouts (2-column), navigation
   
5. **iPad Pro** - 1024px width (large tablet)
   - Tests: Transition to desktop layout

### What to Check on Each Screen
- [ ] No horizontal scrolling (swipe left/right shouldn't move content)
- [ ] Text is readable (minimum 14px, preferably 16px)
- [ ] Buttons are easy to tap (minimum 44px, preferably 48px)
- [ ] Images don't overflow container
- [ ] Forms are easy to fill (inputs don't zoom in on iOS)
- [ ] Navigation menu works properly
- [ ] Footer doesn't overlap content

---

## 2. Real Device Testing (Most Accurate)

### iOS Safari (iPhone)
```bash
# Enable Web Inspector on iPhone
1. Settings → Safari → Advanced → Web Inspector (ON)

# Connect to Mac
2. Connect iPhone via USB
3. Open Safari on iPhone: http://YOUR_IP:3000/en
4. On Mac Safari: Develop → [Your iPhone] → localhost

# Get your IP address
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Android Chrome
```bash
# Enable USB Debugging
1. Settings → About Phone → Tap "Build Number" 7 times
2. Settings → Developer Options → USB Debugging (ON)

# Connect to Computer
3. Connect phone via USB
4. Open Chrome on phone: http://YOUR_IP:3000/en
5. On computer Chrome: chrome://inspect → Devices

# Get your IP address (same as above)
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Critical Tests on Real Devices
- [ ] Touch interactions feel responsive
- [ ] Animations don't lag
- [ ] Scroll performance is smooth
- [ ] Forms work with on-screen keyboard
- [ ] Locale switcher works
- [ ] Navigation menu slides smoothly
- [ ] Images load quickly
- [ ] No console errors (check DevTools)

---

## 3. Page-by-Page Test Matrix

### Home Page (`/en`)
| Element | Mobile (320px) | Tablet (768px) | Desktop (1024px+) |
|---------|----------------|----------------|-------------------|
| Hero height | 500px min | 600px | 700-900px |
| Hero CTA buttons | Stacked (full width) | Side by side | Side by side |
| Services grid | 1 column | 2 columns | 3 columns |
| Footer links | 1 column | 2 columns | 4 columns |
| Animations | Reduced | Moderate | Full effects |

### Services Page (`/en/services`)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Services grid | 1 column | 2 columns | 3 columns |
| Service cards | Full width | 48% width | 32% width |
| Card images | 16:9 aspect | 16:9 aspect | 16:9 aspect |

### Service Detail (`/en/services/[slug]`)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Layout | Single column | Single column | Sidebar + content |
| Sidebar | Below content | Below content | Right sidebar (sticky) |
| Benefits grid | 1 column | 2 columns | 2 columns |
| Related services | Carousel | Grid 2-col | Grid 3-col |

### Contact Page (`/en/contact`)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Form layout | Full width | Max 600px centered | Max 600px centered |
| Input height | 48px min | 48px | 48px |
| Button height | 52px | 52px | 52px |
| Label position | Above input | Above input | Above input |
| Error messages | Below input | Below input | Below input |

### Careers Page (`/en/careers`)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Job listings | 1 column | 1 column | 1 column |
| Job filters | Dropdown | Side by side | Side by side |
| Job accordion | Full width | Full width | Max 900px |

---

## 4. Common Issues & Fixes

### Issue: Horizontal Scroll Appears
**Symptoms**: Can swipe left/right on mobile
**Causes**:
- Element width exceeds viewport (e.g., `width: 1200px`)
- Negative margins without container constraint
- Absolute positioned elements going off-screen

**Fix**:
```css
/* Add to globals.css */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

/* Or fix the specific element */
.problem-element {
  max-width: 100%;
  overflow-x: auto; /* Only if content needs to scroll */
}
```

---

### Issue: iOS Safari Zooms In on Input Focus
**Symptoms**: Page zooms in when user taps form input
**Cause**: Input font-size < 16px

**Fix**:
```tsx
// ❌ WRONG: Will cause zoom
<input className="text-sm" /> // 14px

// ✅ CORRECT: Won't zoom
<input className="fluid-text-base" /> // 16px minimum
```

---

### Issue: Buttons Too Small to Tap
**Symptoms**: Users struggle to tap buttons
**Cause**: Height/width < 44px

**Fix**:
```tsx
// ❌ WRONG
<button className="px-2 py-1 text-xs">Submit</button>

// ✅ CORRECT
<button 
  className="px-4 fluid-text-base"
  style={{ minHeight: '48px' }}
>
  Submit
</button>
```

---

### Issue: Text Too Small to Read
**Symptoms**: Users need to zoom to read text
**Cause**: Font size < 14px

**Fix**:
```tsx
// ❌ WRONG
<p className="text-xs">Important information</p> // 12px

// ✅ CORRECT
<p className="fluid-text-sm">Important information</p> // 13px → 14px
```

---

### Issue: Images Don't Load or Overflow
**Symptoms**: Images are cut off or stretch wrong
**Cause**: Missing responsive image attributes

**Fix**:
```tsx
// ❌ WRONG
<img src="/image.jpg" width="800" height="600" />

// ✅ CORRECT (Next.js Image)
<Image 
  src="/image.jpg" 
  width={800} 
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
  className="w-full h-auto"
  alt="Description"
/>
```

---

### Issue: Animations Cause Lag on Mobile
**Symptoms**: Page feels slow, janky scrolling
**Cause**: Too many CSS animations or large blur effects

**Fix**:
```tsx
// Use media query hook
const { isMobile } = useMediaQuery();

return (
  <div className={isMobile ? '' : 'animate-float blur-3xl'}>
    {/* Content */}
  </div>
);
```

Or use CSS:
```css
/* Disable heavy effects on mobile */
@media (max-width: 768px) {
  .animate-float {
    animation: none;
  }
  
  .blur-3xl {
    filter: none;
  }
}
```

---

### Issue: Modal/Menu Can't Be Closed on Mobile
**Symptoms**: User taps close button but nothing happens
**Cause**: Incorrect z-index or touch target too small

**Fix**:
```tsx
// ✅ Ensure proper z-index and size
<button
  onClick={() => setOpen(false)}
  className="fixed top-4 right-4 z-50"
  style={{ minWidth: '44px', minHeight: '44px' }}
  aria-label="Close menu"
>
  <X className="w-6 h-6" />
</button>
```

---

## 5. Performance Testing

### Lighthouse Mobile Audit
```bash
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Select "Mobile" device
4. Check "Performance", "Accessibility", "Best Practices", "SEO"
5. Click "Analyze page load"
```

### Target Metrics (Mobile)
- **Performance Score**: > 90
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Speed Index**: < 3.4s

### If Performance Is Poor
1. **Optimize images**:
   ```bash
   # Use WebP/AVIF formats
   # Compress images (80-85% quality)
   # Use proper `sizes` attribute
   ```

2. **Reduce JavaScript**:
   ```tsx
   // Lazy load components
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Skeleton />
   });
   ```

3. **Minimize CSS animations** on mobile (see above)

4. **Enable caching**:
   ```typescript
   // next.config.mjs
   images: {
     minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
   }
   ```

---

## 6. Accessibility Testing (Mobile)

### Screen Reader Testing
**iOS VoiceOver**:
```
1. Settings → Accessibility → VoiceOver (ON)
2. Triple-click home button to toggle
3. Swipe right to move between elements
4. Double-tap to activate
```

**Android TalkBack**:
```
1. Settings → Accessibility → TalkBack (ON)
2. Swipe right to navigate
3. Double-tap to activate
```

### What to Test
- [ ] All buttons have accessible labels
- [ ] Form inputs have associated labels
- [ ] Images have alt text
- [ ] Headings are in correct order (H1 → H2 → H3)
- [ ] Focus order makes sense
- [ ] Error messages are announced

---

## 7. Cross-Browser Testing (Mobile)

### Minimum Browsers to Test
1. **iOS Safari** (latest) - iPhone
2. **Chrome for Android** (latest) - Android phone
3. **Samsung Internet** - Android phone (if available)
4. **Firefox for Android** - Android phone

### Known Quirks
- **iOS Safari**: 
  - `vh` units include address bar (use `dvh` or `svh` in CSS)
  - Inputs < 16px cause zoom
  - Fixed positioning can be buggy
  
- **Chrome Android**:
  - Slightly different rendering of borders
  - Better GPU acceleration than iOS
  
- **Samsung Internet**:
  - Custom ad blocker may interfere
  - Different default fonts

---

## 8. Automated Testing (Optional)

### Playwright Mobile Testing
```typescript
// tests/mobile.spec.ts
import { test, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 13 Pro']
});

test('mobile navigation works', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  
  // Test hamburger menu
  await page.click('[aria-label="Open menu"]');
  await page.waitForSelector('nav');
  
  // Test navigation link
  await page.click('a[href*="/services"]');
  await page.waitForURL('**/services');
});
```

Run tests:
```bash
cd apps/web
npx playwright test --project=mobile
```

---

## 9. Final Mobile Checklist

Before considering mobile optimization complete:

### Visual Design
- [ ] All text is readable without zooming
- [ ] Touch targets are minimum 44px (preferably 48px)
- [ ] Spacing feels comfortable (not cramped)
- [ ] Images scale properly
- [ ] No horizontal scrolling

### Interaction
- [ ] Navigation menu opens/closes smoothly
- [ ] Forms can be filled easily
- [ ] Buttons provide feedback when tapped
- [ ] Scrolling is smooth (no lag)
- [ ] Locale switcher works

### Performance
- [ ] Lighthouse mobile score > 90
- [ ] Page loads in < 3 seconds on 3G
- [ ] Animations don't cause jank
- [ ] Images lazy load

### Compatibility
- [ ] Works on iOS Safari (latest)
- [ ] Works on Chrome Android (latest)
- [ ] No console errors
- [ ] All features functional

### Accessibility
- [ ] Screen reader can navigate
- [ ] Focus order is logical
- [ ] Form errors are clear
- [ ] Color contrast passes WCAG AA

---

## 10. Continuous Monitoring

### Add to CI/CD Pipeline
```yaml
# .github/workflows/mobile-test.yml
name: Mobile Testing
on: [push]
jobs:
  mobile-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npx playwright test --project=mobile
```

### Regular Testing Schedule
- **Daily**: Automated Playwright tests
- **Weekly**: Manual testing on 2-3 real devices
- **Monthly**: Full cross-browser audit
- **Per Release**: Complete checklist review

---

## Resources

- [Apple HIG - iOS](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Material Design - Touch Targets](https://m3.material.io/foundations/interaction/gestures)
- [Web.dev - Mobile Performance](https://web.dev/fast/)
- [MDN - Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
