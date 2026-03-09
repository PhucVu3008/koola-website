#!/usr/bin/env bash
# =============================================================================
# run-migrations.sh
# Chạy tất cả SQL migrations theo thứ tự trên database production.
#
# Usage (chạy trên server cPanel qua SSH):
#   chmod +x run-migrations.sh
#   DATABASE_URL="postgresql://user:pass@host/dbname" ./run-migrations.sh
#
# Hoặc export biến trước:
#   export DATABASE_URL="postgresql://..."
#   ./run-migrations.sh
# =============================================================================

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set."
  echo "   Example: DATABASE_URL='postgresql://user:pass@host/dbname' ./run-migrations.sh"
  exit 1
fi

MIGRATIONS_DIR="$(dirname "$0")/../migrations"
DB_SQL="$(dirname "$0")/../db.sql"

echo "🗄️  Running database migrations..."
echo "   Target: $DATABASE_URL"
echo ""

# 1. Init schema
echo "  [0] Running db.sql (initial schema)..."
psql "$DATABASE_URL" < "$DB_SQL"
echo "      ✅ Done"

# 2. Run all migrations in order
for file in "$MIGRATIONS_DIR"/0*.sql; do
  name=$(basename "$file")
  echo "  → Running $name..."
  psql "$DATABASE_URL" < "$file"
  echo "      ✅ Done"
done

# 3. Seed data (optional — comment out if not needed)
SEED_FILES=(
  "seed.sql"
  "seed_benefits.sql"
  "seed_benefits_subtitle.sql"
  "seed_service_related.sql"
  "seed_services_icons.sql"
)

echo ""
echo "  🌱 Running seed files..."
SEED_DIR="$(dirname "$0")/.."
for seed in "${SEED_FILES[@]}"; do
  if [ -f "$SEED_DIR/$seed" ]; then
    echo "  → Seeding $seed..."
    psql "$DATABASE_URL" < "$SEED_DIR/$seed" && echo "      ✅ Done" || echo "      ⚠️  Skipped (may already exist)"
  fi
done

echo ""
echo "✅ All migrations completed successfully!"
