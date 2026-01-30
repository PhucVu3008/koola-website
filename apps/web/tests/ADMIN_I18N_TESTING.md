# Admin i18n Testing Guide

## Test Cases

### 1. Login Page Redirect & i18n

#### Test: English Login
```bash
# Visit login page in English
http://localhost:3000/admin/en/login

# Expected:
- Title: "KOOLA Admin"
- Subtitle: "Sign in to your account"
- Email label: "Email"
- Password label: "Password"
- Button: "Sign in"
- Default creds: "Default: admin@koola.com / admin123"
```

**Success Redirect:**
- After login → `/admin/en` (Dashboard in English)

#### Test: Vietnamese Login
```bash
# Visit login page in Vietnamese
http://localhost:3000/admin/vi/login

# Expected:
- Title: "KOOLA Admin"
- Subtitle: "Đăng nhập vào tài khoản của bạn"
- Email label: "Email"
- Password label: "Mật khẩu"
- Button: "Đăng nhập"
- Default creds: "Mặc định: admin@koola.com / admin123"
```

**Success Redirect:**
- After login → `/admin/vi` (Dashboard in Vietnamese)

---

### 2. Dashboard i18n

#### English Dashboard (`/admin/en`)
```
Title: "Dashboard"
Welcome: "Welcome to KOOLA Admin Panel"
Loading: "Loading statistics..."
Quick Actions: "Quick Actions"

Stat Cards:
- Services
- Blog Posts
- Leads
- Subscribers

Quick Action Links:
- Services: "Add or edit services"
- Posts: "Create new blog posts"
- Leads: "Check contact submissions"

System Info: "System Information"
```

#### Vietnamese Dashboard (`/admin/vi`)
```
Title: "Tổng quan"
Welcome: "Chào mừng đến với Bảng quản trị KOOLA"
Loading: "Đang tải thống kê..."
Quick Actions: "Thao tác nhanh"

Stat Cards:
- Dịch vụ
- Bài viết
- Khách hàng tiềm năng
- Đăng ký nhận tin

Quick Action Links:
- Dịch vụ: "Thêm hoặc chỉnh sửa dịch vụ"
- Bài viết: "Tạo bài viết mới"
- Khách hàng tiềm năng: "Xem các liên hệ"

System Info: "Thông tin hệ thống"
```

---

### 3. Sidebar Navigation i18n

#### English Sidebar
```
- Dashboard
- Services
- Posts
- Categories
- Tags
- Pages
- Navigation
- Site Settings
- Leads
- Newsletter
```

#### Vietnamese Sidebar
```
- Tổng quan
- Dịch vụ
- Bài viết
- Danh mục
- Thẻ
- Trang
- Điều hướng
- Cài đặt
- Khách hàng tiềm năng
- Đăng ký nhận tin
```

---

### 4. Top Bar i18n

#### English Top Bar
```
- Title: "Admin Dashboard"
- View Site: "View Site"
- Logout: "Logout"
- Language Switcher: EN (active) | VI
```

#### Vietnamese Top Bar
```
- Title: "Quản trị"
- View Site: "Xem trang web"
- Logout: "Đăng xuất"
- Language Switcher: EN | VI (active)
```

---

### 5. Language Switcher Tests

#### Test: Switch from EN to VI
```bash
# Start at English dashboard
http://localhost:3000/admin/en

# Click VI button
# Expected URL: http://localhost:3000/admin/vi
# Expected: All UI text changes to Vietnamese
```

#### Test: Switch from VI to EN
```bash
# Start at Vietnamese dashboard
http://localhost:3000/admin/vi

# Click EN button
# Expected URL: http://localhost:3000/admin/en
# Expected: All UI text changes to English
```

#### Test: Maintain locale across page navigation
```bash
# Start at Vietnamese dashboard
http://localhost:3000/admin/vi

# Click "Dịch vụ" in sidebar
# Expected URL: http://localhost:3000/admin/vi/services
# Expected: Services page in Vietnamese

# Click "Bài viết" in sidebar
# Expected URL: http://localhost:3000/admin/vi/posts
# Expected: Posts page in Vietnamese
```

---

### 6. URL Structure Tests

#### Test: Admin root redirect
```bash
curl -sI http://localhost:3000/admin | grep location
# Expected: location: /admin/en
```

#### Test: Invalid locale redirect
```bash
curl -sI http://localhost:3000/admin/fr | grep location
# Expected: location: /admin/en
```

#### Test: Login page with locale
```bash
# English login
http://localhost:3000/admin/en/login
# Expected: Login page in English

# Vietnamese login
http://localhost:3000/admin/vi/login
# Expected: Login page in Vietnamese
```

---

### 7. Login Flow Preservation Tests

#### Scenario A: Login from English page
```bash
1. Visit: http://localhost:3000/admin/en/login
2. Enter credentials: admin@koola.com / admin123
3. Click "Sign in"
4. Expected redirect: http://localhost:3000/admin/en
5. Expected: Dashboard in English
6. Expected: Sidebar in English
7. Expected: Top bar shows "Admin Dashboard"
```

#### Scenario B: Login from Vietnamese page
```bash
1. Visit: http://localhost:3000/admin/vi/login
2. Enter credentials: admin@koola.com / admin123
3. Click "Đăng nhập"
4. Expected redirect: http://localhost:3000/admin/vi
5. Expected: Dashboard in Vietnamese
6. Expected: Sidebar in Vietnamese
7. Expected: Top bar shows "Quản trị"
```

#### Scenario C: Default locale (no locale in URL)
```bash
1. Visit: http://localhost:3000/admin
2. Expected redirect: http://localhost:3000/admin/en
3. Click on navigation to login
4. Expected: http://localhost:3000/admin/en/login
5. After login: http://localhost:3000/admin/en
```

---

## Manual Testing Checklist

### Before Testing
- [ ] Docker containers running (`docker ps`)
- [ ] API healthy (`curl http://localhost:4000/health`)
- [ ] Web server ready (`curl http://localhost:3000`)

### Login Page Tests
- [ ] English login page renders correctly
- [ ] Vietnamese login page renders correctly
- [ ] Login button uses correct locale text
- [ ] Error messages appear (test with wrong password)
- [ ] Success redirect goes to correct locale dashboard

### Dashboard Tests
- [ ] English dashboard shows English text
- [ ] Vietnamese dashboard shows Vietnamese text
- [ ] Stat cards show correct translations
- [ ] Quick actions show correct translations
- [ ] System info shows correct translations

### Navigation Tests
- [ ] Sidebar shows correct locale
- [ ] Clicking sidebar items maintains locale
- [ ] Top bar shows correct locale
- [ ] Language switcher changes locale
- [ ] URL changes when switching locale
- [ ] Page content changes when switching locale

### Locale Persistence Tests
- [ ] Starting at EN, all pages stay EN
- [ ] Starting at VI, all pages stay VI
- [ ] Switching to VI, all pages become VI
- [ ] Switching to EN, all pages become EN
- [ ] Refreshing page maintains locale
- [ ] Opening new tab maintains locale (from localStorage)

---

## Automated Test Script

```bash
#!/bin/bash

echo "🧪 Testing Admin i18n"
echo "====================="

# Test 1: Admin redirect
echo ""
echo "Test 1: /admin redirects to /admin/en"
REDIRECT=$(curl -sI http://localhost:3000/admin | grep -i "location" | awk '{print $2}' | tr -d '\r')
if [ "$REDIRECT" == "/admin/en" ]; then
  echo "✅ PASS: Redirect works"
else
  echo "❌ FAIL: Expected /admin/en, got $REDIRECT"
fi

# Test 2: English login page
echo ""
echo "Test 2: English login page loads"
EN_LOGIN=$(curl -s http://localhost:3000/admin/en/login | grep "Sign in to your account")
if [ -n "$EN_LOGIN" ]; then
  echo "✅ PASS: English login page loads"
else
  echo "❌ FAIL: English login page not found"
fi

# Test 3: Vietnamese login page
echo ""
echo "Test 3: Vietnamese login page loads"
VI_LOGIN=$(curl -s http://localhost:3000/admin/vi/login | grep "Đăng nhập vào tài khoản của bạn")
if [ -n "$VI_LOGIN" ]; then
  echo "✅ PASS: Vietnamese login page loads"
else
  echo "❌ FAIL: Vietnamese login page not found"
fi

# Test 4: Invalid locale redirects
echo ""
echo "Test 4: Invalid locale /admin/fr redirects"
INVALID_REDIRECT=$(curl -sI http://localhost:3000/admin/fr | grep -i "location" | awk '{print $2}' | tr -d '\r')
if [ "$INVALID_REDIRECT" == "/admin/en/fr" ] || [ "$INVALID_REDIRECT" == "/admin/en" ]; then
  echo "✅ PASS: Invalid locale redirects"
else
  echo "❌ FAIL: Expected redirect, got $INVALID_REDIRECT"
fi

echo ""
echo "✅ All tests completed!"
```

Save as `apps/web/tests/test-admin-i18n.sh` and run:
```bash
chmod +x apps/web/tests/test-admin-i18n.sh
./apps/web/tests/test-admin-i18n.sh
```

---

## Known Issues & Solutions

### Issue 1: Login redirects to wrong URL
**Problem:** After login, redirects to `/en/admin` instead of `/admin/en`

**Solution:** ✅ Fixed in `app/admin/[locale]/login/page.tsx`
```typescript
// Before (WRONG)
router.push('/en/admin');

// After (CORRECT)
router.push(`/admin/${locale}`);
```

### Issue 2: Locale not detected from URL
**Problem:** Login page always shows English

**Solution:** ✅ Fixed - Added `useParams()` to get locale from URL
```typescript
const params = useParams();
const locale = (params?.locale as 'en' | 'vi') || 'en';
const t = getAdminTranslations(locale);
```

### Issue 3: Hardcoded links don't maintain locale
**Problem:** Quick action links go to `/admin/services` instead of `/admin/{locale}/services`

**Solution:** ✅ Fixed - Use template literals with locale
```typescript
href={`/admin/${locale}/services`}
```

---

## Summary

✅ **Completed:**
- Login page i18n (EN/VI)
- Dashboard i18n (EN/VI)
- Sidebar navigation i18n
- Top bar i18n
- Language switcher
- Login redirect with locale preservation
- URL structure: `/admin/{locale}/*`

🔧 **TODO (if needed for other pages):**
- Services page i18n
- Posts page i18n
- Categories/Tags/Pages i18n
- Settings page i18n
- Leads/Newsletter page i18n

All core i18n infrastructure is in place. Other pages can follow the same pattern:
```typescript
const params = useParams();
const locale = (params?.locale as 'en' | 'vi') || 'en';
const t = getAdminTranslations(locale);
```
