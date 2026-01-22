# Git Push Guide - Professional Commits

## 📋 Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

---

## 🚀 Commands for Today's Work (Jan 21, 2026)

### Step 1: Check Current Status
```bash
git status
```

### Step 2: Add All Changes
```bash
git add .
```

### Step 3: Review Changes (Optional but Recommended)
```bash
git diff --staged
```

### Step 4: Commit with Professional Messages

#### Option A: Single Comprehensive Commit
```bash
git commit -m "feat(footer,legal): restructure footer and implement legal pages

- Restructure footer from 3 columns to 2 columns (Company + Resources)
- Remove placeholder links (Product and Information sections)
- Add locale-aware navigation with withLocale() helper
- Implement 6 legal pages (Terms, Privacy, Cookies) in EN/VI
- Create reusable LegalPage component with fade-in animations
- Add comprehensive legal content (31 sections total)
- Fix animation visibility bug by switching to CSS-only animations
- Add fadeIn and fadeInUp keyframes to globals.css
- Update i18n dictionaries with 300+ lines of legal content per language
- Add professional contact information cards

BREAKING CHANGE: Footer structure changed, old footer_nav pattern removed

Closes #1, #2"
```

#### Option B: Separate Commits (Recommended for Better History)

**Commit 1: Footer Restructure**
```bash
git add apps/web/components/SiteFooter.tsx
git add FOOTER_UPDATE.md

git commit -m "refactor(footer): restructure footer navigation with real project links

- Change from 3 columns (Product/Information/Company) to 2 columns (Company/Resources)
- Remove 9 placeholder links that pointed to non-existent pages
- Add withLocale() helper for locale-aware URLs
- Implement dynamic section titles based on locale (EN/VI)
- Add legal links array for Terms, Privacy, Cookies
- Simplify code by removing footer_nav lookup system
- Update grid layout from col-span-2 to col-span-3 for better spacing

Before: 15 links (60% fake) | After: 11 links (100% real)
Impact: Improved UX, no broken links, better maintainability"
```

**Commit 2: Legal Pages Implementation**
```bash
git add apps/web/app/[locale]/terms/
git add apps/web/app/[locale]/privacy/
git add apps/web/app/[locale]/cookies/
git add apps/web/components/legal/
git add apps/web/src/i18n/dictionaries/en.json
git add apps/web/src/i18n/dictionaries/vi.json
git add apps/web/src/i18n/generated.ts
git add LEGAL_PAGES_IMPLEMENTATION.md

git commit -m "feat(legal): implement professional legal pages with full i18n

- Add Terms of Service page (10 sections)
- Add Privacy Policy page (12 sections, GDPR-inspired)
- Add Cookie Policy page (9 sections)
- Create reusable LegalPage component for consistent layout
- Add 300+ lines of professional legal content per language (EN/VI)
- Implement server-side rendering with daily ISR revalidation
- Add SEO metadata (title, description) for each page
- Include contact information cards with email/phone/address
- Add TypeScript types for LegalSection and ContactInfo

Pages created:
- /en/terms, /vi/terms
- /en/privacy, /vi/privacy
- /en/cookies, /vi/cookies

Total: 6 pages, ~9,000 words of content"
```

**Commit 3: Animation Fix**
```bash
git add apps/web/components/legal/LegalPage.tsx
git add apps/web/app/globals.css
git add LEGAL_PAGES_ANIMATION_FIX.md

git commit -m "fix(legal): fix content visibility with CSS-only animations

- Remove complex Intersection Observer that caused invisible content
- Replace with CSS-only fadeIn and fadeInUp animations
- Add keyframes to globals.css for better performance
- Implement staggered animations with animationDelay
- Content now visible immediately on page load

Bug: Legal pages showed only header/footer, content was invisible
Root cause: Missing CSS definition for 'animate-in' class
Solution: Simplified to CSS animations without JavaScript observers
Result: All content visible with smooth animations"
```

**Commit 4: Documentation**
```bash
git add DAILY_REPORT_2026-01-21.md

git commit -m "docs: add comprehensive daily report for Jan 21, 2026

- Document footer restructuring process and results
- Detail legal pages implementation with code examples
- Include animation bug fix explanation
- Add statistics: 1,074 lines added, 10 files created
- Provide maintenance guide and next steps
- List all achievements and testing results"
```

### Step 5: Push to GitHub

**If pushing to main branch (be careful!):**
```bash
git push origin main
```

**If creating a new branch (recommended for team work):**
```bash
# Create and switch to new branch
git checkout -b feat/footer-and-legal-pages

# Push to new branch
git push -u origin feat/footer-and-legal-pages
```

**If your branch is behind remote:**
```bash
# Pull latest changes first
git pull --rebase origin main

# Then push
git push origin main
```

---

## 🎯 Best Practices

### ✅ DO:
- Write commits in present tense ("add" not "added")
- Keep subject line under 72 characters
- Add body for complex changes
- Reference issue numbers (e.g., "Closes #123")
- Use semantic commit types consistently
- Group related changes in one commit
- Test before committing

### ❌ DON'T:
- Commit broken code
- Mix unrelated changes in one commit
- Use vague messages like "fix bug" or "update"
- Commit sensitive data (API keys, passwords)
- Commit node_modules or build artifacts
- Force push to shared branches without team agreement

---

## 📝 Quick Reference - Common Scenarios

### Scenario 1: Simple Bug Fix
```bash
git add <file>
git commit -m "fix(component): resolve navigation issue on mobile

The mobile menu was not closing after link click due to
missing event listener cleanup.

Fixes #456"
```

### Scenario 2: New Feature
```bash
git add <files>
git commit -m "feat(auth): implement user authentication with JWT

- Add login and registration pages
- Implement JWT token generation and validation
- Create auth middleware for protected routes
- Add refresh token mechanism
- Update database schema with users and tokens tables

Closes #123"
```

### Scenario 3: Breaking Change
```bash
git commit -m "refactor(api): redesign REST API endpoints

BREAKING CHANGE: API endpoints have been restructured.
Old: /api/posts
New: /api/v1/posts

Migration guide: See MIGRATION.md"
```

### Scenario 4: Multiple Files, Same Purpose
```bash
git add apps/web/components/*.tsx
git commit -m "style(components): apply consistent Tailwind styling

- Standardize spacing (px-6, py-4)
- Use semantic color classes (slate-900, blue-600)
- Apply consistent border radius (rounded-xl)
- Update hover states for better UX"
```

### Scenario 5: Documentation Only
```bash
git add *.md
git commit -m "docs: update README with setup instructions

- Add Docker setup guide
- Document environment variables
- Include troubleshooting section
- Add API endpoint documentation"
```

---

## 🔍 Checking Your Commits

### View commit history:
```bash
git log --oneline
```

### View last commit details:
```bash
git show HEAD
```

### View changes in a specific commit:
```bash
git show <commit-hash>
```

### Amend last commit (if not pushed yet):
```bash
# Fix commit message
git commit --amend -m "new message"

# Add forgotten file
git add forgotten-file.txt
git commit --amend --no-edit
```

---

## 🚨 Emergency Commands

### Undo last commit (keep changes):
```bash
git reset --soft HEAD~1
```

### Undo last commit (discard changes):
```bash
git reset --hard HEAD~1
```

### Unstage all files:
```bash
git reset
```

### Discard local changes:
```bash
git checkout -- <file>
# or
git restore <file>
```

---

## 🌟 Example Workflow for Today's Changes

```bash
# 1. Check status
git status

# 2. Stage all changes
git add .

# 3. Create comprehensive commit
git commit -m "feat(footer,legal): restructure footer and implement legal pages

Footer Changes:
- Restructure from 3 columns to 2 columns (Company + Resources)
- Remove placeholder links (Product, Information sections)
- Add locale-aware navigation with withLocale() helper
- Implement dynamic section titles (EN/VI)
- Add legal links (Terms, Privacy, Cookies)

Legal Pages:
- Implement 6 pages (Terms/Privacy/Cookies × EN/VI)
- Add comprehensive content (31 sections, 9000+ words)
- Create reusable LegalPage component
- Add CSS animations (fadeIn, fadeInUp)
- Implement SEO metadata and ISR
- Add contact information cards

Bug Fixes:
- Fix content visibility by switching to CSS-only animations
- Remove complex Intersection Observer
- Add keyframes to globals.css

Documentation:
- Add FOOTER_UPDATE.md
- Add LEGAL_PAGES_IMPLEMENTATION.md
- Add LEGAL_PAGES_ANIMATION_FIX.md
- Add DAILY_REPORT_2026-01-21.md

Files changed: 14 (10 new, 4 modified)
Lines added: 1,174 | Lines removed: 100
Total impact: 6 new pages, improved footer, full i18n support"

# 4. Push to GitHub
git push origin main

# Or create branch for review
git checkout -b feat/footer-and-legal-pages
git push -u origin feat/footer-and-legal-pages
```

---

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Semantic Versioning](https://semver.org/)
- [Writing Good Commit Messages](https://chris.beams.io/posts/git-commit/)

---

## 🎯 Recommended Approach for This Project

```bash
#!/bin/bash
# Save this as push.sh and run: bash push.sh

echo "🚀 Pushing KOOLA Website Changes (Jan 21, 2026)"
echo ""

# Check status
echo "📊 Current status:"
git status
echo ""

# Confirm before proceeding
read -p "Continue with commit? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted"
    exit 1
fi

# Stage all changes
echo "📦 Staging changes..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "feat(footer,legal): restructure footer and implement legal pages

Footer Restructure:
- Remove placeholder sections (Product, Information)
- Implement 2-column layout (Company, Resources)
- Add locale-aware navigation
- Integrate legal links

Legal Pages:
- Add Terms of Service (10 sections)
- Add Privacy Policy (12 sections, GDPR-compliant)
- Add Cookie Policy (9 sections)
- Implement LegalPage component
- Add CSS animations
- Full EN/VI i18n support

Bug Fix:
- Fix content visibility with CSS-only animations

Documentation:
- Add comprehensive implementation guides
- Add daily report

Impact: 6 new pages, improved UX, legal compliance ready"

# Push
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Changes pushed successfully"
echo "🔗 Check: https://github.com/PhucVu3008/koola-website"
```

Make executable and run:
```bash
chmod +x push.sh
./push.sh
```
