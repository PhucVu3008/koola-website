#!/bin/bash

echo "🚀 Starting KOOLA Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Start services
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if database is ready
until docker exec koola-postgres pg_isready -U koola_user -d koola_db > /dev/null 2>&1; do
  echo "⏳ Waiting for database..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Seed database
echo "🌱 Seeding database with sample data..."
docker exec -i koola-postgres psql -U koola_user -d koola_db < seed.sql

echo ""
echo "✅ KOOLA Development Environment is ready!"
echo ""
echo "📡 Services:"
echo "   - API Backend: http://localhost:4000"
echo "   - PostgreSQL: localhost:5432"
echo "   - pgAdmin: http://localhost:5050 (admin@koola.local / admin)"
echo ""
echo "🔑 Default Admin Account:"
echo "   - Email: admin@koola.com"
echo "   - Password: admin123"
echo ""
echo "🧪 Test API:"
echo "   curl http://localhost:4000/health"
echo "   curl http://localhost:4000/v1/services?locale=en"
echo ""
echo "📝 View logs:"
echo "   docker-compose logs -f api"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
