# 🚀 Quick Start: Email Notifications

Hướng dẫn nhanh để setup tính năng gửi email thông báo khi có lead mới từ contact form.

## Bước 1: Cài đặt dependencies

```bash
# Vào container API
docker-compose exec api sh

# Cài nodemailer
cd /app/apps/api
npm install nodemailer @types/nodemailer
```

## Bước 2: Chạy migration

```bash
# Vẫn trong container API
psql $DATABASE_URL -f /app/migrations/016_create_email_notifications.sql
```

## Bước 3: Cấu hình SMTP

Tạo/sửa file `apps/api/.env`:

```bash
# Gmail (khuyến nghị cho test)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password          # Xem hướng dẫn tạo App Password bên dưới
SMTP_FROM=noreply@yourwebsite.com

# Email nhận thông báo
NOTIFICATION_EMAIL=admin@yourwebsite.com
ADMIN_PANEL_URL=http://localhost:3000/en/admin
```

### Cách tạo Gmail App Password:

1. Bật 2-Factor Authentication: https://myaccount.google.com/security
2. Tạo App Password: https://myaccount.google.com/apppasswords
   - Chọn "Mail" và "Other (Custom name)"
   - Copy password 16 ký tự
3. Dán vào `SMTP_PASS`

## Bước 4: Restart API

```bash
# Thoát container (Ctrl+D hoặc exit)
docker-compose restart api
```

## Bước 5: Test

### Test email configuration:
```bash
./scripts/test-email-config.sh your-test-email@gmail.com
```

### Test qua contact form:
1. Mở: http://localhost:3000/en/contact
2. Điền form và submit
3. Kiểm tra email inbox (hoặc spam folder)

### Kiểm tra admin panel:
1. Login: http://localhost:3000/en/admin/login
2. Leads: http://localhost:3000/en/admin/leads
3. Xem lead vừa tạo

## Kiểm tra logs nếu có lỗi

```bash
# Logs API
docker-compose logs api | grep -i email

# Kiểm tra failed emails trong database
docker-compose exec api psql $DATABASE_URL -c "
  SELECT id, recipient, subject, status, error_message, created_at 
  FROM email_notifications 
  WHERE status = 'failed' 
  ORDER BY created_at DESC 
  LIMIT 10;
"
```

## Troubleshooting

### "Invalid login" (Gmail)
- Đảm bảo dùng App Password, không phải password thường
- Bật 2FA trước khi tạo App Password

### Email không gửi nhưng lead vẫn lưu
- ✅ Đây là hành vi đúng (non-blocking)
- Kiểm tra `email_notifications` table để xem lỗi gì

### "Connection timeout"
- Kiểm tra firewall/network
- Thử port khác (587 hoặc 465)

## Tài liệu đầy đủ

Xem: `apps/api/docs/2026-01-30_EMAIL_NOTIFICATION_SYSTEM.md`

## Các tính năng đã có:

✅ Lưu lead vào database  
✅ Gửi email thông báo đến admin (non-blocking)  
✅ Email template đẹp với HTML  
✅ Log tất cả email attempts  
✅ Admin UI để quản lý leads  
✅ Filter và pagination  
✅ Update lead status inline  
✅ Rate limiting (5 requests/phút)  

## Sản xuất (Production):

Khi deploy production, cân nhắc:
- [ ] Dùng SendGrid/Mailgun thay vì Gmail
- [ ] Cấu hình SPF/DKIM cho domain
- [ ] Thêm CAPTCHA (reCAPTCHA v3)
- [ ] Setup email queue (BullMQ) cho high volume
- [ ] Monitor email success rate
