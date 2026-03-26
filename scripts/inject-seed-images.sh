#!/usr/bin/env bash
# =============================================================================
# inject-seed-images.sh
#
# Injects seeded blog cover images into the API Docker uploads volume on VPS.
# Run this once after the containers are up on VPS for the first time.
#
# Usage (from project root on VPS, or via SSH):
#   chmod +x scripts/inject-seed-images.sh
#   ./scripts/inject-seed-images.sh
#
# Or run remotely:
#   ssh -p 5555 koola@14.224.233.11 "cd ~/koola-website && bash scripts/inject-seed-images.sh"
# =============================================================================

set -euo pipefail

SEED_DIR="${1:-seed-images}"

echo "🔍 Finding API container..."
API_CTR=$(docker compose -f docker-compose.production.yml ps -q api 2>/dev/null || \
          docker ps --filter "name=koola-api" -q 2>/dev/null)

if [ -z "$API_CTR" ]; then
  echo "❌ ERROR: API container not found. Is docker-compose.production.yml running?"
  exit 1
fi
echo "   Container: $API_CTR"

echo ""
echo "📁 Ensuring /app/uploads/media/ exists in container..."
docker exec "$API_CTR" mkdir -p /app/uploads/media

echo ""
echo "🖼  Injecting seed images..."

inject() {
  local src="$SEED_DIR/$1"
  local dst="/app/uploads/media/$2"
  if [ -f "$src" ]; then
    docker cp "$src" "$API_CTR:$dst" && echo "   ✓ $2"
  else
    echo "   ⚠ Source not found: $src (skipped)"
  fi
}

inject "ai-dev.jpg"     "1769413291677-il87hb.jpeg"
inject "ai-dev.jpg"     "1769413672864-t6qokd.jpeg"
inject "security.jpg"   "1769415314697-28qmx0.jpeg"
inject "cloud.jpg"      "1769416953770-4m8ceu.jpeg"
inject "automation.jpg" "1769418615778-tvmvkz.jpg"
inject "iot.jpg"        "1769418974548-qacbw9.jpeg"

echo ""
echo "✅ Done. Files in /app/uploads/media/:"
docker exec "$API_CTR" ls -lh /app/uploads/media/
