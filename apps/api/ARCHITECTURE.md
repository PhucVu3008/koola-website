# KOOLA Backend - Layered Architecture

## 📐 Architecture Overview

Backend được xây dựng theo **Layered Architecture** (kiến trúc phân lớp) để đảm bảo:
- ✅ **Separation of Concerns**: Mỗi layer có trách nhiệm riêng biệt
- ✅ **Testability**: Dễ dàng test từng layer độc lập
- ✅ **Maintainability**: Dễ maintain và scale
- ✅ **Reusability**: Code có thể tái sử dụng

## 🏗️ Layers Breakdown

### 1. **Routes Layer** (`routes/`)
**Trách nhiệm**: Định nghĩa API endpoints và routing

```
routes/
├── public/          # Public API (no auth required)
│   ├── services.ts  # GET /v1/services, GET /v1/services/:slug
│   ├── posts.ts     # GET /v1/posts, GET /v1/posts/:slug
│   ├── pages.ts     # GET /v1/pages/:slug
│   ├── leads.ts     # POST /v1/leads
│   └── ...
└── admin/           # Admin API (auth required)
    └── auth.ts      # POST /v1/admin/auth/login, /refresh, /logout
```

**Rules**:
- ❌ KHÔNG có business logic
- ❌ KHÔNG trực tiếp gọi database
- ✅ CHỈ định nghĩa routes + validation schemas
- ✅ Delegate to controllers

---

### 2. **Middleware Layer** (`middleware/`)
**Trách nhiệm**: Cross-cutting concerns (auth, error handling, logging)

```
middleware/
├── auth.ts          # authenticate(), authorize(roles)
└── errorHandler.ts  # Global error handling
```

**Rules**:
- ✅ Xử lý request TRƯỚC khi tới controller
- ✅ Authentication & Authorization
- ✅ Error handling & transformation
- ❌ KHÔNG chứa business logic

---

### 3. **Controllers Layer** (`controllers/`)
**Trách nhiệm**: Xử lý HTTP request/response

```
controllers/
├── authController.ts     # login(), refresh(), logout()
├── serviceController.ts  # listServices(), getServiceBySlug()
├── postController.ts     # listPosts(), getPostBySlug()
└── leadController.ts     # createLead()
```

**Nhiệm vụ**:
1. Parse request (params, query, body)
2. Validate input (với Zod schemas)
3. Call appropriate service method
4. Format & return response
5. Handle errors

**Rules**:
- ❌ KHÔNG có business logic
- ❌ KHÔNG trực tiếp gọi database
- ✅ CHỈ xử lý request/response
- ✅ Delegate to services

**Example**:
```typescript
// controllers/serviceController.ts
export const listServices = async (request, reply) => {
  const query = request.query as ServiceListQuery;
  const result = await serviceService.listServices(query);
  
  return reply.send({
    data: result.services,
    meta: result.meta,
  });
};
```

---

### 4. **Services Layer** (`services/`)
**Trách nhiệm**: Business logic & orchestration

```
services/
├── authService.ts     # login(), refreshAccessToken(), logout()
├── serviceService.ts  # listServices(), getServiceBySlug()
├── postService.ts     # listPosts(), getPostBySlug()
└── leadService.ts     # createLead()
```

**Nhiệm vụ**:
1. Implement business rules
2. Orchestrate multiple repository calls
3. Transform/aggregate data
4. Return domain objects

**Rules**:
- ✅ Business logic ở ĐÂY
- ✅ Có thể gọi nhiều repositories
- ✅ Transform/aggregate data
- ❌ KHÔNG trực tiếp execute SQL
- ❌ KHÔNG biết về HTTP (request/response)

**Example**:
```typescript
// services/serviceService.ts
export const getServiceBySlug = async (slug: string, locale: string) => {
  // Business logic: get service + all related data
  const service = await serviceRepository.findBySlug(slug, locale);
  if (!service) return null;
  
  // Orchestrate multiple repository calls
  const [tags, deliverables, faqs, sidebar] = await Promise.all([
    serviceRepository.getServiceTags(service.id, locale),
    serviceRepository.getServiceDeliverables(service.id),
    serviceRepository.getServiceFaqs(service.id),
    sidebarRepository.getAds('service_detail'),
  ]);
  
  // Aggregate & return
  return { service, tags, deliverables, faqs, sidebar };
};
```

---

### 5. **Repositories Layer** (`repositories/`)
**Trách nhiệm**: Data access ONLY

```
repositories/
├── userRepository.ts       # findByEmail(), updateLastLogin()
├── tokenRepository.ts      # createRefreshToken(), findRefreshToken()
├── serviceRepository.ts    # findServices(), findBySlug(), getServiceTags()
├── postRepository.ts       # findPosts(), findBySlug(), getPostTags()
├── sidebarRepository.ts    # getCategories(), getTags(), getAds()
└── leadRepository.ts       # create()
```

**Nhiệm vụ**:
1. Execute SQL queries
2. Map database rows to objects
3. Return plain data

**Rules**:
- ❌ KHÔNG có business logic
- ✅ CHỈ execute SQL queries
- ✅ Use parameterized queries ($1, $2, ...)
- ✅ Import SQL từ `sql/queries.ts`

**Example**:
```typescript
// repositories/serviceRepository.ts
export const findBySlug = async (slug: string, locale: string) => {
  return await queryOne(SQL.GET_SERVICE_BY_SLUG, [slug, locale]);
};

export const getServiceTags = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_TAGS, [serviceId, locale]);
};
```

---

### 6. **SQL Layer** (`sql/`)
**Trách nhiệm**: All raw SQL queries

```
sql/
└── queries.ts  # All SQL queries as constants
```

**Rules**:
- ✅ Raw SQL ONLY
- ✅ Parameterized queries ($1, $2, ...)
- ❌ NEVER string concatenation
- ✅ Well-formatted & readable

**Example**:
```typescript
// sql/queries.ts
export const GET_SERVICE_BY_SLUG = `
  SELECT 
    id, locale, title, slug, excerpt, content_md, 
    hero_asset_id, og_asset_id, status, published_at,
    seo_title, seo_description, canonical_url
  FROM services
  WHERE slug = $1 AND locale = $2 AND status = 'published'
`;

export const GET_SERVICE_TAGS = `
  SELECT t.id, t.name, t.slug
  FROM tags t
  INNER JOIN service_tags st ON t.id = st.tag_id
  WHERE st.service_id = $1 AND t.locale = $2
`;
```

---

### 7. **Schemas Layer** (`schemas/`)
**Trách nhiệm**: Input validation với Zod

```
schemas/
└── index.ts  # All Zod schemas
```

**Rules**:
- ✅ Validate ALL user inputs
- ✅ Type-safe với TypeScript
- ✅ Export schema + inferred types

---

### 8. **DB Layer** (`db/`)
**Trách nhiệm**: Database connection & helpers

```
db/
└── index.ts  # pool, query(), queryOne(), transaction()
```

---

## 🔄 Request Flow Example

**Request**: `GET /v1/services/ai-chatbot-development?locale=en`

```
1. Route (routes/public/services.ts)
   ↓ Match route pattern + validate query params
   
2. Controller (controllers/serviceController.ts)
   ↓ Parse request.params.slug + request.query.locale
   ↓ Call service: serviceService.getServiceBySlug(slug, locale)
   
3. Service (services/serviceService.ts)
   ↓ Business logic: get service + all related data
   ↓ Call multiple repositories in parallel:
   ↓   - serviceRepository.findBySlug()
   ↓   - serviceRepository.getServiceTags()
   ↓   - serviceRepository.getServiceDeliverables()
   ↓   - sidebarRepository.getAds()
   ↓ Aggregate results
   
4. Repository (repositories/serviceRepository.ts)
   ↓ Execute SQL queries
   ↓ Use SQL.GET_SERVICE_BY_SLUG, SQL.GET_SERVICE_TAGS, etc.
   
5. Database (PostgreSQL)
   ↓ Execute parameterized queries
   ↓ Return rows
   
6. Response
   ↓ Controller formats response
   ↓ Return JSON: { data: { service, tags, deliverables, ... } }
```

---

## ✅ Best Practices

### DO's ✅
- ✅ Keep layers separated
- ✅ Each layer has single responsibility
- ✅ Use Zod for validation
- ✅ Raw SQL with parameterized queries
- ✅ Use transactions for multi-table writes
- ✅ Return consistent response format
- ✅ Handle errors properly

### DON'Ts ❌
- ❌ Business logic in controllers
- ❌ SQL in services
- ❌ HTTP handling in services
- ❌ String concatenation in SQL
- ❌ Skipping layers (e.g., route → repository directly)

---

## 📊 Dependency Flow

```
Routes 
  ↓ (depends on)
Controllers
  ↓ (depends on)
Services
  ↓ (depends on)
Repositories
  ↓ (depends on)
SQL + DB
```

**Rule**: Lower layers KHÔNG biết về upper layers
- ❌ Repository KHÔNG biết về Service
- ❌ Service KHÔNG biết về Controller
- ❌ Controller KHÔNG biết về Route

---

## 🧪 Testing Strategy

Với layered architecture, mỗi layer có thể test độc lập:

- **Unit Tests**: Services (mock repositories)
- **Integration Tests**: Repositories (test với real DB)
- **E2E Tests**: Routes (test full flow)

---

## 📝 Summary

| Layer | Responsibility | Can Call | Cannot Call |
|-------|---------------|----------|-------------|
| Routes | Define endpoints | Controllers | Services, Repositories |
| Controllers | Handle HTTP | Services | Repositories, SQL |
| Services | Business logic | Repositories | SQL directly |
| Repositories | Data access | SQL, DB | Nothing (leaf layer) |

**Key Principle**: **Separation of Concerns** - mỗi layer làm 1 việc và làm tốt việc đó!

---

**Built with ❤️ following Clean Architecture principles**
