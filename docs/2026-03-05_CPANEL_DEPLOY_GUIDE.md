# 2026-03-05_CPANEL_DEPLOY_GUIDE.md

# Hướng dẫn Deploy koola.vn lên cPanel

## Tổng quan kiến trúc trên cPanel

```
Browser
  └─► https://koola.vn (Apache + .htaccess)
        ├─► Reverse Proxy → 127.0.0.1:3001 (Next.js - koola-web)
        │     └─► /api/* rewrite → 127.0.0.1:4001 (Fastify - koola-api)
        │     └─► /uploads/* rewrite → 127.0.0.1:4001 (Fastify - koola-api)
        └─► Static files (.next/static, public/) được serve bởi Next.js

cPanel File System:
  /home/anbinhfo1/
    ├── koola.vn/           ← document root của addon domain
    │   ├── .htaccess       ← reverse proxy Apache config
    │   ├── api/            ← Fastify API (compiled JS)
    │   │   ├── dist/
    │   │   ├── node_modules/
    │   │   └── .env
    │   ├── web/            ← Next.js standalone
    │   │   ├── server.js
    │   │   ├── .next/
    │   │   ├── public/
    │   │   └── .env
    │   └── uploads/        ← user uploaded files
    └── logs/               ← PM2 log files
```

---

## Bước 1: Kiểm tra prerequisites trên cPanel

Đăng nhập SSH vào server (hoặc dùng Terminal trong cPanel):

```bash
# Kiểm tra Node.js version
node --version  # cần >= 18.x

# Kiểm tra npm
npm --version

# Kiểm tra PM2 (process manager)
pm2 --version
# Nếu chưa có PM2:
npm install -g pm2

# Kiểm tra PostgreSQL client
psql --version
# Nếu không có psql, cài:
# (shared hosting thường không cho cài) → dùng phpPgAdmin hoặc import qua cPanel

# Kiểm tra mod_proxy (hỏi hosting provider hoặc check .htaccess logs)
```

---

## Bước 2: Tạo Database PostgreSQL

### Option A: cPanel có PostgreSQL Database

1. Vào cPanel → **PostgreSQL Databases**
2. Tạo database: `anbinhfo1_koola`  
   _(cPanel prefix username tự động: `anbinhfo1_koola`)_
3. Tạo user: `anbinhfo1_koola_user` + password mạnh
4. **Add User To Database** → All Privileges
5. Connection string sẽ là:
   ```
   postgresql://anbinhfo1_koola_user:PASSWORD@127.0.0.1:5432/anbinhfo1_koola
   ```

### Option B: Dùng PostgreSQL cloud (Neon.tech — free)

1. Vào [https://neon.tech](https://neon.tech) → Sign up → New Project: `koola`
2. Copy connection string (sslmode=require đã được bật sẵn)
3. Dùng connection string đó trong `.env`

### Khởi tạo schema và dữ liệu

Trên máy local (có psql):
```bash
# Thay DATABASE_URL bằng connection string thực
export DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"

# Chạy migrations
chmod +x scripts/run-migrations.sh
./scripts/run-migrations.sh
```

Hoặc nếu cPanel có **phpPgAdmin**:
1. Mở phpPgAdmin → chọn database
2. Import `db.sql` trước
3. Import từng file trong `migrations/` theo thứ tự (005 → 019)
4. Import `seed.sql`

---

## Bước 3: Build dự án trên máy local

```bash
# Từ thư mục gốc dự án
chmod +x scripts/deploy-cpanel.sh
./scripts/deploy-cpanel.sh
```

Kết quả trong thư mục `dist/`:
- `koola-api-YYYYMMDD_HHMMSS.tar.gz` — Fastify API
- `koola-web-YYYYMMDD_HHMMSS.tar.gz` — Next.js standalone
- `koola-migrations-YYYYMMDD_HHMMSS.tar.gz` — DB migrations

---

## Bước 4: Chuẩn bị cấu hình .env trên server

### 4a. Tạo file .env cho API (`/home/anbinhfo1/koola.vn/api/.env`)

```bash
NODE_ENV=production
PORT=4001
HOST=127.0.0.1

# Thay bằng DATABASE_URL thực của bạn
DATABASE_URL=postgresql://anbinhfo1_koola_user:STRONG_PASSWORD@127.0.0.1:5432/anbinhfo1_koola

# Tạo JWT secrets:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=<64-byte-random-hex>
JWT_REFRESH_SECRET=<64-byte-random-hex-khác>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=https://koola.vn
RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/home/anbinhfo1/koola.vn/uploads
```

### 4b. Tạo file .env cho Web (`/home/anbinhfo1/koola.vn/web/.env`)

```bash
NODE_ENV=production
API_BASE_URL_SERVER=http://127.0.0.1:4001
NEXT_PUBLIC_API_BASE_URL=https://koola.vn/api
```

---

## Bước 5: Upload files lên cPanel

### Cách 1: Dùng File Manager trong cPanel

1. Vào cPanel → **File Manager**
2. Navigate đến `/home/anbinhfo1/koola.vn/`
3. Upload `koola-api-*.tar.gz` → Giải nén vào thư mục `api/`
4. Upload `koola-web-*.tar.gz` → Giải nén vào thư mục `web/`
5. Upload `deploy/.htaccess` vào `/home/anbinhfo1/koola.vn/`

### Cách 2: Dùng SCP/SFTP (nếu có SSH access)

```bash
# Thay user@server bằng thông tin SSH thực
REMOTE="anbinhfo1@your-server-ip"
DATE="YYYYMMDD_HHMMSS"  # tên file thực trong dist/

# Upload
scp dist/koola-api-${DATE}.tar.gz ${REMOTE}:~/
scp dist/koola-web-${DATE}.tar.gz ${REMOTE}:~/
scp deploy/.htaccess ${REMOTE}:~/koola.vn/.htaccess
scp deploy/ecosystem.config.cjs ${REMOTE}:~/koola.vn/ecosystem.config.cjs

# SSH vào và giải nén
ssh ${REMOTE} << 'ENDSSH'
  mkdir -p ~/koola.vn/api ~/koola.vn/web ~/koola.vn/uploads ~/logs

  # Giải nén API
  tar -xzf ~/koola-api-*.tar.gz -C ~/koola.vn/api/

  # Giải nén Web
  tar -xzf ~/koola-web-*.tar.gz -C ~/koola.vn/web/

  echo "Upload complete"
ENDSSH
```

---

## Bước 6: Tạo .env files trên server

```bash
ssh anbinhfo1@your-server-ip

# Tạo .env cho API
cat > ~/koola.vn/api/.env << 'EOF'
NODE_ENV=production
PORT=4001
HOST=127.0.0.1
DATABASE_URL=postgresql://anbinhfo1_koola_user:STRONG_PASSWORD@127.0.0.1:5432/anbinhfo1_koola
JWT_ACCESS_SECRET=REPLACE_64_BYTE_HEX
JWT_REFRESH_SECRET=REPLACE_DIFFERENT_64_BYTE_HEX
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://koola.vn
RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/home/anbinhfo1/koola.vn/uploads
EOF

# Tạo .env cho Web
cat > ~/koola.vn/web/.env << 'EOF'
NODE_ENV=production
API_BASE_URL_SERVER=http://127.0.0.1:4001
NEXT_PUBLIC_API_BASE_URL=https://koola.vn/api
EOF

# Bảo mật .env files
chmod 600 ~/koola.vn/api/.env
chmod 600 ~/koola.vn/web/.env
```

---

## Bước 7: Khởi chạy ứng dụng với PM2

```bash
ssh anbinhfo1@your-server-ip

# Copy ecosystem config vào home directory
cp ~/koola.vn/ecosystem.config.cjs ~/ecosystem.config.cjs

# Khởi động cả 2 processes
cd ~
pm2 start ecosystem.config.cjs

# Kiểm tra status
pm2 status

# Xem logs realtime
pm2 logs

# Lưu config để auto-start khi server reboot
pm2 save
pm2 startup  # copy-paste lệnh nó output ra và chạy với sudo
```

### Kiểm tra các ports đang chạy:

```bash
# API (Fastify)
curl http://127.0.0.1:4001/v1/health
# Expected: {"data":{"status":"ok",...}}

# Web (Next.js)
curl http://127.0.0.1:3001
# Expected: HTML content
```

---

## Bước 8: Cấu hình .htaccess (Apache Reverse Proxy)

File `deploy/.htaccess` đã được tạo sẵn. Copy vào document root:

```bash
cp ~/koola.vn/.htaccess ~/koola.vn/.htaccess.bak  # backup nếu đã có
```

Đảm bảo file `.htaccess` có nội dung từ `deploy/.htaccess` trong repo.

### Kiểm tra mod_proxy:

Nếu `.htaccess` không hoạt động (lỗi 500 hoặc proxy không forward):
1. Liên hệ hosting provider để bật `mod_proxy` và `mod_proxy_http`
2. Hoặc dùng **cPanel Node.js App** feature thay thế (xem bên dưới)

---

## Bước 9: Cấu hình cPanel Node.js App (Alternative)

Nếu hosting hỗ trợ **"Setup Node.js App"** (Phusion Passenger):

### Tạo App cho API:
1. cPanel → **Setup Node.js App** → **Create Application**
2. Node.js version: `18.x` hoặc `20.x`
3. Application mode: `Production`
4. Application root: `koola.vn/api`
5. Application URL: `koola.vn/api` _(nếu dùng subdomain path)_
6. Application startup file: `dist/index.js`
7. **Save** → **Run NPM Install**

### Tạo App cho Web:
1. **Create Application**
2. Node.js version: `20.x`
3. Application mode: `Production`
4. Application root: `koola.vn/web`
5. Application URL: `koola.vn`
6. Application startup file: `server.js`
7. **Save**

> ⚠️ **Lưu ý Passenger**: Passenger dùng port tự động, không cần chỉ định port thủ công. Cần điều chỉnh `.env` để bỏ `HOST`/`PORT` nếu Passenger quản lý.

---

## Bước 10: Kiểm tra sau deploy

```bash
# 1. Health check API
curl https://koola.vn/api/v1/health

# 2. Trang chủ
curl -I https://koola.vn/en

# 3. Kiểm tra HTTPS redirect
curl -I http://koola.vn
# Expected: 301 → https://koola.vn

# 4. Kiểm tra static assets
curl -I https://koola.vn/_next/static/...

# 5. Kiểm tra uploads
curl -I https://koola.vn/uploads/test.txt
```

---

## Troubleshooting

### Lỗi: "502 Bad Gateway" hoặc trang trắng
```bash
pm2 logs koola-web  # xem lỗi Next.js
pm2 logs koola-api  # xem lỗi Fastify
```

### Lỗi: Database connection failed
```bash
# Test connection từ server
cd ~/koola.vn/api
node -e "require('dotenv').config(); const {Pool}=require('pg'); new Pool({connectionString:process.env.DATABASE_URL}).query('SELECT 1').then(r=>console.log('✅ DB OK')).catch(e=>console.error('❌',e.message))"
```

### Lỗi: Port đã được dùng
```bash
lsof -i :4001  # xem process nào đang dùng port 4001
lsof -i :3001  # xem process nào đang dùng port 3001
pm2 delete all  # stop tất cả PM2 processes
pm2 start ecosystem.config.cjs  # restart
```

### Restart ứng dụng sau update:
```bash
# Upload file mới → giải nén → rồi:
pm2 restart koola-api
pm2 restart koola-web
```

---

## Checklist Deploy

- [ ] PostgreSQL database đã tạo và migrations đã chạy
- [ ] `koola-api-*.tar.gz` đã giải nén vào `~/koola.vn/api/`
- [ ] `koola-web-*.tar.gz` đã giải nén vào `~/koola.vn/web/`
- [ ] `~/koola.vn/api/.env` đã tạo với giá trị thực
- [ ] `~/koola.vn/web/.env` đã tạo với giá trị thực
- [ ] `~/koola.vn/.htaccess` đã upload
- [ ] `~/koola.vn/uploads/` directory đã tạo và có write permission
- [ ] PM2 đã start 2 processes (koola-api và koola-web)
- [ ] `pm2 save` và `pm2 startup` đã chạy
- [ ] `https://koola.vn/api/v1/health` trả về 200 OK
- [ ] `https://koola.vn/en` hiển thị trang chủ
- [ ] SSL certificate đã active (cPanel AutoSSL)
