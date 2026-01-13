# API Documentation

## 1. Public API

### A. Global (header/footer/settings)

#### Get Site Settings
```
GET /v1/site/settings
```
**Trả về:** nav header/footer, social links, CTA label/link, site meta

#### Get Navigation
```
GET /v1/nav?placement=header|footer&locale=en
```

✅ **Schema:** `site_settings` + `nav_items`

### B. Pages (Home/About/Contact/Careers content nếu dùng CMS)

#### Get Page by Slug
```
GET /v1/pages/:slug?locale=en
```
**Trả về:** page meta + sections (json payload, sort_order)

✅ **Schema:** `pages` + `page_sections`

### C. Services

#### List Services
```
GET /v1/services?locale=en&status=published&tag=ai&category=...&page=1&pageSize=9&sort=popular|order|newest
```

#### Get Service Detail
```
GET /v1/services/:slug?locale=en
```
**Trả về:**
- service core
- deliverables
- process_steps
- faqs
- related_services
- related_posts (sidebar "Read more") (optional)
- sidebar: tags list, ads list (nếu UI cần)

✅ **Schema:** `services` + `deliverables` + `process_steps` + `faqs` + `related` + `related_posts`

### D. Blog

#### List Posts
```
GET /v1/posts?locale=en&category=tech&tag=ai&q=...&page=1&pageSize=10&sort=newest
```

#### Get Post Detail
```
GET /v1/posts/:slug?locale=en
```
**Trả về:**
- post core + author
- categories + tags
- related posts (explicit) hoặc auto-related theo tags
- sidebar: categories list, tags list, ads list

✅ **Schema:** `posts` + `post_tags` + `post_categories` + `post_related`

### E. Careers

#### List Jobs
```
GET /v1/jobs?locale=en&status=published
```

#### Get Job Detail
```
GET /v1/jobs/:slug?locale=en
```
_(nếu bạn có job detail UI; nếu không thì chỉ list)_

#### Apply for Job
```
POST /v1/jobs/:slug/apply
```
_(nếu có form apply)_

✅ **Schema:** `job_posts` + `job_applications`

### F. Contact / Newsletter

#### Submit Contact Form
```
POST /v1/leads
```

#### Newsletter Subscription
```
POST /v1/newsletter/subscribe
POST /v1/newsletter/unsubscribe
```
_(optional)_

✅ **Schema:** `leads` + `newsletter_subscribers`

---

## 2. Admin API (CRUD)

### Authentication

```
POST /v1/admin/auth/login
POST /v1/admin/auth/refresh
POST /v1/admin/auth/logout
```

### CRUD Operations

#### Services
```
GET/POST/PUT/DELETE /v1/admin/services
```

#### Blog Posts
```
GET/POST/PUT/DELETE /v1/admin/posts
```

#### Categories
```
GET/POST/PUT/DELETE /v1/admin/categories
```

#### Tags
```
GET/POST/PUT/DELETE /v1/admin/tags
```

#### Pages
```
GET/POST/PUT/DELETE /v1/admin/pages
GET/POST/PUT/DELETE /v1/admin/pages/:id/sections
```

#### Navigation Items
```
GET/POST/PUT/DELETE /v1/admin/nav-items
```

#### Jobs
```
GET/POST/PUT/DELETE /v1/admin/jobs
```

#### Leads
```
GET /v1/admin/leads
PATCH /v1/admin/leads/:id/status
```

#### Newsletter Subscribers
```
GET /v1/admin/newsletter-subscribers
```

#### Media
```
POST /v1/admin/media (upload)
GET/DELETE /v1/admin/media/:id
```

#### Ads _(nếu bật ads)_
```
GET/POST/PUT/DELETE /v1/admin/ads
```

---

## 3. Database Adjustments

### A. Thiếu `updated_at` ở vài bảng child

Không bắt buộc, nhưng admin UI sẽ tiện hơn nếu có audit:

- `service_deliverables`, `service_process_steps`, `service_faqs` (nên có `created_at`)
- `ads` (đã có `created_at`, ✅ OK)
- `nav_items` (nên có `updated_at` nếu chỉnh nhiều)

### B. Category "kind" là text → nên ép giá trị

Hiện `categories.kind` là `text`. Bạn có thể giữ, nhưng admin nên validate chỉ nhận: `post` | `service` | `job`.

### C. "Author" của blog: dùng `users` hay bảng riêng?

Bạn dùng `users` làm author → ✅ OK (đỡ thêm bảng). Nếu sau này muốn author public không phải admin, mới cần tách.