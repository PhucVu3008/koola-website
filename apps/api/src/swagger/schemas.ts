import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  loginSchema,
  refreshTokenSchema,
  serviceListQuerySchema,
  serviceSlugParamsSchema,
  serviceSlugQuerySchema,
  adminServiceCreateSchema,
  adminServiceUpdateSchema,
  postListQuerySchema,
  postSlugParamsSchema,
  postSlugQuerySchema,
  adminPostCreateSchema,
  adminPostUpdateSchema,
  leadCreateSchema,
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
  adminCategoryListQuerySchema,
  adminCategoryCreateSchema,
  adminCategoryUpdateSchema,
  adminTagListQuerySchema,
  adminTagCreateSchema,
  adminTagUpdateSchema,
  pageSlugParamsSchema,
  pageQuerySchema,
  navQuerySchema,
  siteSettingsQuerySchema,
  jobListQuerySchema,
  jobSlugParamsSchema,
  jobSlugQuerySchema,
  jobApplicationSchema,
} from '../schemas';
import {
  adminUserCreateSchema,
  adminUserUpdateSchema,
  adminUserChangePasswordSchema,
} from '../schemas/users.schemas';

/** Convert Zod → JSON Schema (draft-07 for Fastify Ajv compatibility). */
function zts(schema: z.ZodTypeAny): Record<string, unknown> {
  // @ts-expect-error zodToJsonSchema generic depth exceeds TS limit with complex schemas
  const jsonSchema = zodToJsonSchema(schema, { target: 'jsonSchema7' });
  const { $schema, ...rest } = jsonSchema as Record<string, unknown>;
  return rest;
}

const idParam = { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] };
const slugParam = { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] };
const keyParam = { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] };
const localeQuery = { type: 'object', properties: { locale: { type: 'string', default: 'en' } } };
const bearerSecurity = [{ bearerAuth: [] }];

// ─── Public: Services ────────────────────────────────────────────
export const serviceSchemas = {
  list: { tags: ['Services'], querystring: zts(serviceListQuerySchema) },
  getBySlug: { tags: ['Services'], params: zts(serviceSlugParamsSchema), querystring: zts(serviceSlugQuerySchema) },
  page: { tags: ['Services'], querystring: localeQuery },
  slugMap: {
    tags: ['Services'],
    querystring: {
      type: 'object',
      properties: {
        from_slug: { type: 'string' },
        from_locale: { type: 'string' },
        to_locale: { type: 'string' },
      },
      required: ['from_slug', 'from_locale', 'to_locale'],
    },
  },
};

// ─── Public: Posts ────────────────────────────────────────────────
export const postSchemas = {
  list: { tags: ['Posts'], querystring: zts(postListQuerySchema) },
  getBySlug: { tags: ['Posts'], params: zts(postSlugParamsSchema), querystring: zts(postSlugQuerySchema) },
};

// ─── Public: Pages ───────────────────────────────────────────────
export const pageSchemas = {
  getBySlug: { tags: ['Pages'], params: zts(pageSlugParamsSchema), querystring: zts(pageQuerySchema) },
  aboutAggregate: { tags: ['Pages'], querystring: zts(pageQuerySchema) },
  careersAggregate: { tags: ['Pages'], querystring: zts(pageQuerySchema) },
};

// ─── Public: Navigation ──────────────────────────────────────────
export const navSchemas = {
  list: { tags: ['Navigation'], querystring: zts(navQuerySchema) },
};

// ─── Public: Site ────────────────────────────────────────────────
export const siteSchemas = {
  settings: { tags: ['Site'], querystring: zts(siteSettingsQuerySchema) },
};

// ─── Public: Leads ───────────────────────────────────────────────
export const leadSchemas = {
  create: { tags: ['Leads'], body: zts(leadCreateSchema) },
};

// ─── Public: Newsletter ──────────────────────────────────────────
export const newsletterSchemas = {
  subscribe: { tags: ['Newsletter'], body: zts(newsletterSubscribeSchema) },
  unsubscribe: { tags: ['Newsletter'], body: zts(newsletterUnsubscribeSchema) },
};

// ─── Public: Jobs ────────────────────────────────────────────────
export const jobSchemas = {
  list: { tags: ['Jobs'], querystring: zts(jobListQuerySchema) },
  getBySlug: { tags: ['Jobs'], params: zts(jobSlugParamsSchema), querystring: zts(jobSlugQuerySchema) },
  apply: { tags: ['Jobs'], params: slugParam, body: zts(jobApplicationSchema) },
  slugMap: {
    tags: ['Jobs'],
    querystring: {
      type: 'object',
      properties: {
        from_slug: { type: 'string' },
        from_locale: { type: 'string' },
        to_locale: { type: 'string' },
      },
      required: ['from_slug', 'from_locale', 'to_locale'],
    },
  },
};

// ─── Health / Monitoring ─────────────────────────────────────────
export const healthSchemas = {
  liveness: { tags: ['Health'] },
  readiness: { tags: ['Health'] },
  full: { tags: ['Health'] },
  metrics: { tags: ['Health'] },
  metricsJson: { tags: ['Health'] },
  metricsDb: { tags: ['Health'] },
  timeseries: {
    tags: ['Health'],
    querystring: {
      type: 'object',
      properties: { metric: { type: 'string' }, window: { type: 'string' } },
    },
  },
  aggregated: {
    tags: ['Health'],
    querystring: {
      type: 'object',
      properties: { window: { type: 'string' } },
    },
  },
};

// ─── Admin: Auth ─────────────────────────────────────────────────
export const adminAuthSchemas = {
  login: { tags: ['Admin Auth'], body: zts(loginSchema) },
  refresh: { tags: ['Admin Auth'], body: zts(refreshTokenSchema) },
  logout: { tags: ['Admin Auth'], body: zts(refreshTokenSchema) },
};

// ─── Admin: Users ────────────────────────────────────────────────
export const adminUserSchemas = {
  list: { tags: ['Admin Users'], security: bearerSecurity },
  getById: { tags: ['Admin Users'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Users'], body: zts(adminUserCreateSchema), security: bearerSecurity },
  update: { tags: ['Admin Users'], params: idParam, body: zts(adminUserUpdateSchema), security: bearerSecurity },
  delete: { tags: ['Admin Users'], params: idParam, security: bearerSecurity },
  changePassword: { tags: ['Admin Users'], params: idParam, body: zts(adminUserChangePasswordSchema), security: bearerSecurity },
  toggleActive: { tags: ['Admin Users'], params: idParam, security: bearerSecurity },
  listRoles: { tags: ['Admin Users'], security: bearerSecurity },
};

// ─── Admin: Services ─────────────────────────────────────────────
export const adminServiceSchemas = {
  list: { tags: ['Admin Services'], security: bearerSecurity },
  getById: { tags: ['Admin Services'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Services'], body: zts(adminServiceCreateSchema), security: bearerSecurity },
  update: { tags: ['Admin Services'], params: idParam, body: zts(adminServiceUpdateSchema), security: bearerSecurity },
  delete: { tags: ['Admin Services'], params: idParam, security: bearerSecurity },
  translate: { tags: ['Admin Services'], params: idParam, security: bearerSecurity },
  syncImages: { tags: ['Admin Services'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Posts ────────────────────────────────────────────────
export const adminPostSchemas = {
  list: { tags: ['Admin Posts'], security: bearerSecurity },
  getById: { tags: ['Admin Posts'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Posts'], body: zts(adminPostCreateSchema), security: bearerSecurity },
  update: { tags: ['Admin Posts'], params: idParam, body: zts(adminPostUpdateSchema), security: bearerSecurity },
  delete: { tags: ['Admin Posts'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Categories ───────────────────────────────────────────
export const adminCategorySchemas = {
  list: { tags: ['Admin Categories'], querystring: zts(adminCategoryListQuerySchema), security: bearerSecurity },
  getById: { tags: ['Admin Categories'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Categories'], body: zts(adminCategoryCreateSchema), security: bearerSecurity },
  update: { tags: ['Admin Categories'], params: idParam, body: zts(adminCategoryUpdateSchema), security: bearerSecurity },
  delete: { tags: ['Admin Categories'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Tags ─────────────────────────────────────────────────
export const adminTagSchemas = {
  list: { tags: ['Admin Tags'], querystring: zts(adminTagListQuerySchema), security: bearerSecurity },
  getById: { tags: ['Admin Tags'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Tags'], body: zts(adminTagCreateSchema), security: bearerSecurity },
  update: { tags: ['Admin Tags'], params: idParam, body: zts(adminTagUpdateSchema), security: bearerSecurity },
  delete: { tags: ['Admin Tags'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Leads ────────────────────────────────────────────────
export const adminLeadSchemas = {
  list: { tags: ['Admin Leads'], security: bearerSecurity },
  patchStatus: { tags: ['Admin Leads'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Newsletter ───────────────────────────────────────────
export const adminNewsletterSchemas = {
  list: { tags: ['Admin Newsletter'], security: bearerSecurity },
  patchStatus: { tags: ['Admin Newsletter'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Nav Items ────────────────────────────────────────────
export const adminNavSchemas = {
  list: { tags: ['Admin Nav'], security: bearerSecurity },
  getById: { tags: ['Admin Nav'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Nav'], security: bearerSecurity },
  update: { tags: ['Admin Nav'], params: idParam, security: bearerSecurity },
  delete: { tags: ['Admin Nav'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Site Settings ────────────────────────────────────────
export const adminSiteSettingsSchemas = {
  list: { tags: ['Admin Site Settings'], security: bearerSecurity },
  getByKey: { tags: ['Admin Site Settings'], params: keyParam, security: bearerSecurity },
  upsert: { tags: ['Admin Site Settings'], params: keyParam, security: bearerSecurity },
  delete: { tags: ['Admin Site Settings'], params: keyParam, security: bearerSecurity },
};

// ─── Admin: Pages ────────────────────────────────────────────────
export const adminPageSchemas = {
  list: { tags: ['Admin Pages'], security: bearerSecurity },
  getById: { tags: ['Admin Pages'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Pages'], security: bearerSecurity },
  update: { tags: ['Admin Pages'], params: idParam, security: bearerSecurity },
  delete: { tags: ['Admin Pages'], params: idParam, security: bearerSecurity },
  listSections: { tags: ['Admin Pages'], params: idParam, security: bearerSecurity },
  createSection: { tags: ['Admin Pages'], params: idParam, security: bearerSecurity },
  updateSection: {
    tags: ['Admin Pages'],
    params: { type: 'object', properties: { id: { type: 'string' }, sectionId: { type: 'string' } }, required: ['id', 'sectionId'] },
    security: bearerSecurity,
  },
  deleteSection: {
    tags: ['Admin Pages'],
    params: { type: 'object', properties: { id: { type: 'string' }, sectionId: { type: 'string' } }, required: ['id', 'sectionId'] },
    security: bearerSecurity,
  },
};

// ─── Admin: Media ────────────────────────────────────────────────
export const adminMediaSchemas = {
  upload: { tags: ['Admin Media'], consumes: ['multipart/form-data'], security: bearerSecurity },
  list: { tags: ['Admin Media'], security: bearerSecurity },
  getById: { tags: ['Admin Media'], params: idParam, security: bearerSecurity },
  delete: { tags: ['Admin Media'], params: idParam, security: bearerSecurity },
};

// ─── Admin: Jobs ─────────────────────────────────────────────────
export const adminJobSchemas = {
  list: { tags: ['Admin Jobs'], security: bearerSecurity },
  listAllApplications: { tags: ['Admin Jobs'], security: bearerSecurity },
  getById: { tags: ['Admin Jobs'], params: idParam, security: bearerSecurity },
  create: { tags: ['Admin Jobs'], security: bearerSecurity },
  update: { tags: ['Admin Jobs'], params: idParam, security: bearerSecurity },
  delete: { tags: ['Admin Jobs'], params: idParam, security: bearerSecurity },
  listApplications: { tags: ['Admin Jobs'], params: idParam, security: bearerSecurity },
  updateApplicationStatus: {
    tags: ['Admin Jobs'],
    params: { type: 'object', properties: { id: { type: 'string' }, applicationId: { type: 'string' } }, required: ['id', 'applicationId'] },
    security: bearerSecurity,
  },
  updateStatus: {
    tags: ['Admin Jobs'],
    params: idParam,
    security: bearerSecurity,
  },
};
