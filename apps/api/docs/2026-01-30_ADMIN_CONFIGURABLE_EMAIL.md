# Admin-Configurable Email Notifications

**Date**: January 30, 2026  
**Feature**: Database-driven notification email configuration

## 🎯 Overview

Admin có thể cập nhật email nhận thông báo trực tiếp trong Admin Panel, không cần sửa file `.env` hay restart server.

## ✨ Key Features

- ✅ **Database-driven**: Email lưu trong `site_settings` table
- ✅ **Admin UI**: Form đẹp, dễ sử dụng trong Settings page
- ✅ **Real-time updates**: Không cần restart API server
- ✅ **Fallback mechanism**: Vẫn dùng env variable nếu chưa set trong DB
- ✅ **Cached**: Settings được cache 1 phút để giảm tải DB
- ✅ **Global setting**: Áp dụng cho tất cả locales

## 📁 Files Changed

### Backend

#### New Files
- `apps/api/src/utils/siteSettings.ts` - Helper functions for settings
- `migrations/017_seed_email_notification_settings.sql` - Seed initial values

#### Modified Files
- `apps/api/src/services/emailService.ts` - Read from database instead of env

### Frontend

#### Modified Files
- `apps/web/app/admin/[locale]/settings/page.tsx` - Added notification email section

## 🗄️ Database Schema

Settings are stored in existing `site_settings` table:

```sql
CREATE TABLE "site_settings" (
  "key" text PRIMARY KEY,
  "value" jsonb NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
```

### New Settings

| Key | Type | Description | Example |
|-----|------|-------------|---------|
| `notification_email` | string | Email to receive lead notifications | `"admin@company.com"` |
| `admin_panel_url` | string | URL to admin panel (for email links) | `"https://yoursite.com/admin"` |

## 🚀 Setup

### 1. Run Migration

```bash
# Inside Docker container
docker-compose exec api sh
psql $DATABASE_URL -f /app/migrations/017_seed_email_notification_settings.sql
exit
```

Or from host:
```bash
docker-compose exec api psql $DATABASE_URL -f /app/migrations/017_seed_email_notification_settings.sql
```

### 2. Update in Admin Panel

1. Login: `http://localhost:3000/en/admin/login`
2. Go to Settings: `http://localhost:3000/en/admin/settings`
3. Find "Email Notification Settings" section (highlighted in blue)
4. Enter your email address
5. Click "Save"

That's it! No restart needed.

## 🔧 How It Works

### Email Resolution Priority

```
1. Check database: site_settings.notification_email
   ↓ (if not found)
2. Check environment: NOTIFICATION_EMAIL
   ↓ (if not found)
3. Throw error: "Notification email is not configured"
```

### Caching Strategy

```typescript
// Settings are cached for 1 minute
const CACHE_TTL = 60000; // 1 minute

// First request: Read from database → Cache it
// Subsequent requests (within 1 min): Read from cache
// After 1 min: Cache expires → Read from database again
```

**Why cache?**
- Reduces database load
- Email notifications happen frequently
- 1 minute is acceptable delay for settings changes

### Code Flow

```
User submits contact form
    ↓
leadService.createLead()
    ↓
emailService.sendLeadNotification()
    ↓
siteSettings.getNotificationEmail()
    ↓
    ├─→ Check cache (if recent)
    │   └─→ Return cached value
    │
    ├─→ Query database: SELECT value FROM site_settings WHERE key = 'notification_email'
    │   └─→ Cache result → Return value
    │
    └─→ Fallback to process.env.NOTIFICATION_EMAIL
```

## 🎨 Admin UI

### Location
`/admin/[locale]/settings` (any locale: `/en/admin/settings` or `/vi/admin/settings`)

### Features
- **Prominent placement**: Blue gradient card at the top
- **Clear instructions**: What this setting does
- **Visual feedback**: Icon, colors, tooltips
- **Real-time save**: No page reload needed
- **Validation**: Email format required

### UI Components
- 📧 Email icon in blue badge
- Input field with placeholder
- "Save" button (disabled while saving)
- Info box explaining behavior
- Helpful tip about SMTP configuration

## 📊 API Reference

### Helper Functions

#### `getNotificationEmail()`
```typescript
import * as siteSettings from '../utils/siteSettings';

const email = await siteSettings.getNotificationEmail();
// Returns: "admin@company.com"
// Throws: Error if not configured anywhere
```

#### `getNotificationEmails()` (Future: Multiple recipients)
```typescript
const emails = await siteSettings.getNotificationEmails();
// Returns: ["admin@company.com", "support@company.com"]
```

#### `clearCache()`
```typescript
siteSettings.clearCache();
// Force refresh on next request
```

### Admin API Endpoint

Settings are managed via existing endpoint:

```typescript
// Update notification email
PUT /v1/admin/site-settings/notification_email
{
  "value": "newemail@company.com",
  "description": "Email address to receive contact form notifications"
}
```

## ✅ Testing

### Test 1: Update Email in Admin UI

```bash
# 1. Login to admin panel
# 2. Go to Settings page
# 3. Update notification email
# 4. Click Save
# 5. Submit a test lead from contact form
# 6. Check new email inbox
```

### Test 2: Verify Database

```sql
-- Check current setting
SELECT key, value, updated_at 
FROM site_settings 
WHERE key = 'notification_email';

-- Should return:
-- key                  | value                    | updated_at
-- notification_email   | "your-new-email@..."     | 2026-01-30 15:30:00
```

### Test 3: Verify Email Sending

```bash
# Send test lead
curl -X POST http://localhost:4000/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test After Email Update",
    "email": "test@example.com",
    "message": "Testing new notification email"
  }'

# Check email_notifications table
docker-compose exec api psql $DATABASE_URL -c "
  SELECT recipient, status, created_at 
  FROM email_notifications 
  ORDER BY created_at DESC 
  LIMIT 1;
"

# Should show your new email address
```

## 🔒 Security

### Considerations

1. **Admin-only**: Only authenticated admins can change settings
2. **Email validation**: Frontend validates email format
3. **SQL injection**: Parameterized queries used
4. **Rate limiting**: Admin API has rate limits

### Permissions Required

To change notification email:
- Must be logged in as admin
- Must have `admin` or `editor` role
- Endpoint: `/v1/admin/site-settings/*` requires authentication

## 🐛 Troubleshooting

### Issue: Email still goes to old address

**Solution**: Clear cache
```bash
# Restart API to clear cache
docker-compose restart api

# Or wait 1 minute for cache to expire naturally
```

### Issue: "Notification email is not configured" error

**Check**:
1. Is setting saved in database?
   ```sql
   SELECT * FROM site_settings WHERE key = 'notification_email';
   ```
2. Is `NOTIFICATION_EMAIL` set in `.env`?
   ```bash
   docker-compose exec api printenv | grep NOTIFICATION_EMAIL
   ```

**Fix**: Set in either location (database preferred)

### Issue: UI doesn't show current email

**Solution**: Check browser console for errors
```javascript
// In browser console
console.log('Settings loaded:', settings);
```

## 🎓 Best Practices

### For Admins

1. **Use company email**: Better than personal Gmail
2. **Test after changing**: Submit a test lead to verify
3. **Keep SMTP configured**: Email address is useless without SMTP
4. **Consider backup**: Use email forwarding rules for redundancy

### For Developers

1. **Always use helper**: Don't read env variables directly
   ```typescript
   // ❌ Don't
   const email = process.env.NOTIFICATION_EMAIL;
   
   // ✅ Do
   const email = await siteSettings.getNotificationEmail();
   ```

2. **Cache appropriately**: Balance freshness vs performance
3. **Provide fallbacks**: Env variable is good fallback
4. **Clear cache after updates**: In API endpoints that modify settings

## 🚀 Future Enhancements

### Planned Features

1. **Multiple Recipients**
   - Support comma-separated emails
   - Or array in `notification_emails` setting

2. **Per-Locale Notifications**
   - Different emails for EN vs VI leads
   - Stored as `notification_email_en`, `notification_email_vi`

3. **Email Templates Management**
   - Store subject/body templates in database
   - Admin can customize email content

4. **Test Email Button**
   - Send test notification from Settings page
   - Verify SMTP + email address in one click

5. **Notification Rules**
   - Only notify for certain lead sources
   - Time-based rules (e.g., business hours only)

### Implementation Example (Multiple Recipients)

```typescript
// In siteSettings.ts (already implemented)
export const getNotificationEmails = async (): Promise<string[]> => {
  const emailsFromDb = await getSetting('notification_emails');
  
  if (Array.isArray(emailsFromDb)) {
    return emailsFromDb;
  }
  
  if (typeof emailsFromDb === 'string') {
    return emailsFromDb.split(',').map(e => e.trim());
  }
  
  const singleEmail = await getNotificationEmail();
  return [singleEmail];
};

// Usage in emailService.ts
const recipients = await siteSettings.getNotificationEmails();
for (const recipient of recipients) {
  await sendEmail({ to: recipient, ... });
}
```

## 📝 Migration Notes

### Upgrading from Env-only

If you were using only `NOTIFICATION_EMAIL` env variable:

1. ✅ No action needed - it still works as fallback
2. ⚠️ Recommended: Migrate to database for easier management
   - Copy value from `.env` to Admin Settings page
   - Test to ensure it works
   - Keep env variable as backup

### Downgrading

If you need to rollback:

1. Remove `notification_email` from database:
   ```sql
   DELETE FROM site_settings WHERE key = 'notification_email';
   ```
2. Ensure `NOTIFICATION_EMAIL` is set in `.env`
3. Restart API: `docker-compose restart api`

## 📚 Related Documentation

- [Email Notification System](./2026-01-30_EMAIL_NOTIFICATION_SYSTEM.md) - Complete system guide
- [Quick Start Email](../../QUICK_START_EMAIL.md) - Quick setup guide
- [Site Settings API](./API_SITE_SETTINGS.md) - API documentation (if exists)

## ✨ Summary

**What changed:**
- ✅ Admin can now update notification email via UI
- ✅ No server restart needed
- ✅ Settings cached for performance
- ✅ Env variable still works as fallback

**Migration required:**
- ✅ Run migration `017_seed_email_notification_settings.sql`
- ⚠️ Optional: Update email in Admin Settings

**Breaking changes:**
- ❌ None - fully backward compatible

**Testing:**
- ✅ Update email in Settings → Submit form → Verify new inbox

---

**Implementation Complete**: Ready to use! 🎉
