# KOOLA API Backend

Backend API cho dự án KOOLA website - được xây dựng với Fastify, PostgreSQL và TypeScript theo kiến trúc **layered architecture** chuẩn.

## 🏗️ Tech Stack

- **Framework**: Fastify 4.x
- **Database**: PostgreSQL 16 (raw SQL only, no ORM)
- **Language**: TypeScript
- **Validation**: Zod
- **Authentication**: JWT + Refresh Tokens
- **File Upload**: @fastify/multipart
- **Rate Limiting**: @fastify/rate-limit

## 📁 Cấu trúc thư mục (Layered Architecture)

```
apps/api/
├── src/
│   ├── index.ts                 # Entry point
│   ├── server.ts                # Fastify server setup & plugins
│   │
│   ├── middleware/              # 🔒 Middleware layer
│   │   ├── auth.ts             # JWT authentication & authorization
│   │   └── errorHandler.ts    # Global error handling
│   │
│   ├── controllers/             # 🎮 Controller layer (request/response handling)
│   │   ├── authController.ts
│   │   ├── serviceController.ts
│   │   ├── postController.ts
│   │   └── leadController.ts
│   │
│   ├── services/                # 💼 Service layer (business logic)
│   │   ├── authService.ts
│   │   ├── serviceService.ts
│   │   ├── postService.ts
│   │   └── leadService.ts
│   │
│   ├── repositories/            # 🗄️ Repository layer (data access)
│   │   ├── userRepository.ts
│   │   ├── tokenRepository.ts
│   │   ├── serviceRepository.ts
│   │   ├── postRepository.ts
│   │   ├── sidebarRepository.ts
│   │   └── leadRepository.ts
│   │
│   ├── routes/                  # 🛣️ Route definitions
│   │   ├── public/             # Public API routes
│   │   │   ├── index.ts
│   │   │   ├── services.ts
│   │   │   ├── posts.ts
│   │   │   ├── pages.ts
│   │   │   ├── nav.ts
│   │   │   ├── site.ts
│   │   │   ├── leads.ts
│   │   │   ├── newsletter.ts
│   │   │   └── jobs.ts
│   │   └── admin/              # Admin API routes
│   │       ├── index.ts
│   │       └── auth.ts
│   │
│   ├── schemas/                 # ✅ Zod validation schemas
│   │   └── index.ts
│   │
│   ├── sql/                     # 📝 Raw SQL queries
│   │   └── queries.ts
│   │
│   └── db/                      # 🔌 Database connection & helpers
│       └── index.ts
│
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md (this file)
```

## 🎯 Kiến trúc Layers

### 1️⃣ **Routes Layer** (`routes/`)
- Định nghĩa endpoints
- Gắn validation schemas
- Kết nối với controllers
- **KHÔNG chứa business logic**

```typescript
// routes/public/services.ts
server.get('/', {
  schema: { querystring: serviceListQuerySchema },
  handler: serviceController.listServices,
});
```

### 2️⃣ **Controllers Layer** (`controllers/`)
- Xử lý request/response
- Parse & validate input (với Zod)
- Gọi services
- Format response
- **KHÔNG chứa business logic**

```typescript
// controllers/serviceController.ts
export const listServices = async (request, reply) => {
  const query = request.query as ServiceListQuery;
  const result = await serviceService.listServices(query);
  return reply.send({ data: result.services, meta: result.meta });
};
```

### 3️⃣ **Services Layer** (`services/`)
- Business logic
- Orchestrate nhiều repository calls
- Transform data
- **KHÔNG trực tiếp access database**

```typescript
// services/serviceService.ts
export const listServices = async (query) => {
  const total = await serviceRepository.countServices(filters);
  const services = await serviceRepository.findServices(filters);
  return { services, meta: buildPaginationMeta(...) };
};
```

### 4️⃣ **Repositories Layer** (`repositories/`)
- Data access only
- Execute SQL queries
- **KHÔNG chứa business logic**
- Raw SQL với parameterized queries

```typescript
// repositories/serviceRepository.ts
export const findServices = async (filters) => {
  return await query(SQL.LIST_SERVICES, [...params]);
};
```

### 5️⃣ **SQL Layer** (`sql/`)
- Tất cả raw SQL queries
- Parameterized ($1, $2, ...)
- **KHÔNG hard-code user input**

```typescript
// sql/queries.ts
export const LIST_SERVICES = `
  SELECT ...
  WHERE locale = $1 AND status = $2
  LIMIT $3 OFFSET $4
`;
```

### 6️⃣ **Middleware Layer** (`middleware/`)
- Authentication (`authenticate`, `authorize`)
- Error handling
- Request logging
- Rate limiting

```typescript
// middleware/auth.ts
export const authenticate = async (request, reply) => {
  await request.jwtVerify();
};
```

## 🚀 Data Flow

```
Request 
  ↓
Routes (validation) 
  ↓
Middleware (auth, etc.)
  ↓
Controller (parse request)
  ↓
Service (business logic)
  ↓
Repository (data access)
  ↓
Database (PostgreSQL)
  ↓
Response (formatted by Controller)
```

## 🚀 Cài đặt & Chạy

### Development (Local)

1. **Install dependencies**:
```bash
cd apps/api
npm install
```

2. **Setup environment**:
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

3. **Run development server**:
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:4000`

### Development (Docker)

Từ root directory của project:

```bash
docker-compose up -d
```

Services:
- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050` (admin@koola.local / admin)

### Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Public API (`/v1`)

#### Services
- `GET /v1/services` - List services
- `GET /v1/services/:slug` - Get service detail (bundled with deliverables, FAQs, related, sidebar)

#### Posts/Blog
- `GET /v1/posts` - List posts
- `GET /v1/posts/:slug` - Get post detail (bundled with tags, categories, related, sidebar)

#### Pages
- `GET /v1/pages/:slug` - Get page by slug

#### Navigation & Settings
- `GET /v1/nav?placement=header|footer` - Get navigation items
- `GET /v1/site/settings` - Get site settings & nav

#### Forms
- `POST /v1/leads` - Submit contact form
- `POST /v1/newsletter/subscribe` - Subscribe to newsletter
- `POST /v1/newsletter/unsubscribe` - Unsubscribe from newsletter

#### Jobs
- `GET /v1/jobs` - List jobs
- `GET /v1/jobs/:slug` - Get job detail

### Admin API (`/v1/admin`)

#### Authentication
- `POST /v1/admin/auth/login` - Login (returns access + refresh tokens)
- `POST /v1/admin/auth/refresh` - Refresh access token
- `POST /v1/admin/auth/logout` - Logout (revoke refresh token)

#### Protected Routes (TODO)
- Services CRUD
- Posts CRUD
- Categories/Tags CRUD
- Media management
- Pages/Sections CRUD
- Nav items CRUD
- Site settings CRUD
- Leads management
- Newsletter subscribers management

## 🔐 Authentication Flow

1. **Login**: POST `/v1/admin/auth/login` với email + password
   - Response: `{ accessToken, refreshToken, user }`
   
2. **Protected requests**: Gửi `Authorization: Bearer <accessToken>` header

3. **Refresh**: Khi accessToken hết hạn, POST `/v1/admin/auth/refresh` với `{ refreshToken }`
   - Response: `{ accessToken }` mới

4. **Logout**: POST `/v1/admin/auth/logout` với `{ refreshToken }`

## 📦 Response Format

### Success
```json
{
  "data": { ... },
  "meta": { 
    "page": 1, 
    "pageSize": 10, 
    "total": 100, 
    "totalPages": 10 
  }
}
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR|NOT_FOUND|UNAUTHORIZED|FORBIDDEN|INTERNAL",
    "message": "Error message",
    "details": { ... }
  }
}
```

## 🗃️ Database

- **Raw SQL only** - Không sử dụng ORM
- Parameterized queries (`$1, $2, ...`)
- Transactions cho multi-table operations
- Migration files: plain `.sql` files

Xem schema chi tiết trong `/db.sql`

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=4000
HOST=0.0.0.0

DATABASE_URL=postgresql://user:password@host:5432/database

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000

MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Lint TypeScript files
- `npm run type-check` - Check TypeScript types

## 🎯 Next Steps

1. ✅ Setup cơ bản (DONE)
2. ✅ Public API endpoints (DONE)
3. ✅ Auth system (DONE)
4. ⏳ Admin CRUD endpoints (TODO)
5. ⏳ File upload handling (TODO)
6. ⏳ JWT middleware for protected routes (TODO)
7. ⏳ Role-based authorization (TODO)
8. ⏳ Unit tests (TODO)

## 📚 Development Guidelines

1. **LUÔN dùng raw SQL** - KHÔNG dùng ORM
2. **Parameterized queries** - KHÔNG nối chuỗi SQL
3. **Zod validation** cho tất cả inputs
4. **Consistent error responses** theo format chuẩn
5. **Transactions** cho multi-table writes
6. **Keep SQL in `/sql` directory**

## 🐛 Testing

### Health check
```bash
curl http://localhost:4000/health
```

### Get services
```bash
curl http://localhost:4000/v1/services?locale=en
```

### Login
```bash
curl -X POST http://localhost:4000/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@koola.com", "password": "password123"}'
```
