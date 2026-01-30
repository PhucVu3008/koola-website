#!/bin/bash

# Test IP Blocking Feature
# Tests the login endpoint with failed attempts to verify IP blocking works

API_URL="http://localhost:4000/v1/admin/auth/login"
EMAIL="wrong@email.com"
PASSWORD="wrongpassword"

echo "🧪 Testing IP Blocking Feature"
echo "================================"
echo ""
echo "Config: Block IP for 30 seconds after 5 failed attempts within 5 minutes"
echo ""

# Function to attempt login
attempt_login() {
  local attempt_num=$1
  echo "Attempt #$attempt_num: Sending login request..."
  
  response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
  
  http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
  body=$(echo "$response" | sed '/HTTP_CODE/d')
  
  echo "  Status: $http_code"
  
  if [ "$http_code" == "429" ]; then
    echo "  ⚠️  IP BLOCKED!"
    echo "  Response: $body" | jq -C '.' 2>/dev/null || echo "$body"
    return 1
  elif [ "$http_code" == "401" ]; then
    echo "  ❌ Login failed (expected)"
    echo "  Response: $body" | jq -C '.error.message' 2>/dev/null || echo "$body"
    return 0
  else
    echo "  ⚠️  Unexpected status: $http_code"
    echo "  Response: $body"
    return 0
  fi
  
  echo ""
}

# Test 1: Make 5 failed attempts
echo "📝 Test 1: Making 5 failed login attempts..."
echo "-------------------------------------------"
for i in {1..5}; do
  attempt_login $i
  sleep 1
  echo ""
done

# Test 2: 6th attempt should be blocked
echo ""
echo "📝 Test 2: Attempting 6th login (should be BLOCKED)..."
echo "-------------------------------------------------------"
attempt_login 6
blocked=$?

if [ $blocked -eq 1 ]; then
  echo ""
  echo "✅ SUCCESS: IP blocking is working!"
  echo ""
  echo "📝 Test 3: Waiting 30 seconds for block to expire..."
  echo "-----------------------------------------------------"
  for i in {30..1}; do
    printf "\r⏳ Time remaining: %2d seconds" $i
    sleep 1
  done
  echo ""
  echo ""
  
  echo "📝 Test 4: Attempting login after block expires..."
  echo "----------------------------------------------------"
  attempt_login 7
  
  echo ""
  echo "✅ All tests completed!"
else
  echo ""
  echo "❌ FAILED: IP blocking did not work as expected"
fi

echo ""
echo "🔍 Checking database for login attempts..."
echo "-------------------------------------------"
docker exec -i koola-postgres psql -U koola_user -d koola_db -c "SELECT id, email, ip_address, attempted_at, success, failure_reason FROM login_attempts ORDER BY attempted_at DESC LIMIT 10;"

echo ""
echo "✅ Test script completed!"
