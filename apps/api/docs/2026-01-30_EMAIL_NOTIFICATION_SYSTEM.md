# 2026-01-30 Email Notification System Guide

## Overview

This document describes the email notification system for contact form submissions (leads). When a user submits the "Send us a Message" form, the system:

1. ✅ Saves the lead to the database
2. ✅ Sends an email notification to admin
3. ✅ Displays leads in admin panel
4. ✅ Logs all email attempts to `email_notifications` table

## Architecture

```
User submits form
    ↓
Frontend (ContactForm) → API POST /v1/leads
    ↓
leadController → leadService.createLead()
    ↓
    ├─→ leadRepository.create() → Database
    └─→ emailService.sendLeadNotification() → SMTP → Admin Email
```

### Non-Blocking Email Sending

Email sending is **asynchronous and non-blocking**:
- Lead is saved to database first (response returned immediately)
- Email is sent in background (doesn't block response)
- Email failures are logged but don't fail the lead creation

## Database Schema

### New Table: `email_notifications`

```sql
CREATE TABLE "email_notifications" (
  "id" BIGINT PRIMARY KEY,
  "type" email_type NOT NULL,              -- 'lead_notification', 'job_application', 'system'
  "recipient" text NOT NULL,                -- Email address
  "subject" text NOT NULL,
  "body" text NOT NULL,                     -- HTML or text content
  "status" email_status NOT NULL,           -- 'pending', 'sent', 'failed'
  "error_message" text,                     -- Error if failed
  "metadata" jsonb,                         -- Extra context (lead_id, etc.)
  "sent_at" timestamptz,
  "created_at" timestamptz DEFAULT now()
);
```

### Existing Table: `leads`

Already exists with fields:
- `full_name`, `email`, `phone`, `company`, `message`
- `source_path`, `utm_*` fields
- `status` (new, contacted, qualified, closed)

## Setup Instructions

### 1. Run Migration

```bash
# Inside Docker container
docker-compose exec api sh

# Run migration
psql $DATABASE_URL -f /app/migrations/016_create_email_notifications.sql
```

### 2. Install Nodemailer

```bash
# Inside API container
docker-compose exec api sh
cd /app/apps/api
npm install nodemailer
npm install -D @types/nodemailer
```

### 3. Configure Environment Variables

Edit `apps/api/.env`:

```bash
# Email/SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password              # Use App Password for Gmail
SMTP_FROM=noreply@yourwebsite.com

# Email Notifications
NOTIFICATION_EMAIL=admin@yourwebsite.com  # Where to send notifications
ADMIN_PANEL_URL=http://localhost:3000/en/admin
```

### 4. Gmail Setup (Recommended)

If using Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Use this App Password as `SMTP_PASS`

Example Gmail config:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourcompany@gmail.com
SMTP_PASS=abcd efgh ijkl mnop          # App Password (spaces will be removed)
SMTP_FROM=noreply@yourwebsite.com
NOTIFICATION_EMAIL=admin@yourwebsite.com
```

### 5. Alternative SMTP Providers

#### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
```

### 6. Restart API Service

```bash
docker-compose restart api
```

### 7. Test Email Configuration

```bash
# Inside API container
docker-compose exec api sh
cd /app/apps/api
node -e "
const emailService = require('./dist/services/emailService');
emailService.sendTestEmail('your-test-email@example.com')
  .then(() => console.log('Test email sent successfully'))
  .catch(err => console.error('Error:', err.message));
"
```

## Email Template

The notification email includes:

- **Subject**: `🔔 New Contact Form Submission - [Name]`
- **Content**:
  - Lead ID
  - Full Name
  - Email (clickable mailto:)
  - Phone (clickable tel:, if provided)
  - Company (if provided)
  - Source/referrer
  - Submission timestamp
  - Message body
  - Direct link to admin panel

Example:

```
🔔 New Contact Form Submission

ID: #123
Name: John Doe
Email: john@example.com
Phone: +84 123 456 789
Company: ABC Corp
Source: /en/contact
Submitted at: Jan 30, 2026, 10:30 AM

Message:
"I'm interested in your IT infrastructure solutions..."

[View in Admin Panel →]
```

## Admin Panel

Access leads at: `/admin/[locale]/leads`

Features:
- ✅ View all leads with pagination
- ✅ Filter by status (new, contacted, qualified, closed)
- ✅ Update lead status inline
- ✅ Display: name, email, phone, company, message, date
- ✅ Responsive table layout

## Testing

### 1. Test Lead Creation (without email)

```bash
curl -X POST http://localhost:4000/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message",
    "company": "Test Co",
    "source_path": "/en/contact"
  }'
```

Expected response:
```json
{
  "data": {
    "id": 1,
    "message": "Thank you for contacting us. We will get back to you soon."
  }
}
```

### 2. Verify Database

```bash
docker-compose exec api psql $DATABASE_URL -c "SELECT * FROM leads ORDER BY id DESC LIMIT 1;"
docker-compose exec api psql $DATABASE_URL -c "SELECT * FROM email_notifications ORDER BY id DESC LIMIT 1;"
```

### 3. Test Admin Panel

1. Login to admin: `http://localhost:3000/en/admin/login`
2. Navigate to Leads: `http://localhost:3000/en/admin/leads`
3. Verify the test lead appears
4. Try changing status

### 4. Test Email Sending

Submit a real contact form:
1. Go to: `http://localhost:3000/en/contact`
2. Fill out the form
3. Submit
4. Check your `NOTIFICATION_EMAIL` inbox

## Troubleshooting

### Email not sending

1. **Check logs**:
   ```bash
   docker-compose logs api | grep -i email
   ```

2. **Verify SMTP credentials**:
   ```bash
   docker-compose exec api env | grep SMTP
   ```

3. **Check email_notifications table**:
   ```sql
   SELECT id, type, recipient, status, error_message, created_at 
   FROM email_notifications 
   WHERE status = 'failed' 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

4. **Test SMTP connection manually**:
   ```bash
   docker-compose exec api node -e "
   const nodemailer = require('nodemailer');
   const transport = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: parseInt(process.env.SMTP_PORT),
     secure: process.env.SMTP_SECURE === 'true',
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });
   transport.verify()
     .then(() => console.log('✅ SMTP connection successful'))
     .catch(err => console.error('❌ SMTP error:', err.message));
   "
   ```

### Common Issues

1. **"Invalid login" error (Gmail)**
   - Make sure you're using App Password, not your regular password
   - Enable 2FA first

2. **"Connection timeout"**
   - Check firewall/network settings
   - Try different port (587 vs 465)

3. **"Self-signed certificate" error**
   - Set `NODE_TLS_REJECT_UNAUTHORIZED=0` (dev only, not recommended for production)

4. **Emails go to spam**
   - Configure SPF, DKIM, DMARC records for your domain
   - Use a verified sender address
   - Consider using a dedicated email service (SendGrid, Mailgun)

## Production Considerations

### 1. Email Queue System

For high-volume production, consider adding a job queue:

```typescript
// Instead of immediate sending:
emailService.sendLeadNotification(lead).catch(...)

// Use queue:
await emailQueue.add('send-lead-notification', { leadId: lead.id });
```

Recommended: **BullMQ** (Redis-based queue)

### 2. Rate Limiting

Already implemented in `/v1/leads` route:
- Max 5 requests per minute per IP
- Prevents spam submissions

### 3. Email Retry Logic

Current implementation:
- ❌ No automatic retry (logged as 'failed')

Future enhancement:
- Add retry mechanism for failed emails
- Exponential backoff strategy

### 4. Monitoring

Monitor these metrics:
- Email success rate (sent / total)
- Average send time
- Failed email count by error type

Query for metrics:
```sql
-- Success rate (last 7 days)
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM email_notifications
WHERE type = 'lead_notification' 
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY status;
```

### 5. Security

✅ **Current security measures**:
- Parameterized SQL queries
- Rate limiting on form endpoint
- CORS restrictions
- Email content sanitization (HTML escaping in template)

⚠️ **Additional recommendations**:
- Add CAPTCHA (Google reCAPTCHA v3) to prevent bot submissions
- Implement honeypot fields
- Validate email format server-side
- Limit message length (prevent abuse)

## API Reference

### POST /v1/leads

Create a new lead and send email notification.

**Request Body**:
```json
{
  "full_name": "string (required)",
  "email": "string (required, valid email)",
  "message": "string (required)",
  "phone": "string (optional)",
  "company": "string (optional)",
  "source_path": "string (optional)"
}
```

**Response (201)**:
```json
{
  "data": {
    "id": 123,
    "message": "Thank you for contacting us. We will get back to you soon."
  }
}
```

**Errors**:
- `400` - Validation error
- `429` - Rate limit exceeded (5 requests/minute)

### GET /v1/admin/leads (Admin only)

List leads with filtering and pagination.

**Query Parameters**:
- `status`: Filter by status (new, contacted, qualified, closed)
- `q`: Search query (name, email, company)
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)

**Response**:
```json
{
  "data": [
    {
      "id": 123,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+84 123 456 789",
      "company": "ABC Corp",
      "message": "...",
      "status": "new",
      "source_path": "/en/contact",
      "created_at": "2026-01-30T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### PATCH /v1/admin/leads/:id/status (Admin only)

Update lead status.

**Request Body**:
```json
{
  "status": "contacted" // new, contacted, qualified, closed
}
```

**Response**:
```json
{
  "data": {
    "id": 123
  }
}
```

## File Structure

```
apps/api/
├── migrations/
│   └── 016_create_email_notifications.sql
├── src/
│   ├── controllers/
│   │   ├── leadController.ts
│   │   └── adminLeadController.ts
│   ├── services/
│   │   ├── leadService.ts          # ← Sends email notification
│   │   ├── adminLeadService.ts
│   │   └── emailService.ts         # ← New: Email sending logic
│   ├── repositories/
│   │   ├── leadRepository.ts
│   │   ├── adminLeadRepository.ts
│   │   └── emailRepository.ts      # ← New: Email logging
│   └── routes/
│       ├── public/
│       │   └── leads.ts            # Public form endpoint
│       └── admin/
│           └── leads.ts            # Admin management

apps/web/
├── app/
│   └── admin/
│       └── [locale]/
│           └── leads/
│               └── page.tsx        # Admin UI for leads
├── components/
│   └── ContactForm.tsx             # Public contact form
└── src/
    └── lib/
        ├── api/
        │   └── leads.ts            # Frontend API client
        └── admin-api.ts            # Admin API client
```

## Next Steps

1. ✅ Run migration
2. ✅ Install nodemailer
3. ✅ Configure SMTP credentials
4. ✅ Test email sending
5. ✅ Verify admin panel
6. ⬜ Add CAPTCHA (optional, recommended for production)
7. ⬜ Set up email queue system (optional, for high volume)
8. ⬜ Configure domain email (SPF/DKIM) for production

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review API logs: `docker-compose logs api`
3. Check email_notifications table for failed emails
4. Verify SMTP credentials are correct
