#!/bin/bash

echo "🧪 Testing Admin i18n"
echo "====================="

# Test 1: Admin redirect
echo ""
echo "Test 1: /admin redirects to /admin/en"
REDIRECT=$(curl -sI http://localhost:3000/admin | grep -i "location" | awk '{print $2}' | tr -d '\r')
if [ "$REDIRECT" == "/admin/en" ]; then
  echo "✅ PASS: Redirect works ($REDIRECT)"
else
  echo "❌ FAIL: Expected /admin/en, got [$REDIRECT]"
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

# Test 4: English login button text
echo ""
echo "Test 4: English login button shows 'Sign in'"
EN_BUTTON=$(curl -s http://localhost:3000/admin/en/login | grep "Sign in")
if [ -n "$EN_BUTTON" ]; then
  echo "✅ PASS: English button text correct"
else
  echo "❌ FAIL: English button text not found"
fi

# Test 5: Vietnamese login button text
echo ""
echo "Test 5: Vietnamese login button shows 'Đăng nhập'"
VI_BUTTON=$(curl -s http://localhost:3000/admin/vi/login | grep "Đăng nhập")
if [ -n "$VI_BUTTON" ]; then
  echo "✅ PASS: Vietnamese button text correct"
else
  echo "❌ FAIL: Vietnamese button text not found"
fi

# Test 6: English dashboard title
echo ""
echo "Test 6: English dashboard shows 'Dashboard'"
EN_DASH=$(curl -s http://localhost:3000/admin/en | grep "Dashboard")
if [ -n "$EN_DASH" ]; then
  echo "✅ PASS: English dashboard title found"
else
  echo "❌ FAIL: English dashboard title not found"
fi

# Test 7: Vietnamese dashboard title
echo ""
echo "Test 7: Vietnamese dashboard shows 'Tổng quan'"
VI_DASH=$(curl -s http://localhost:3000/admin/vi | grep "Tổng quan")
if [ -n "$VI_DASH" ]; then
  echo "✅ PASS: Vietnamese dashboard title found"
else
  echo "❌ FAIL: Vietnamese dashboard title not found"
fi

echo ""
echo "========================================="
echo "✅ Admin i18n tests completed!"
echo "========================================="
echo ""
echo "Manual tests to perform in browser:"
echo "1. Login at /admin/en/login with admin@koola.com / admin123"
echo "   → Should redirect to /admin/en (English dashboard)"
echo ""
echo "2. Login at /admin/vi/login with admin@koola.com / admin123"
echo "   → Should redirect to /admin/vi (Vietnamese dashboard)"
echo ""
echo "3. Click language switcher EN/VI in top bar"
echo "   → URL and all text should change accordingly"
echo ""
echo "4. Navigate between pages (Services, Posts, etc.)"
echo "   → Locale should persist in URL (/admin/{locale}/*)"
