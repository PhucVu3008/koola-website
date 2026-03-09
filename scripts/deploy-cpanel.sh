#!/usr/bin/env bash
# =============================================================================
# deploy-cpanel.sh
# Build cả web (Next.js) và api (Fastify) cho production,
# sau đó đóng gói để upload lên cPanel (koola.vn).
#
# Usage (chạy trên máy local):
#   chmod +x scripts/deploy-cpanel.sh
#   ./scripts/deploy-cpanel.sh
#
# Output:
#   dist/koola-api-<date>.tar.gz   → upload lên ~/koola.vn/api/
#   dist/koola-web-<date>.tar.gz   → upload lên ~/koola.vn/web/
# =============================================================================

set -euo pipefail

DATE=$(date +%Y%m%d_%H%M%S)
DIST_DIR="$(pwd)/dist"
ROOT_DIR="$(pwd)"

echo "🏗️  Building KOOLA for production deployment..."
echo "=============================================="

# --- Cleanup & prepare output dir ---
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# =============================================================================
# 1. BUILD API (Fastify TypeScript → JavaScript)
# =============================================================================
echo ""
echo "📦 [1/3] Building API (Fastify)..."
cd "$ROOT_DIR/apps/api"

# Install all deps (including devDeps for tsc)
npm install

# Type-check first
echo "  → Type-checking..."
npx tsc --noEmit

# Compile TypeScript
echo "  → Compiling TypeScript..."
npx tsc

# Package: only compiled JS + production node_modules
echo "  → Packaging API..."
TEMP_API="$DIST_DIR/api-temp"
mkdir -p "$TEMP_API"

cp -r dist "$TEMP_API/"
cp package.json "$TEMP_API/"
cp package-lock.json "$TEMP_API/" 2>/dev/null || true
cp .env.production "$TEMP_API/.env" 2>/dev/null || echo "  ⚠️  No .env.production found for API — you must create .env on the server manually"

# Install only production deps in the package folder
cd "$TEMP_API"
npm install --omit=dev --ignore-scripts

# Create tarball
cd "$DIST_DIR"
tar -czf "koola-api-${DATE}.tar.gz" -C "$TEMP_API" .
rm -rf "$TEMP_API"
echo "  ✅ API packaged → dist/koola-api-${DATE}.tar.gz"

# =============================================================================
# 2. BUILD WEB (Next.js standalone)
# =============================================================================
echo ""
echo "📦 [2/3] Building Web (Next.js)..."
cd "$ROOT_DIR/apps/web"

# Install deps
npm install

# Build with production env
NODE_ENV=production npm run build

# Package standalone output
echo "  → Packaging Web..."
TEMP_WEB="$DIST_DIR/web-temp"
mkdir -p "$TEMP_WEB"

# Next.js standalone output is self-contained
cp -r .next/standalone/. "$TEMP_WEB/"
# Copy static assets (standalone doesn't include .next/static or public)
mkdir -p "$TEMP_WEB/.next/static"
cp -r .next/static/. "$TEMP_WEB/.next/static/"
cp -r public/. "$TEMP_WEB/public/" 2>/dev/null || true
cp .env.production "$TEMP_WEB/.env" 2>/dev/null || echo "  ⚠️  No .env.production found for Web — you must create .env on the server manually"

# Create tarball
cd "$DIST_DIR"
tar -czf "koola-web-${DATE}.tar.gz" -C "$TEMP_WEB" .
rm -rf "$TEMP_WEB"
echo "  ✅ Web packaged → dist/koola-web-${DATE}.tar.gz"

# =============================================================================
# 3. PACKAGE MIGRATIONS
# =============================================================================
echo ""
echo "📦 [3/3] Packaging migrations..."
cd "$ROOT_DIR"
tar -czf "$DIST_DIR/koola-migrations-${DATE}.tar.gz" db.sql migrations/ seed.sql \
    seed_benefits.sql seed_benefits_subtitle.sql seed_service_related.sql seed_services_icons.sql 2>/dev/null || \
    tar -czf "$DIST_DIR/koola-migrations-${DATE}.tar.gz" db.sql migrations/ seed.sql
echo "  ✅ Migrations packaged → dist/koola-migrations-${DATE}.tar.gz"

# =============================================================================
# SUMMARY
# =============================================================================
echo ""
echo "=============================================="
echo "✅ Build complete! Files ready in: $DIST_DIR"
echo ""
echo "Files to upload:"
ls -lh "$DIST_DIR"/*.tar.gz
echo ""
echo "Next steps — see: docs/2026-03-05_CPANEL_DEPLOY_GUIDE.md"
echo "=============================================="
