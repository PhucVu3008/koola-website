# 🎉 NEW: Admin-Configurable Notification Email

## What's New?

Admin giờ có thể **thay đổi email nhận thông báo trực tiếp trong Admin Panel**, không cần:
- ❌ Sửa file `.env`
- ❌ Restart API server
- ❌ SSH vào server

Chỉ cần **click & save** trong Settings page! ✨

## 🚀 Quick Update (2 Steps)

### Step 1: Run Migration

```bash
docker-compose exec api psql $DATABASE_URL -f /app/migrations/017_seed_email_notification_settings.sql
```

### Step 2: Update Email in Admin

1. Login: http://localhost:3000/en/admin/login
2. Go to: **Settings** (in sidebar)
3. Find the **blue "Email Notification Settings" card** at the top
4. Enter your email address
5. Click **"Save"**

**Done!** 🎊 No restart needed.

## 🎨 What It Looks Like

```
┌────────────────────────────────────────────────────────┐
│ 📧  Email Notification Settings                         │
│                                                         │
│ Configure where to receive notifications when users    │
│ submit the contact form.                               │
│                                                         │
│ Notification Email Address                             │
│ ┌──────────────────────────────────┐  ┌──────┐       │
│ │ admin@yourcompany.com            │  │ Save │       │
│ └──────────────────────────────────┘  └──────┘       │
│                                                         │
│ 💡 Tip: You can use Gmail, company email, or any      │
│    SMTP-configured address.                            │
└────────────────────────────────────────────────────────┘
```

## ✨ Key Features

- ✅ **Real-time updates**: No restart needed
- ✅ **User-friendly UI**: Clear instructions with icons
- ✅ **Cached for performance**: 1-minute cache
- ✅ **Fallback to env**: Still works with `NOTIFICATION_EMAIL` env var
- ✅ **Validation**: Email format checked
- ✅ **Global setting**: Works for all locales

## 🧪 Test It

### Before:
```bash
# Had to edit .env
NOTIFICATION_EMAIL=old@email.com

# Restart API
docker-compose restart api
```

### Now:
```
1. Click Settings in admin
2. Change email
3. Click Save
4. Test immediately! (no restart)
```

### Verify:
```bash
# Submit test lead
curl -X POST http://localhost:4000/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "message": "Testing new email"
  }'

# Check your new inbox! 📬
```

## 🔧 How It Works

```
Admin updates email in UI
    ↓
Saved to database: site_settings.notification_email
    ↓
Cached for 1 minute (performance)
    ↓
Next lead submission reads from cache/database
    ↓
Email sent to new address! ✅
```

## 🎓 For Admins

### Best Practices:
1. **Use company email** (not personal)
2. **Test after changing**: Submit a test lead
3. **Keep SMTP configured**: Email needs working SMTP
4. **Consider forwarding**: Setup email rules for backup

### Pro Tips:
- 💡 Can use Gmail with App Password
- 💡 SendGrid/Mailgun better for production
- 💡 Set up email filters to organize leads
- 💡 Check spam folder if not receiving

## 📚 Documentation

- **Setup Guide**: `apps/api/docs/2026-01-30_ADMIN_CONFIGURABLE_EMAIL.md`
- **Full Email System**: `apps/api/docs/2026-01-30_EMAIL_NOTIFICATION_SYSTEM.md`
- **Quick Start**: `QUICK_START_EMAIL.md`

## 🐛 Troubleshooting

### Email still goes to old address?
Wait 1 minute (cache) or restart API:
```bash
docker-compose restart api
```

### Can't save in admin?
Check you're logged in as admin with proper role.

### Email not working at all?
Check SMTP configuration is correct in `.env`.

## 🎁 Bonus: Future Features

Coming soon:
- [ ] Multiple notification emails (support team)
- [ ] Test email button in Settings
- [ ] Email template customization
- [ ] Per-locale notifications (EN vs VI)
- [ ] Notification rules (time-based, source-based)

## ✅ Summary

**What changed:**
- Admin can update notification email via UI
- No server restart needed
- Backward compatible (env var still works)

**Migration:**
- Run migration `017_seed_email_notification_settings.sql`
- Update email in Settings page

**Ready to use!** 🚀
