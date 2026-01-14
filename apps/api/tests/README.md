# API Tests

This folder contains lightweight test artifacts for KOOLA API.

## 1) Manual HTTP tests (recommended)

Open `apps/api/tests/api.http` in VS Code and run requests using the **REST Client** extension.

Covers:
- Public endpoints: services, posts, nav, site settings
- Form endpoints: leads, newsletter subscribe/unsubscribe (incl. rate-limit behavior)
- Admin auth: login/refresh/logout
- Validation error cases (expects 400)
- Not found cases (expects 404)

## 2) What to verify (REST expectations)

- Success response shape: `{ "data": ..., "meta"?: ... }`
- Error response shape: `{ "error": { "code": ..., "message": ..., "details"?: ... } }`
- Status codes:
  - 200 OK (read)
  - 201 Created (create)
  - 400 Validation
  - 401 Unauthorized
  - 404 Not Found
  - 429 Too Many Requests (rate-limit)

## Notes

- Some endpoints require sample slugs that exist in `seed.sql`.
  If a slug differs, adjust the request URL in `api.http` accordingly.
