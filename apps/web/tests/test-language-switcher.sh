#!/bin/bash

echo "🧪 Testing Admin Language Switcher"
echo "===================================="

# Test 1: Login page has language switcher
echo ""
echo "Test 1: Login page shows EN/VI buttons"
LOGIN_SWITCHER=$(curl -s http://localhost:3000/admin/en/login | grep -c "EN\|VI")
if [ "$LOGIN_SWITCHER" -ge 2 ]; then
  echo "✅ PASS: Language switcher found on login page"
else
  echo "❌ FAIL: Language switcher not found on login page"
fi

# Test 2: English login page
echo ""
echo "Test 2: English login page renders correctly"
EN_LOGIN=$(curl -s http://localhost:3000/admin/en/login | grep "Sign in to your account")
if [ -n "$EN_LOGIN" ]; then
  echo "✅ PASS: English login page loads"
else
  echo "❌ FAIL: English login page content missing"
fi

# Test 3: Vietnamese login page
echo ""
echo "Test 3: Vietnamese login page renders correctly"
VI_LOGIN=$(curl -s http://localhost:3000/admin/vi/login | grep "Đăng nhập vào tài khoản của bạn")
if [ -n "$VI_LOGIN" ]; then
  echo "✅ PASS: Vietnamese login page loads"
else
  echo "❌ FAIL: Vietnamese login page content missing"
fi

echo ""
echo "========================================="
echo "✅ Language Switcher Tests Completed!"
echo "========================================="
echo ""
echo "📝 Manual tests to perform in browser:"
echo ""
echo "1. Login Page Language Switcher:"
echo "   a. Visit http://localhost:3000/admin/en/login"
echo "   b. See EN/VI buttons at top-right"
echo "   c. Click VI button → Should go to /admin/vi/login"
echo "   d. Click EN button → Should go to /admin/en/login"
echo "   e. Page content should change language instantly"
echo ""
echo "2. Dashboard Language Switcher:"
echo "   a. Login at http://localhost:3000/admin/en/login"
echo "   b. After login, see EN/VI buttons in top bar"
echo "   c. Click VI button → Should go to /admin/vi"
echo "   d. Click EN button → Should go to /admin/en"
echo "   e. Sidebar and all content should change language"
echo ""
echo "3. Language Persistence:"
echo "   a. Set language to Vietnamese (VI)"
echo "   b. Navigate to Services (/admin/vi/services)"
echo "   c. Language should stay Vietnamese"
echo "   d. Click EN button"
echo "   e. Should go to /admin/en/services (English)"
echo ""
echo "4. Test URLs:"
echo "   - Dashboard EN:  http://localhost:3000/admin/en"
echo "   - Dashboard VI:  http://localhost:3000/admin/vi"
echo "   - Login EN:      http://localhost:3000/admin/en/login"
echo "   - Login VI:      http://localhost:3000/admin/vi/login"
echo "   - Services EN:   http://localhost:3000/admin/en/services"
echo "   - Services VI:   http://localhost:3000/admin/vi/services"
