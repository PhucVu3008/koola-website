#!/bin/bash
# Quick Setup Script for Email Notification System
# This script automates the setup process

set -e

echo "================================================"
echo "📧 Email Notification System Setup"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if docker-compose is running
if ! docker-compose ps | grep -q "api.*Up"; then
  echo -e "${RED}❌ Error: Docker containers are not running${NC}"
  echo "Please start containers first: docker-compose up -d"
  exit 1
fi

echo -e "${GREEN}✅ Docker containers are running${NC}"
echo ""

# Step 1: Install dependencies
echo "-----------------------------------"
echo "📦 Step 1: Installing dependencies"
echo "-----------------------------------"
echo ""

docker-compose exec -T api sh -c "cd /app/apps/api && npm install nodemailer @types/nodemailer"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${RED}❌ Failed to install dependencies${NC}"
  exit 1
fi
echo ""

# Step 2: Run migration
echo "-----------------------------------"
echo "🗄️  Step 2: Running database migrations"
echo "-----------------------------------"
echo ""

echo "Running migration 016 (email_notifications table)..."
docker-compose exec -T api sh -c "psql \$DATABASE_URL -f /app/migrations/016_create_email_notifications.sql" 2>&1 | grep -v "already exists" || true

echo ""
echo "Running migration 017 (email settings seed)..."
docker-compose exec -T api sh -c "psql \$DATABASE_URL -f /app/migrations/017_seed_email_notification_settings.sql" 2>&1 | grep -v "duplicate key" || true

echo ""
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Step 3: Check environment variables
echo "-----------------------------------"
echo "⚙️  Step 3: Checking configuration"
echo "-----------------------------------"
echo ""

SMTP_HOST=$(docker-compose exec -T api sh -c 'echo $SMTP_HOST' | tr -d '\r')
SMTP_USER=$(docker-compose exec -T api sh -c 'echo $SMTP_USER' | tr -d '\r')
NOTIFICATION_EMAIL=$(docker-compose exec -T api sh -c 'echo $NOTIFICATION_EMAIL' | tr -d '\r')

if [ -z "$SMTP_HOST" ] || [ -z "$SMTP_USER" ]; then
  echo -e "${RED}❌ SMTP configuration is missing${NC}"
  echo ""
  echo "Please configure SMTP in apps/api/.env:"
  echo ""
  echo "SMTP_HOST=smtp.gmail.com"
  echo "SMTP_PORT=587"
  echo "SMTP_SECURE=false"
  echo "SMTP_USER=your-email@gmail.com"
  echo "SMTP_PASS=your-app-password"
  echo "SMTP_FROM=noreply@yourwebsite.com"
  echo "NOTIFICATION_EMAIL=admin@yourwebsite.com"
  echo "ADMIN_PANEL_URL=http://localhost:3000/en/admin"
  echo ""
  echo "For Gmail App Password setup:"
  echo "1. Enable 2FA: https://myaccount.google.com/security"
  echo "2. Create App Password: https://myaccount.google.com/apppasswords"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ SMTP configuration found${NC}"
echo "   Host: $SMTP_HOST"
echo "   User: $SMTP_USER"
echo "   Notification Email: $NOTIFICATION_EMAIL"
echo ""

# Step 4: Restart API
echo "-----------------------------------"
echo "🔄 Step 4: Restarting API service"
echo "-----------------------------------"
echo ""

docker-compose restart api

echo -e "${GREEN}✅ API service restarted${NC}"
echo ""

# Step 5: Test configuration
echo "-----------------------------------"
echo "✉️  Step 5: Testing email configuration"
echo "-----------------------------------"
echo ""

read -p "Do you want to send a test email now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -z "$NOTIFICATION_EMAIL" ]; then
    read -p "Enter test email recipient: " TEST_EMAIL
  else
    TEST_EMAIL="$NOTIFICATION_EMAIL"
  fi
  
  echo "Sending test email to: $TEST_EMAIL"
  echo ""
  
  ./scripts/test-email-config.sh "$TEST_EMAIL"
else
  echo "Skipping test email. You can test later with:"
  echo "./scripts/test-email-config.sh your-email@example.com"
fi

echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "🎉 NEW: You can now configure notification email in Admin Panel!"
echo ""
echo "Quick steps:"
echo "1. Login: http://localhost:3000/en/admin/login"
echo "2. Go to Settings page"
echo "3. Find 'Email Notification Settings' (blue card)"
echo "4. Enter your email and click Save"
echo ""
echo "Or continue with env variable method:"
echo "1. Edit apps/api/.env: NOTIFICATION_EMAIL=your@email.com"
echo "2. Test: ./scripts/test-email-config.sh"
echo ""
echo "Next steps:"
echo "- Test contact form: http://localhost:3000/en/contact"
echo "- View leads in admin: http://localhost:3000/en/admin/leads"
echo "- Configure email in: http://localhost:3000/en/admin/settings"
echo ""
echo "Documentation:"
echo "- Admin Config: UPDATE_ADMIN_EMAIL_CONFIG.md"
echo "- Quick Start: QUICK_START_EMAIL.md"
echo "- Full Guide: apps/api/docs/2026-01-30_EMAIL_NOTIFICATION_SYSTEM.md"
echo ""
