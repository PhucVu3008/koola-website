# User Management - Quick Reference

**Date**: 2026-01-30  
**Status**: ✅ Production Ready

---

## Quick Access

**Admin Panel**: http://localhost:3000/admin/en/users  
**API Base**: http://localhost:4000/v1/admin/users

---

## Roles & Permissions

| Role | User Management | Content Management |
|------|----------------|-------------------|
| **Admin** | ✅ Full (CRUD) | ✅ Full |
| **Manager** | 👁️ Read-only | ✅ Full |
| **Editor** | ❌ No access | ✅ Full |

---

## API Endpoints

```
GET    /v1/admin/users                    # List users
GET    /v1/admin/users/:id                # Get user
GET    /v1/admin/users/roles              # List roles
POST   /v1/admin/users                    # Create user (admin)
PUT    /v1/admin/users/:id                # Update user (admin)
DELETE /v1/admin/users/:id                # Delete user (admin)
PUT    /v1/admin/users/:id/password       # Change password (admin)
PUT    /v1/admin/users/:id/toggle-active  # Toggle status (admin)
```

---

## Create User (curl)

```bash
curl -X POST http://localhost:4000/v1/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new-user@example.com",
    "password": "password123",
    "full_name": "New User",
    "role_ids": [3],
    "is_active": true
  }'
```

---

## Role IDs

- `1` = Admin
- `2` = Editor  
- `3` = Manager

---

## Frontend Pages

```
/admin/en/users              # List
/admin/en/users/new          # Create
/admin/en/users/:id          # Edit
/admin/en/users/:id/password # Change password
```

---

## Key Files

**Backend:**
- `apps/api/src/controllers/adminUserController.ts`
- `apps/api/src/services/adminUserService.ts`
- `apps/api/src/routes/admin/users.ts`
- `apps/api/src/schemas/users.schemas.ts`

**Frontend:**
- `apps/web/app/admin/[locale]/users/page.tsx`
- `apps/web/components/admin/UserForm.tsx`
- `apps/web/src/lib/admin-api.ts`

**Database:**
- `migrations/018_add_manager_role.sql`

---

## Common Tasks

### Create Manager User
```sql
INSERT INTO users (email, password_hash, full_name) 
VALUES ('manager@example.com', '$2b$10$hash...', 'Manager');

INSERT INTO user_roles (user_id, role_id) 
VALUES (LAST_INSERT_ID(), 3);
```

### Check User Roles
```sql
SELECT u.email, r.name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id;
```

### List All Permissions
```sql
SELECT 
  r.name as role,
  r.description
FROM roles r
ORDER BY r.id;
```

---

## Security Rules

✅ **Self-Protection**
- Cannot delete own account
- Cannot deactivate own account  
- Cannot remove own admin role

✅ **Password Security**
- Minimum 8 characters
- Bcrypt hashing (10 rounds)
- Never stored in plain text

✅ **Permission Enforcement**
- Route-level authorization checks
- Role-based access control (RBAC)
- Detailed error messages

---

## Validation

**Required Fields:**
- ✅ Email (valid format)
- ✅ Password (min 8 chars on create)
- ✅ Full name (not empty)
- ✅ At least one role

**Optional Fields:**
- Active status (default: true)

---

## Error Messages

| Code | Message | Fix |
|------|---------|-----|
| `VALIDATION_ERROR` | Email already exists | Use different email |
| `VALIDATION_ERROR` | Password must be at least 8 characters | Use longer password |
| `VALIDATION_ERROR` | At least one role is required | Select role |
| `FORBIDDEN` | Cannot delete your own account | Use different admin |
| `UNAUTHORIZED` | Authentication required | Login again |

---

## Testing Checklist

- [ ] Login as admin
- [ ] View users list
- [ ] Filter by role
- [ ] Filter by status
- [ ] Create new user
- [ ] Edit existing user
- [ ] Change user password
- [ ] Toggle user active/inactive
- [ ] Delete user
- [ ] Try as manager (read-only)
- [ ] Try as editor (no access)

---

## Maintenance

### Restart API
```bash
docker-compose restart api
```

### Run Migration
```bash
cat migrations/018_add_manager_role.sql | \
  docker-compose exec -T postgres psql -U koola_user -d koola_db
```

### Check Logs
```bash
docker-compose logs api --tail=100 | grep -i user
```

---

**Full Documentation**: `2026-01-30_USER_MANAGEMENT_SYSTEM.md`
