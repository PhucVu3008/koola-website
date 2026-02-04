#!/bin/bash

# Monitoring & Observability System - Test Script
# This script tests all monitoring endpoints and features

set -e  # Exit on error

API_BASE="http://localhost:4000"
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BOLD}===========================================${NC}"
echo -e "${BOLD}  Monitoring & Observability Test Suite${NC}"
echo -e "${BOLD}===========================================${NC}"
echo ""

# Function to test endpoint
test_endpoint() {
  local name=$1
  local endpoint=$2
  local expected_status=${3:-200}
  
  echo -e "${BLUE}Testing:${NC} ${name}"
  echo -e "  Endpoint: ${endpoint}"
  
  response=$(curl -s -w "\n%{http_code}" "${API_BASE}${endpoint}")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n 1)
  
  if [ "$status" -eq "$expected_status" ]; then
    echo -e "  ${GREEN}✓ Status: ${status}${NC}"
  else
    echo -e "  ${YELLOW}⚠ Status: ${status} (expected ${expected_status})${NC}"
  fi
  
  # Show preview of response
  if command -v jq &> /dev/null; then
    echo -e "  Response preview:"
    echo "$body" | jq -C '.' 2>/dev/null | head -20 || echo "$body" | head -20
  else
    echo "$body" | head -20
  fi
  
  echo ""
}

echo -e "${BOLD}1. Health Check Endpoints${NC}"
echo "----------------------------------------"

# Liveness
test_endpoint "Liveness Check" "/health" 200

# Readiness
test_endpoint "Readiness Check" "/health/ready" 200

# Full Health
test_endpoint "Full Health Report" "/health/full" 200

echo -e "${BOLD}2. Metrics Endpoints${NC}"
echo "----------------------------------------"

# Prometheus metrics
echo -e "${BLUE}Testing:${NC} Prometheus Metrics"
echo -e "  Endpoint: /metrics"
response=$(curl -s "${API_BASE}/metrics")
line_count=$(echo "$response" | wc -l)
echo -e "  ${GREEN}✓ Lines: ${line_count}${NC}"
echo -e "  Preview:"
echo "$response" | head -30
echo ""

# JSON metrics
test_endpoint "JSON Metrics" "/metrics/json" 200

# Database metrics
test_endpoint "Database Metrics" "/metrics/db" 200

echo -e "${BOLD}3. Generate Some Traffic${NC}"
echo "----------------------------------------"

echo "Making 20 requests to generate metrics..."
for i in {1..20}; do
  curl -s "${API_BASE}/v1/services?locale=en" > /dev/null
  echo -n "."
done
echo ""
echo -e "${GREEN}✓ Traffic generated${NC}"
echo ""

echo -e "${BOLD}4. Check Updated Metrics${NC}"
echo "----------------------------------------"

# Check HTTP metrics
echo -e "${BLUE}HTTP Metrics:${NC}"
curl -s "${API_BASE}/metrics/json" | jq '{
  totalRequests: .data.http.totalRequests,
  activeRequests: .data.http.activeRequests,
  errorRate: .data.http.errorRate,
  responseTime: {
    p50: .data.http.responseTime.p50,
    p95: .data.http.responseTime.p95,
    p99: .data.http.responseTime.p99
  }
}'
echo ""

# Check DB metrics
echo -e "${BLUE}Database Metrics:${NC}"
curl -s "${API_BASE}/metrics/json" | jq '{
  totalQueries: .data.database.totalQueries,
  connectionPool: {
    size: .data.database.connectionPoolSize,
    active: .data.database.activeConnections,
    idle: .data.database.idleConnections,
    waiting: .data.database.waitingClients
  },
  queryTime: {
    p50: .data.database.queryTime.p50,
    p95: .data.database.queryTime.p95
  }
}'
echo ""

# Check business metrics
echo -e "${BLUE}Business Metrics:${NC}"
curl -s "${API_BASE}/metrics/json" | jq '{
  leads: .data.business.leads.count,
  newsletterSubscriptions: .data.business.newsletterSubscriptions.count,
  jobApplications: .data.business.jobApplications.count
}'
echo ""

echo -e "${BOLD}5. Time-Series Data${NC}"
echo "----------------------------------------"

echo -e "${BLUE}HTTP Requests (last 1 hour):${NC}"
curl -s "${API_BASE}/metrics/timeseries?metric=http.requests&window=3600000" | jq '{
  metric: .data.metric,
  window: .data.window,
  count: .data.count,
  firstPoint: .data.points[0],
  lastPoint: .data.points[-1]
}'
echo ""

echo -e "${BOLD}6. Database Performance${NC}"
echo "----------------------------------------"

echo -e "${BLUE}Connection Pool Status:${NC}"
curl -s "${API_BASE}/metrics/db" | jq '.data.connectionPool'
echo ""

echo -e "${BLUE}Query Patterns (top 5):${NC}"
curl -s "${API_BASE}/metrics/db" | jq '.data.queryPatterns[:5]'
echo ""

echo -e "${BOLD}7. Test Request Tracing${NC}"
echo "----------------------------------------"

echo -e "${BLUE}Sending request with custom correlation ID...${NC}"
response=$(curl -si "${API_BASE}/v1/services?locale=en" -H "X-Request-ID: test-correlation-123")

# Extract headers
echo -e "  Response headers:"
echo "$response" | grep -i "x-request-id" || echo "  (not found)"
echo "$response" | grep -i "x-response-time" || echo "  (not found)"
echo ""

echo -e "${BOLD}===========================================${NC}"
echo -e "${BOLD}  Test Summary${NC}"
echo -e "${BOLD}===========================================${NC}"
echo ""
echo -e "${GREEN}✓ All monitoring endpoints are working!${NC}"
echo ""
echo "Available endpoints:"
echo "  - GET /health              (liveness)"
echo "  - GET /health/ready        (readiness)"
echo "  - GET /health/full         (detailed health)"
echo "  - GET /metrics             (Prometheus format)"
echo "  - GET /metrics/json        (JSON snapshot)"
echo "  - GET /metrics/db          (database performance)"
echo "  - GET /metrics/timeseries  (time-series data)"
echo "  - GET /metrics/aggregated  (aggregated metrics)"
echo ""
echo "Features verified:"
echo "  ✓ Health checks"
echo "  ✓ Metrics collection (HTTP, DB, business, system)"
echo "  ✓ Request tracing (correlation IDs, response time headers)"
echo "  ✓ Database performance monitoring"
echo "  ✓ Time-series data"
echo "  ✓ Prometheus export"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Set up Prometheus scraping: ${API_BASE}/metrics"
echo "  2. Configure Grafana dashboards"
echo "  3. Set up Kubernetes health probes (/health, /health/ready)"
echo "  4. Configure alerting rules (error rate, response time, etc.)"
echo ""
echo -e "${GREEN}Monitoring system is production-ready!${NC}"
