#!/bin/bash

# Test script to verify services API endpoint
# Run inside Docker: docker-compose exec api bash test-services-api.sh

echo "Testing Services API..."
echo "======================"
echo ""

# Test EN locale
echo "1. Testing EN locale (6 services):"
curl -s "http://localhost:4000/v1/services?locale=en&page=1&pageSize=6&sort=order" | jq '.data | length'
echo ""

# Test EN locale with details
echo "2. Services details (EN):"
curl -s "http://localhost:4000/v1/services?locale=en&page=1&pageSize=6&sort=order" | jq '.data[] | {id, title, slug, excerpt: (.excerpt | .[0:50])}'
echo ""

# Test VI locale
echo "3. Testing VI locale (6 services):"
curl -s "http://localhost:4000/v1/services?locale=vi&page=1&pageSize=6&sort=order" | jq '.data | length'
echo ""

# Test VI locale with details
echo "4. Services details (VI):"
curl -s "http://localhost:4000/v1/services?locale=vi&page=1&pageSize=6&sort=order" | jq '.data[] | {id, title, slug, excerpt: (.excerpt | .[0:50])}'
