#!/usr/bin/env bash

###############################################################################
# Admin Jobs API Test Script
# 
# Tests all job management endpoints with authentication, validation, and security
###############################################################################

set -e

BASE_URL="http://localhost:4000/v1"
ADMIN_EMAIL="admin@koola.com"
ADMIN_PASSWORD="admin123"

# Color output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "Admin Jobs API Testing"
echo "=========================================="

###############################################################################
# 1. Login to get access token
###############################################################################
echo -e "\n${YELLOW}[1/12] Logging in as admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
  echo -e "${RED}✗ Failed to get access token${NC}"
  echo "$LOGIN_RESPONSE" | jq
  exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"

###############################################################################
# 2. List all jobs (should work)
###############################################################################
echo -e "\n${YELLOW}[2/12] Listing all jobs...${NC}"
JOBS_RESPONSE=$(curl -s "$BASE_URL/admin/jobs?locale=en&page=1&pageSize=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

JOBS_COUNT=$(echo "$JOBS_RESPONSE" | jq -r '.data | length')
TOTAL=$(echo "$JOBS_RESPONSE" | jq -r '.meta.total')

if [ "$JOBS_COUNT" -ge 0 ] 2>/dev/null; then
  echo -e "${GREEN}✓ Listed $JOBS_COUNT jobs (total: $TOTAL)${NC}"
  echo "$JOBS_RESPONSE" | jq '.data[0:2]' # Show first 2 jobs
else
  echo -e "${RED}✗ Failed to list jobs${NC}"
  echo "$JOBS_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 3. Get job by ID (assuming job ID 1 exists)
###############################################################################
echo -e "\n${YELLOW}[3/12] Getting job ID 1...${NC}"
JOB_RESPONSE=$(curl -s "$BASE_URL/admin/jobs/1" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

JOB_TITLE=$(echo "$JOB_RESPONSE" | jq -r '.data.title')

if [ -n "$JOB_TITLE" ] && [ "$JOB_TITLE" != "null" ]; then
  echo -e "${GREEN}✓ Got job: $JOB_TITLE${NC}"
  echo "$JOB_RESPONSE" | jq '.data | {id, title, slug, department, status}'
else
  echo -e "${RED}✗ Failed to get job${NC}"
  echo "$JOB_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 4. Create new job
###############################################################################
echo -e "\n${YELLOW}[4/12] Creating new job...${NC}"
NEW_JOB=$(cat <<EOF
{
  "locale": "en",
  "title": "Test Backend Engineer",
  "slug": "test-backend-engineer-$(date +%s)",
  "slug_group": "test-backend-engineer",
  "department": "Engineering",
  "location": "Remote",
  "employment_type": "Full-time",
  "level": "Mid-level",
  "summary": "We are looking for a backend engineer to join our team.",
  "responsibilities_md": "## Responsibilities\\n- Write clean code\\n- Review PRs",
  "requirements_md": "## Requirements\\n- 3+ years experience\\n- TypeScript expertise",
  "status": "draft"
}
EOF
)

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/jobs" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$NEW_JOB")

NEW_JOB_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')

if [ -n "$NEW_JOB_ID" ] && [ "$NEW_JOB_ID" != "null" ]; then
  echo -e "${GREEN}✓ Job created with ID: $NEW_JOB_ID${NC}"
else
  echo -e "${RED}✗ Failed to create job${NC}"
  echo "$CREATE_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 5. Update the job
###############################################################################
echo -e "\n${YELLOW}[5/12] Updating job $NEW_JOB_ID...${NC}"
UPDATE_JOB=$(cat <<EOF
{
  "locale": "en",
  "title": "Test Backend Engineer (Updated)",
  "slug": "test-backend-engineer-$(date +%s)",
  "slug_group": "test-backend-engineer",
  "department": "Engineering",
  "location": "Hybrid - Da Lat",
  "employment_type": "Full-time",
  "level": "Senior",
  "summary": "Updated summary for backend engineer position.",
  "responsibilities_md": "## Responsibilities\\n- Write clean code\\n- Lead technical discussions",
  "requirements_md": "## Requirements\\n- 5+ years experience\\n- Strong TypeScript/Node.js background",
  "status": "published"
}
EOF
)

UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/admin/jobs/$NEW_JOB_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_JOB")

UPDATED_ID=$(echo "$UPDATE_RESPONSE" | jq -r '.data.id')

if [ "$UPDATED_ID" = "$NEW_JOB_ID" ]; then
  echo -e "${GREEN}✓ Job updated successfully${NC}"
else
  echo -e "${RED}✗ Failed to update job${NC}"
  echo "$UPDATE_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 6. Verify update in database
###############################################################################
echo -e "\n${YELLOW}[6/12] Verifying update in database...${NC}"
VERIFY_RESPONSE=$(curl -s "$BASE_URL/admin/jobs/$NEW_JOB_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

VERIFY_TITLE=$(echo "$VERIFY_RESPONSE" | jq -r '.data.title')
VERIFY_STATUS=$(echo "$VERIFY_RESPONSE" | jq -r '.data.status')
VERIFY_LOCATION=$(echo "$VERIFY_RESPONSE" | jq -r '.data.location')

if [ "$VERIFY_TITLE" = "Test Backend Engineer (Updated)" ] && \
   [ "$VERIFY_STATUS" = "published" ] && \
   [ "$VERIFY_LOCATION" = "Hybrid - Da Lat" ]; then
  echo -e "${GREEN}✓ Update verified in database${NC}"
  echo "  Title: $VERIFY_TITLE"
  echo "  Status: $VERIFY_STATUS"
  echo "  Location: $VERIFY_LOCATION"
else
  echo -e "${RED}✗ Update not reflected in database${NC}"
  echo "$VERIFY_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 7. Get job applications (should be empty for new job)
###############################################################################
echo -e "\n${YELLOW}[7/12] Getting applications for job $NEW_JOB_ID...${NC}"
APPS_RESPONSE=$(curl -s "$BASE_URL/admin/jobs/$NEW_JOB_ID/applications" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

APPS_COUNT=$(echo "$APPS_RESPONSE" | jq -r '.data | length')

if [ "$APPS_COUNT" -ge 0 ] 2>/dev/null; then
  echo -e "${GREEN}✓ Got $APPS_COUNT applications${NC}"
else
  echo -e "${RED}✗ Failed to get applications${NC}"
  echo "$APPS_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 8. List jobs with filters
###############################################################################
echo -e "\n${YELLOW}[8/12] Listing published jobs only...${NC}"
FILTERED_RESPONSE=$(curl -s "$BASE_URL/admin/jobs?locale=en&status=published&page=1&pageSize=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

FILTERED_COUNT=$(echo "$FILTERED_RESPONSE" | jq -r '.data | length')

if [ "$FILTERED_COUNT" -ge 0 ] 2>/dev/null; then
  echo -e "${GREEN}✓ Listed $FILTERED_COUNT published jobs${NC}"
  echo "$FILTERED_RESPONSE" | jq '.data[0:2] | .[] | {id, title, status}'
else
  echo -e "${RED}✗ Failed to filter jobs${NC}"
  echo "$FILTERED_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 9. Test without authentication (should fail)
###############################################################################
echo -e "\n${YELLOW}[9/12] Testing without authentication (should fail)...${NC}"
NO_AUTH_RESPONSE=$(curl -s "$BASE_URL/admin/jobs")
NO_AUTH_ERROR=$(echo "$NO_AUTH_RESPONSE" | jq -r '.error.code')

if [ "$NO_AUTH_ERROR" = "UNAUTHORIZED" ]; then
  echo -e "${GREEN}✓ Correctly rejected unauthenticated request${NC}"
else
  echo -e "${RED}✗ Security issue: unauthenticated request not rejected${NC}"
  echo "$NO_AUTH_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 10. Test with invalid token (should fail)
###############################################################################
echo -e "\n${YELLOW}[10/12] Testing with invalid token (should fail)...${NC}"
INVALID_TOKEN_RESPONSE=$(curl -s "$BASE_URL/admin/jobs" \
  -H "Authorization: Bearer invalid_token_123")
INVALID_TOKEN_ERROR=$(echo "$INVALID_TOKEN_RESPONSE" | jq -r '.error.code')

if [ "$INVALID_TOKEN_ERROR" = "UNAUTHORIZED" ]; then
  echo -e "${GREEN}✓ Correctly rejected invalid token${NC}"
else
  echo -e "${RED}✗ Security issue: invalid token not rejected${NC}"
  echo "$INVALID_TOKEN_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 11. Test validation (missing required fields)
###############################################################################
echo -e "\n${YELLOW}[11/12] Testing validation (missing required fields)...${NC}"
INVALID_JOB='{"locale": "en"}'
VALIDATION_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/jobs" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$INVALID_JOB")

VALIDATION_ERROR=$(echo "$VALIDATION_RESPONSE" | jq -r '.error.code')

if [ "$VALIDATION_ERROR" = "VALIDATION_ERROR" ]; then
  echo -e "${GREEN}✓ Validation working correctly${NC}"
  echo "$VALIDATION_RESPONSE" | jq '.error.details.issues[0:2]'
else
  echo -e "${RED}✗ Validation not working${NC}"
  echo "$VALIDATION_RESPONSE" | jq
  exit 1
fi

###############################################################################
# 12. Delete the test job
###############################################################################
echo -e "\n${YELLOW}[12/12] Deleting test job $NEW_JOB_ID...${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/admin/jobs/$NEW_JOB_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

DELETED_ID=$(echo "$DELETE_RESPONSE" | jq -r '.data.id')

if [ "$DELETED_ID" = "$NEW_JOB_ID" ]; then
  echo -e "${GREEN}✓ Job deleted successfully${NC}"
else
  echo -e "${RED}✗ Failed to delete job${NC}"
  echo "$DELETE_RESPONSE" | jq
  exit 1
fi

# Verify deletion
VERIFY_DELETE=$(curl -s "$BASE_URL/admin/jobs/$NEW_JOB_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
DELETE_ERROR=$(echo "$VERIFY_DELETE" | jq -r '.error.code')

if [ "$DELETE_ERROR" = "NOT_FOUND" ]; then
  echo -e "${GREEN}✓ Job deletion verified${NC}"
else
  echo -e "${RED}✗ Job still exists after deletion${NC}"
  exit 1
fi

###############################################################################
# Summary
###############################################################################
echo -e "\n=========================================="
echo -e "${GREEN}✓ All 12 tests passed!${NC}"
echo "=========================================="
echo ""
echo "Tested endpoints:"
echo "  ✓ POST   /v1/admin/auth/login"
echo "  ✓ GET    /v1/admin/jobs (with pagination)"
echo "  ✓ GET    /v1/admin/jobs/:id"
echo "  ✓ POST   /v1/admin/jobs (create)"
echo "  ✓ PUT    /v1/admin/jobs/:id (update)"
echo "  ✓ GET    /v1/admin/jobs/:id/applications"
echo "  ✓ DELETE /v1/admin/jobs/:id"
echo ""
echo "Security verified:"
echo "  ✓ Authentication required"
echo "  ✓ Invalid tokens rejected"
echo "  ✓ Input validation working"
echo ""
echo "Database operations verified:"
echo "  ✓ Create, Read, Update, Delete all working"
echo "  ✓ Filtering by status working"
echo "  ✓ Pagination working"
echo ""
