# Changelog - Email Notification System

**Date**: January 30, 2026  
**Feature**: Contact Form Email Notifications & Lead Management

## 🎯 Objective

Implement a complete email notification system for contact form submissions:
- ✅ Send instant email notifications to admin when users submit contact form
- ✅ Log all email attempts to database
- ✅ Display and manage leads in admin panel
- ✅ Non-blocking email sending (doesn't slow down form submission)

## 📋 Changes

### Backend (API)

#### 1. Database Migration
- **File**: `migrations/016_create_email_notifications.sql`
- **Changes**:
  - Created `email_status` enum: `pending`, `sent`, `failed`
  - Created `email_type` enum: `lead_notification`, `job_application`, `system`
  - Created `email_notifications` table with fields:
    - `id`, `type`, `recipient`, `subject`, `body`
    - `status`, `error_message`, `metadata`
    - `sent_at`, `created_at`
  - Added indexes for performance

#### 2. Email Service (NEW)
- **File**: `apps/api/src/services/emailService.ts`
- **Functionality**:
  - SMTP configuration with Nodemailer
  - `sendEmail()` - Generic email sender
  - `sendLeadNotification()` - Specialized for lead notifications
  - `sendTestEmail()` - Test SMTP configuration
  - Beautiful HTML email template with company branding
  - Error handling and logging to database

#### 3. Email Repository (NEW)
- **File**: `apps/api/src/repositories/emailRepository.ts`
- **Functionality**:
  - `create()` - Log email notification
  - `updateStatus()` - Update email send status
  - `findById()` - Get notification by ID
  - `list()` - List with filters and pagination
  - `count()` - Count for pagination

#### 4. Lead Service Update
- **File**: `apps/api/src/services/leadService.ts`
- **Changes**:
  - Integrated `emailService.sendLeadNotification()`
  - Non-blocking email sending (async, no await)
  - Errors logged but don't fail lead creation

#### 5. Dependencies
- **File**: `apps/api/package.json`
- **Added**:
  - `nodemailer@^6.9.8` - Email sending library
  - `@types/nodemailer@^6.4.14` - TypeScript types

#### 6. Environment Configuration
- **File**: `apps/api/.env.example`
- **Added variables**:
  ```bash
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=your-app-password
  SMTP_FROM=noreply@yourwebsite.com
  NOTIFICATION_EMAIL=admin@yourwebsite.com
  ADMIN_PANEL_URL=http://localhost:3000/en/admin
  ```

### Frontend (Web)

#### 1. Admin Leads Page Enhancement
- **File**: `apps/web/app/admin/[locale]/leads/page.tsx`
- **Improvements**:
  - Added statistics cards (Total, New, Contacted, Qualified, Closed)
  - Color-coded status badges with emojis
  - Clickable email (mailto:) and phone (tel:) links
  - Display source/referrer path
  - Better date/time formatting
  - Improved message truncation with tooltip
  - Responsive design

#### 2. Admin API Client
- **File**: `apps/web/src/lib/admin-api.ts`
- **Status**: ✅ Already had `listLeads()` and `updateLeadStatus()` methods

### Scripts & Documentation

#### 1. Email Configuration Test Script
- **File**: `scripts/test-email-config.sh`
- **Features**:
  - Check SMTP environment variables
  - Test SMTP connection
  - Send test email
  - Works inside/outside Docker container

#### 2. Quick Setup Script
- **File**: `scripts/setup-email-notifications.sh`
- **Features**:
  - Automated installation of dependencies
  - Run database migration
  - Check configuration
  - Restart API service
  - Optional test email sending
  - Colorful output with status indicators

#### 3. Documentation
- **File**: `apps/api/docs/2026-01-30_EMAIL_NOTIFICATION_SYSTEM.md`
- **Content**:
  - Complete architecture overview
  - Setup instructions
  - Gmail/SendGrid/Mailgun configuration
  - Email template details
  - Testing guide
  - Troubleshooting section
  - Production considerations
  - API reference

#### 4. Quick Start Guide
- **File**: `QUICK_START_EMAIL.md`
- **Content**:
  - Condensed setup instructions
  - Step-by-step with commands
  - Common issues and solutions
  - Links to full documentation

#### 5. Scripts README Update
- **File**: `scripts/README.md`
- **Added**: Documentation for new email testing scripts

## 🔧 Technical Details

### Email Flow

```
User submits form
    ↓
ContactForm (Frontend) → POST /v1/leads
    ↓
leadController.createLead()
    ↓
leadService.createLead()
    ↓
    ├─→ leadRepository.create() → PostgreSQL (leads table)
    │   └─→ Return lead.id immediately
    │
    └─→ emailService.sendLeadNotification() [async, no await]
        ├─→ emailRepository.create() → Log as 'pending'
        ├─→ nodemailer.sendMail() → SMTP Server → Admin Email
        ├─→ emailRepository.updateStatus() → Update to 'sent'
        └─→ [Error] emailRepository.updateStatus() → Update to 'failed'
```

### Email Template

The notification email includes:
- 🔔 Visual header with branding
- Lead ID, Name, Email (clickable)
- Phone (clickable), Company
- Source/referrer page
- Submission timestamp (Vietnam timezone)
- Full message content
- Direct link to admin panel
- Responsive HTML design

### Security Features

- ✅ Parameterized SQL queries (prevent injection)
- ✅ Rate limiting (5 requests/minute on `/v1/leads`)
- ✅ CORS restrictions
- ✅ HTML escaping in email templates
- ✅ Validation with Zod schemas
- ✅ JWT authentication for admin endpoints

## 🚀 Usage

### For Users (Contact Form)
1. Visit `/en/contact` or `/vi/contact`
2. Fill out the form: Name, Email, Message, (optional: Company, Phone)
3. Click "Send"
4. Receive immediate confirmation
5. Admin receives email notification within seconds

### For Admins (Lead Management)
1. Login to admin panel: `/en/admin/login`
2. Navigate to Leads: `/en/admin/leads`
3. View statistics: Total leads, breakdown by status
4. Filter by status: New, Contacted, Qualified, Closed
5. Click email/phone to contact directly
6. Update status inline with dropdown
7. View source/referrer to understand lead origin

## 📊 Database Schema

### `email_notifications` (NEW)
```sql
id               BIGINT PRIMARY KEY
type             email_type NOT NULL          -- lead_notification, job_application, system
recipient        TEXT NOT NULL                -- Email address
subject          TEXT NOT NULL
body             TEXT NOT NULL                -- HTML content
status           email_status NOT NULL        -- pending, sent, failed
error_message    TEXT
metadata         JSONB                        -- { lead_id, lead_email }
sent_at          TIMESTAMPTZ
created_at       TIMESTAMPTZ DEFAULT NOW()
```

### `leads` (Existing)
```sql
id               BIGINT PRIMARY KEY
full_name        TEXT NOT NULL
email            TEXT NOT NULL
phone            TEXT
company          TEXT
message          TEXT
source_path      TEXT                         -- /en/contact, /vi/services/...
utm_source       TEXT
utm_medium       TEXT
utm_campaign     TEXT
status           lead_status NOT NULL         -- new, contacted, qualified, closed
created_at       TIMESTAMPTZ DEFAULT NOW()
```

## 🧪 Testing

### Manual Testing
```bash
# 1. Setup
./scripts/setup-email-notifications.sh

# 2. Test email configuration
./scripts/test-email-config.sh your-email@example.com

# 3. Test via API
curl -X POST http://localhost:4000/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "message": "This is a test",
    "company": "Test Co"
  }'

# 4. Check database
docker-compose exec api psql $DATABASE_URL -c "
  SELECT id, recipient, status, error_message 
  FROM email_notifications 
  ORDER BY created_at DESC 
  LIMIT 5;
"

# 5. Check admin panel
# Visit: http://localhost:3000/en/admin/leads
```

### Verification Checklist
- [ ] Lead saved to database
- [ ] Email sent to `NOTIFICATION_EMAIL`
- [ ] Email logged in `email_notifications` table
- [ ] Status is `sent` (not `failed`)
- [ ] Lead visible in admin panel
- [ ] Status update works in admin
- [ ] Stats cards show correct numbers

## 🐛 Known Issues & Limitations

### Current Limitations
1. **No Email Queue**: Emails sent immediately (not queued)
   - For high volume, consider adding BullMQ
2. **No Retry Logic**: Failed emails stay as 'failed'
   - Manual retry not implemented
3. **Stats Calculation**: Only for current page, not global
   - Needs separate API endpoint for accurate global stats

### Potential Improvements
1. Add reCAPTCHA v3 to prevent spam
2. Implement email queue (BullMQ + Redis)
3. Add retry mechanism for failed emails
4. Create admin dashboard for email metrics
5. Add email templates management UI
6. Support multiple notification recipients
7. Add email webhooks (SendGrid, Mailgun events)

## 🔒 Production Checklist

Before deploying to production:

- [ ] Use dedicated email service (SendGrid/Mailgun, not Gmail)
- [ ] Configure SPF, DKIM, DMARC records
- [ ] Set strong `SMTP_PASS` (store in secrets manager)
- [ ] Add CAPTCHA to contact form
- [ ] Enable email queue system
- [ ] Set up monitoring/alerting for email failures
- [ ] Configure proper `SMTP_FROM` domain email
- [ ] Review rate limits for your traffic volume
- [ ] Test email deliverability (check spam score)
- [ ] Set up email webhooks for bounces/complaints

## 📚 References

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [SendGrid SMTP](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
- [Mailgun SMTP](https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-via-smtp)

## 👥 Author

Implementation: AI Assistant  
Date: January 30, 2026  
Project: Koola Website
