# Admin Layout Refactor Plan

## Current Structure (Cách 1 - Conditional)
```
app/
  [locale]/
    layout.tsx          → PageLayout (Client Component, conditional rendering)
    admin/
      layout.tsx        → AdminLayout
      login/page.tsx
      page.tsx
      services/page.tsx
      posts/page.tsx
      ... (10 pages)
```

**Issues:**
- ❌ PageLayout forced to be Client Component
- ❌ Loads getSiteSettings() unnecessarily for admin
- ❌ Conditional logic in PageLayout is not clean
- ❌ Public and admin coupled in same layout tree

---

## Proposed Structure (Cách 2 - Separated) ⭐

```
app/
  # Public routes (SEO-optimized)
  [locale]/
    layout.tsx          → Root layout + PageLayout (Server Component)
    page.tsx            → Home
    about/page.tsx
    services/
      page.tsx
      [slug]/page.tsx
    contact/page.tsx
    ...

  # Admin routes (completely separate)
  admin/
    [locale]/
      layout.tsx        → Admin root layout + AdminLayout
      page.tsx          → Dashboard
      login/
        layout.tsx      → Skip auth check
        page.tsx
      services/page.tsx
      posts/page.tsx
      categories/page.tsx
      tags/page.tsx
      pages/page.tsx
      navigation/page.tsx
      settings/page.tsx
      leads/page.tsx
      newsletter/page.tsx
```

---

## Migration Steps

### Step 1: Create new admin structure
```bash
mkdir -p app/admin/\[locale\]
```

### Step 2: Create admin root layout
**File:** `app/admin/[locale]/layout.tsx`
```typescript
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { isLocale, type Locale } from '../../../src/i18n/locales';
import '../../globals.css';

export const metadata: Metadata = {
  title: { default: 'KOOLA Admin', template: '%s | KOOLA Admin' },
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <AdminLayout locale={locale as Locale}>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
```

### Step 3: Move all admin pages
```bash
# Move structure
mv app/[locale]/admin/* app/admin/[locale]/

# Update all import paths in moved files
# Change: import X from '../../../...'
# To:     import X from '../../../...' (adjust depth)
```

### Step 4: Revert PageLayout to Server Component
**File:** `components/layout/PageLayout.tsx`
```typescript
// Remove 'use client'
// Remove usePathname() logic
// Remove admin route check

import type { ReactNode } from 'react';
import { SiteFooter } from '../SiteFooter';
import { SiteHeader } from '../SiteHeader';
import type { SiteSettingsPayload } from '../../src/lib/api/site';

export function PageLayout({
  locale,
  site,
  children,
}: {
  locale: string;
  site: SiteSettingsPayload | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader locale={locale} />
      <main className="w-full">{children}</main>
      {site ? <SiteFooter locale={locale} site={site} /> : null}
    </div>
  );
}
```

### Step 5: Update middleware (optional but recommended)
**File:** `middleware.ts`
```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: handle separately
  if (pathname.startsWith('/admin')) {
    // Admin uses /admin/[locale] structure
    const adminLocaleMatch = pathname.match(/^\/admin\/([^\/]+)/);
    if (!adminLocaleMatch) {
      // Redirect /admin → /admin/en
      return NextResponse.redirect(new URL('/admin/en', request.url));
    }
    const locale = adminLocaleMatch[1];
    if (!isLocale(locale)) {
      return NextResponse.redirect(new URL('/admin/en', request.url));
    }
    return NextResponse.next();
  }

  // Public routes: existing logic
  // ...
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

### Step 6: Update all admin page imports
Search and replace in moved files:
- Auth functions: ensure correct path to `@/lib/admin-auth`
- API client: ensure correct path to `@/lib/admin-api`
- Components: ensure correct path to `@/components/admin/*`
- Translations: ensure correct path to `@/i18n/admin-translations`

### Step 7: Update navigation links
**In:** `src/components/admin/AdminLayout.tsx`
```typescript
const navigation = [
  { name: t.nav.dashboard, href: `/admin/${locale}`, icon: LayoutDashboard },
  { name: t.nav.services, href: `/admin/${locale}/services`, icon: Wrench },
  // ... update all href patterns
];

// Logout redirect
router.push(`/admin/${locale}/login`);

// Language switcher
const newPath = pathname?.replace(`/admin/${locale}/`, `/admin/${newLocale}/`);
```

### Step 8: Test checklist
- [ ] Navigate to `/admin/en` → should show login
- [ ] Login works → redirects to `/admin/en` (dashboard)
- [ ] All navigation links work
- [ ] Language switcher works (EN ↔ VI)
- [ ] No hydration errors
- [ ] Public pages still work normally
- [ ] No console errors
- [ ] Logout redirects correctly

---

## Benefits After Migration

### Performance
- ✅ Admin routes don't load `getSiteSettings()` 
- ✅ Public routes keep Server Components (better SEO)
- ✅ Smaller bundle size per route group

### Maintainability
- ✅ Clear separation: `/admin/*` vs `[locale]/*`
- ✅ Easier to add admin-specific middleware
- ✅ Easier to scale (can move admin to subdomain later)

### Code Quality
- ✅ No conditional logic in PageLayout
- ✅ Each layout tree has single responsibility
- ✅ Better TypeScript inference

---

## Estimated Effort

- **Time:** 1-2 hours (mostly moving files + updating paths)
- **Risk:** Low (mostly structural, no logic changes)
- **Priority:** Medium (current solution works, but this is cleaner)

---

## Alternative: Keep Current Approach

If time is constrained, current approach is acceptable:
- ✅ Works correctly (no bugs)
- ✅ URLs are clean (`/en/admin`)
- ⚠️ Not as clean architecturally
- ⚠️ Slight performance overhead

**Decision:** Discuss with team whether 1-2 hours refactor is worth the long-term benefits.

---

## Recommendation

**For MVP/Quick Launch:** Keep current approach (Cách 1)
**For Production/Long-term:** Refactor to separate structure (Cách 2)

If choosing Cách 2, best time to refactor is **now** (before adding more admin pages).
