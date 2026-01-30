# IP Blocking Feature Documentation

## Overview

Tính năng **IP Blocking** bảo vệ admin login endpoint khỏi brute-force attacks bằng cách tự động chặn IP sau nhiều lần đăng nhập thất bại.

## Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| Max Failed Attempts | **5** | Số lần đăng nhập sai tối đa |
| Time Window | **5 phút** | Khoảng thời gian đếm failed attempts |
| Block Duration | **30 giây** | Thời gian block IP sau khi vượt quá giới hạn |

## How It Works

### Flow Diagram

```
User Request → Rate Limiter → IP Blocking Check → Auth Handler → Record Attempt
                 ↓ (429)         ↓ (429)             ↓ (401/200)        ↓
              Too Many        IP Blocked         Login Failed/Success  Database
              Requests        (retry in 30s)
```

### Detailed Flow

1. **Request arrives** at `POST /v1/admin/auth/login`
2. **Rate limiter** checks (10 requests/minute) - applies to ALL requests
3. **IP blocking middleware** (`checkIPBlocking`) checks:
   - Query DB: count failed attempts in last 5 minutes for this IP
   - If < 5 attempts: proceed to handler
   - If >= 5 attempts: check if 30 seconds have passed since last attempt
     - Still within 30s: return 429 with `Retry-After` header
     - After 30s: allow request (block expired)
4. **Auth handler** validates credentials
5. **Record attempt** in database (success or failure)

## Database Schema

### `login_attempts` Table

```sql
CREATE TABLE login_attempts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100)
);
```

**Indexes:**
- `idx_login_attempts_ip_time`: Fast IP-based queries
- `idx_login_attempts_email_time`: Admin analytics
- `idx_login_attempts_attempted_at`: Cleanup queries

## API Behavior

### Scenario 1: Normal Failed Login (< 5 attempts)

**Request:**
```bash
curl -X POST http://localhost:4000/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrongpass"}'
```

**Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

### Scenario 2: IP Blocked (>= 5 attempts within 5 minutes)

**Request:**
```bash
curl -X POST http://localhost:4000/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@koola.com","password":"wrongpass"}'
```

**Response (429):**
```json
{
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Too many failed login attempts. Please try again in 29 seconds.",
    "details": {
      "ip_address": "172.22.0.1",
      "blocked_until": "2026-01-26T02:27:15.460Z",
      "retry_after_seconds": 29
    }
  }
}
```

**Headers:**
```
HTTP/1.1 429 Too Many Requests
Retry-After: 29
```

### Scenario 3: Successful Login (resets tracking)

**Request:**
```bash
curl -X POST http://localhost:4000/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@koola.com","password":"admin123"}'
```

**Response (200):**
```json
{
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "admin@koola.com",
      "full_name": "Admin User",
      "roles": [{"id": 1, "name": "admin"}]
    }
  }
}
```

**Note:** Successful login is recorded with `success=true`, but IP is NOT immediately unblocked. The 30-second block must expire naturally.

## Security Features

### ✅ What We Protect Against

- **Brute-force password attacks**: Auto-block after 5 failed attempts
- **Distributed attacks**: Each IP tracked independently
- **Account enumeration**: Generic error message ("Invalid email or password")
- **Multi-instance deployments**: Uses database, not in-memory store

### ⚠️ Limitations

- **IP spoofing**: If not behind a trusted proxy, X-Forwarded-For can be faked
- **Shared IPs**: Multiple users behind same NAT/proxy share same IP
- **VPN switching**: Attacker can switch VPN servers to get new IP

### 🔒 Recommended Additional Measures

1. **CAPTCHA** after 3 failed attempts (before IP block)
2. **Email notifications** for failed login attempts
3. **2FA/MFA** for admin accounts
4. **Cloudflare Bot Management** to detect automated tools
5. **Fail2ban** at infrastructure level

## Implementation Files

| File | Purpose |
|------|---------|
| `migrations/012_create_login_attempts.sql` | Create database table |
| `apps/api/src/sql/admin/loginAttempts.ts` | SQL queries |
| `apps/api/src/repositories/loginAttemptRepository.ts` | Database operations |
| `apps/api/src/middleware/ipBlocking.ts` | Middleware logic |
| `apps/api/src/controllers/authController.ts` | Record attempts |
| `apps/api/src/routes/admin/auth.ts` | Apply middleware |

## Testing

### Manual Test

```bash
# Run automated test script
./apps/api/tests/test-ip-blocking.sh
```

**Expected behavior:**
1. First 5 attempts: 401 (login failed)
2. 6th attempt: 429 (IP blocked)
3. Wait 30 seconds
4. 7th attempt: 401 (login failed, block expired)

### Check Database

```bash
docker exec -i koola-postgres psql -U koola_user -d koola_db -c \
  "SELECT * FROM login_attempts ORDER BY attempted_at DESC LIMIT 10;"
```

### Simulate Different IPs (for testing)

```bash
# Use different proxies or VPN to test multi-IP scenarios
curl -X POST http://localhost:4000/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 1.2.3.4" \
  -d '{"email":"test@test.com","password":"wrong"}'
```

**Note:** X-Forwarded-For only works if API trusts the proxy (configure in Fastify).

## Monitoring & Analytics

### Query Failed Login Attempts by IP

```sql
SELECT 
  ip_address,
  COUNT(*) as attempt_count,
  MIN(attempted_at) as first_attempt,
  MAX(attempted_at) as last_attempt
FROM login_attempts
WHERE success = false
  AND attempted_at >= NOW() - INTERVAL '1 hour'
GROUP BY ip_address
ORDER BY attempt_count DESC;
```

### Query Failed Login Attempts by Email

```sql
SELECT 
  email,
  ip_address,
  attempted_at,
  failure_reason
FROM login_attempts
WHERE email = 'admin@koola.com'
  AND success = false
ORDER BY attempted_at DESC
LIMIT 20;
```

### Query Most Attacked Accounts

```sql
SELECT 
  email,
  COUNT(*) as failed_attempts,
  COUNT(DISTINCT ip_address) as unique_ips
FROM login_attempts
WHERE success = false
  AND attempted_at >= NOW() - INTERVAL '1 day'
GROUP BY email
ORDER BY failed_attempts DESC
LIMIT 10;
```

## Maintenance

### Database Cleanup (Recommended: Daily Cron Job)

```sql
-- Delete attempts older than 30 days
DELETE FROM login_attempts
WHERE attempted_at < NOW() - INTERVAL '30 days';
```

**Via repository function:**
```typescript
import { cleanupOldAttempts } from './repositories/loginAttemptRepository';

// Delete attempts older than 30 days
const deletedCount = await cleanupOldAttempts(30);
console.log(`Deleted ${deletedCount} old login attempts`);
```

**Via cron job (example):**
```bash
# Add to crontab
0 2 * * * docker exec koola-postgres psql -U koola_user -d koola_db \
  -c "DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '30 days';"
```

## Configuration Changes

### Change Block Duration

Edit `apps/api/src/middleware/ipBlocking.ts`:

```typescript
const IP_BLOCK_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  ATTEMPT_WINDOW_MINUTES: 5,
  BLOCK_DURATION_SECONDS: 60, // Change from 30 to 60 seconds
};
```

### Change Max Attempts

```typescript
const IP_BLOCK_CONFIG = {
  MAX_FAILED_ATTEMPTS: 3, // Change from 5 to 3 attempts
  ATTEMPT_WINDOW_MINUTES: 5,
  BLOCK_DURATION_SECONDS: 30,
};
```

**Note:** No restart needed if using tsx watch (hot reload).

## Troubleshooting

### Issue: IP not blocked after 5 attempts

**Possible causes:**
1. Attempts spread over > 5 minutes (outside time window)
2. Middleware not applied to route
3. Database query error (check logs)

**Debug:**
```bash
# Check middleware is applied
cat apps/api/src/routes/admin/auth.ts | grep checkIPBlocking

# Check database
docker exec -i koola-postgres psql -U koola_user -d koola_db -c \
  "SELECT COUNT(*), success FROM login_attempts WHERE ip_address='172.22.0.1' AND attempted_at >= NOW() - INTERVAL '5 minutes' GROUP BY success;"
```

### Issue: IP blocked indefinitely

**Possible causes:**
1. Block duration check has bug
2. Last attempt timestamp not updating

**Fix:**
```sql
-- Manually clear block
DELETE FROM login_attempts WHERE ip_address = '172.22.0.1';
```

### Issue: Different IPs not blocked independently

**Check IP detection:**
```bash
# Add logging to getClientIP function
console.log('Detected IP:', ipAddress);
```

## Production Deployment Checklist

- [ ] Migration applied to production database
- [ ] Indexes created for performance
- [ ] Daily cleanup cron job configured
- [ ] Monitoring alerts set up (e.g., >100 failed attempts/hour)
- [ ] Cloudflare or WAF configured (optional)
- [ ] API behind trusted proxy with correct X-Forwarded-For
- [ ] Rate limiter configured (already done: 10 req/min)
- [ ] JWT expiry set to 15 minutes (already done)
- [ ] Test IP blocking in staging environment

## Summary

✅ **IP Blocking fully implemented and tested**
- Blocks IP for 30 seconds after 5 failed login attempts within 5 minutes
- Uses database (not in-memory) for multi-instance support
- Compatible with Docker deployment
- Works alongside existing rate limiter (10 req/min)
- Includes automated test script
- Full documentation and monitoring queries provided

🔐 **Security posture improved significantly!**
