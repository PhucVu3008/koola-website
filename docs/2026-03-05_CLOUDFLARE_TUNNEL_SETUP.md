# 2026-03-05_CLOUDFLARE_TUNNEL_SETUP.md

# Hướng dẫn: Deploy koola.vn từ máy local qua Cloudflare Tunnel

## Tổng quan kiến trúc

```
Internet
  └─► koola.vn (Cloudflare DNS)
        └─► Cloudflare Tunnel (mã hóa, miễn phí)
              └─► Máy local của bạn
                    └─► Docker container: nginx:80
                          ├─► /api/* → koola-api:4000 (Fastify)
                          └─► /*     → koola-web:3000 (Next.js)
```

**Ưu điểm:**
- Miễn phí hoàn toàn
- Không cần IP tĩnh
- Không cần mở port trên router
- HTTPS tự động (Cloudflare lo)
- Máy tắt thì website tắt (phù hợp demo/dev production)

---

## PHẦN 1: Chuẩn bị Cloudflare

### Bước 1: Chuyển DNS koola.vn về Cloudflare (bắt buộc)

1. Vào [https://dash.cloudflare.com](https://dash.cloudflare.com) → **Sign up** (free)
2. **Add a Site** → nhập `koola.vn` → chọn gói **Free**
3. Cloudflare sẽ hiển thị **2 nameserver**, ví dụ:
   ```
   aria.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```
4. Vào cPanel 123HOST → **Zone Editor** hoặc liên hệ 123HOST để đổi nameserver của `koola.vn` thành 2 nameserver Cloudflare cung cấp
5. Chờ 15-30 phút để DNS propagate

### Bước 2: Tạo Cloudflare Tunnel

1. Vào [https://one.dash.cloudflare.com](https://one.dash.cloudflare.com) (Cloudflare Zero Trust)
2. Chọn account → **Networks** → **Tunnels** → **Create a tunnel**
3. Chọn **Cloudflared** → đặt tên: `koola-local`
4. **Save tunnel**
5. Chọn môi trường: **Docker**
6. Cloudflare hiển thị lệnh dạng:
   ```
   docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run \
     --token eyJhxxx...VERY_LONG_TOKEN
   ```
7. **Copy phần token** (chuỗi dài sau `--token`) → đây là `CLOUDFLARE_TUNNEL_TOKEN`

### Bước 3: Cấu hình Public Hostname cho Tunnel

Sau khi tạo tunnel, cấu hình routing:

| Subdomain | Domain | Type | URL |
|---|---|---|---|
| (để trống) | koola.vn | HTTP | http://nginx:80 |
| www | koola.vn | HTTP | http://nginx:80 |

> Cloudflare Tunnel kết nối trực tiếp vào container nginx trong Docker network,
> nhưng vì cloudflared chạy trong cùng Docker network, URL đích là `http://nginx:80`.
>
> Nếu không nhận được nginx, dùng: `http://host.docker.internal:80`

---

## PHẦN 2: Chuẩn bị máy local

### Bước 4: Tạo JWT Secrets

Mở Terminal trên máy Mac, chạy:

```bash
# Tạo JWT_ACCESS_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Tạo JWT_REFRESH_SECRET (chạy lại lần nữa)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy 2 giá trị ra.

### Bước 5: Điền secrets vào .env.production.local

Mở file `.env.production.local` trong project:

```bash
# Mở bằng VS Code
code /Users/vunam/Downloads/koola/koola-website/.env.production.local
```

Điền đầy đủ:
```bash
POSTGRES_PASSWORD=koola_prod_StrongPass_2026!
JWT_ACCESS_SECRET=<giá trị từ bước 4, lần 1>
JWT_REFRESH_SECRET=<giá trị từ bước 4, lần 2>
CLOUDFLARE_TUNNEL_TOKEN=<token từ bước 2>
```

### Bước 6: Tạo .env.production cho web

Mở file `apps/web/.env.production`:

```bash
NODE_ENV=production
API_BASE_URL_SERVER=http://api:4000
NEXT_PUBLIC_API_BASE_URL=https://koola.vn/api
```

---

## PHẦN 3: Build và chạy

### Bước 7: Chạy lần đầu (build + start)

```bash
cd /Users/vunam/Downloads/koola/koola-website

# Build tất cả images và khởi động
docker compose -f docker-compose.production.yml \
  --env-file .env.production.local \
  up -d --build
```

Lần đầu sẽ mất 5-10 phút để build Next.js.

### Bước 8: Theo dõi logs

```bash
# Xem tất cả logs
docker compose -f docker-compose.production.yml logs -f

# Chỉ xem web logs
docker compose -f docker-compose.production.yml logs -f web

# Chỉ xem API logs
docker compose -f docker-compose.production.yml logs -f api

# Chỉ xem tunnel logs
docker compose -f docker-compose.production.yml logs -f cloudflared
```

### Bước 9: Chạy Database Migrations

Sau khi postgres khởi động xong:

```bash
# Chạy init schema + migrations
docker compose -f docker-compose.production.yml exec postgres \
  psql -U koola_user -d koola_db -f /docker-entrypoint-initdb.d/init.sql

# Chạy từng migration (005 → 019)
for f in migrations/*.sql; do
  echo "Running $f..."
  docker compose -f docker-compose.production.yml exec -T postgres \
    psql -U koola_user -d koola_db < "$f"
done

# Chạy seed data
docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U koola_user -d koola_db < seed.sql
```

### Bước 10: Kiểm tra

```bash
# Kiểm tra tất cả containers đang chạy
docker compose -f docker-compose.production.yml ps

# Test API local
curl http://localhost/api/v1/health

# Test domain (sau khi Cloudflare Tunnel kết nối)
curl https://koola.vn/api/v1/health
```

---

## PHẦN 4: Lệnh quản lý hàng ngày

```bash
# Khởi động (không rebuild)
docker compose -f docker-compose.production.yml --env-file .env.production.local up -d

# Dừng tất cả
docker compose -f docker-compose.production.yml down

# Restart một service
docker compose -f docker-compose.production.yml restart web
docker compose -f docker-compose.production.yml restart api

# Rebuild sau khi thay đổi code
docker compose -f docker-compose.production.yml --env-file .env.production.local up -d --build web
docker compose -f docker-compose.production.yml --env-file .env.production.local up -d --build api

# Xem trạng thái
docker compose -f docker-compose.production.yml ps

# Xem resource usage
docker stats
```

---

## Troubleshooting

### Lỗi: "CLOUDFLARE_TUNNEL_TOKEN is required"
→ Chưa điền token vào `.env.production.local`

### Lỗi: Next.js build failed
```bash
# Xem chi tiết lỗi
docker compose -f docker-compose.production.yml logs web
```
Thường do thiếu env vars — kiểm tra `apps/web/.env.production`

### Lỗi: Cannot connect to database
```bash
docker compose -f docker-compose.production.yml logs postgres
docker compose -f docker-compose.production.yml logs api
```

### Website chưa hiện trên koola.vn
1. Kiểm tra tunnel đã kết nối chưa: `docker compose -f docker-compose.production.yml logs cloudflared`
2. Kiểm tra DNS đã trỏ về Cloudflare chưa: `nslookup koola.vn`
3. Thử truy cập `http://localhost` xem Nginx có chạy không

### Máy tắt → website tắt
Đây là giới hạn của giải pháp chạy local. Để website luôn online, cần:
- Chuyển sang VPS (123HOST VPS ~100k/tháng)
- Hoặc để máy chạy 24/7

---

## Checklist hoàn chỉnh

- [ ] DNS koola.vn đã chuyển về Cloudflare nameservers
- [ ] Cloudflare Tunnel đã tạo và có token
- [ ] `.env.production.local` đã điền đủ 4 biến
- [ ] `apps/web/.env.production` đã điền đúng
- [ ] `docker compose ... up -d --build` chạy thành công
- [ ] `docker compose ps` hiển thị 5 containers đều `Up`
- [ ] `curl http://localhost/api/v1/health` trả về 200
- [ ] `https://koola.vn` hiển thị trang web
