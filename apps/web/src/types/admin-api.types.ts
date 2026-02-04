/**
 * Admin API Type Definitions
 * 
 * Centralized types for admin API requests/responses
 * Eliminates 'any' types and provides full type safety
 */

// ============ COMMON TYPES ============

export type Locale = 'en' | 'vi';
export type Status = 'draft' | 'published' | 'archived';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  locale?: Locale;
  status?: Status;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ============ SERVICE TYPES ============

export interface ServiceBenefit {
  title: string;
  description?: string;
  icon_asset_id?: number;
  sort_order?: number;
}

export interface ServiceDeliverable {
  title: string;
  description?: string;
  icon_asset_id?: number;
  sort_order?: number;
}

export interface ServiceProcessStep {
  title: string;
  description?: string;
  sort_order?: number;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
  sort_order?: number;
}

export interface ServiceCreatePayload {
  locale: Locale;
  slug: string;
  slug_group?: string;
  title: string;
  summary?: string;
  description_md?: string;
  hero_image_url?: string;
  icon_name?: string;
  status: Status;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  sort_order?: number;
  tags?: number[];
  categories?: number[];
  benefits?: ServiceBenefit[];
  deliverables?: ServiceDeliverable[];
  process_steps?: ServiceProcessStep[];
  faqs?: ServiceFAQ[];
  related_services?: number[];
  related_posts?: number[];
}

export type ServiceUpdatePayload = Partial<ServiceCreatePayload>;

// ============ POST TYPES ============

export interface PostCreatePayload {
  locale: Locale;
  slug: string;
  slug_group?: string;
  title: string;
  summary?: string;
  content_md?: string;
  featured_image_url?: string;
  status: Status;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  tags?: number[];
  categories?: number[];
}

export type PostUpdatePayload = Partial<PostCreatePayload>;

// ============ CATEGORY/TAG TYPES ============

export interface CategoryCreatePayload {
  locale: Locale;
  slug: string;
  name: string;
  description?: string;
  sort_order?: number;
}

export type CategoryUpdatePayload = Partial<CategoryCreatePayload>;

export interface TagCreatePayload {
  locale: Locale;
  slug: string;
  name: string;
}

export type TagUpdatePayload = Partial<TagCreatePayload>;

// ============ PAGE TYPES ============

export interface PageCreatePayload {
  locale: Locale;
  slug: string;
  title: string;
  seo_title?: string;
  seo_description?: string;
  hero_asset_id?: number;
  status: Status;
  updated_by?: number;
}

export type PageUpdatePayload = Partial<PageCreatePayload>;

export interface PageSectionCreatePayload {
  section_key: string;
  sort_order?: number;
  payload: Record<string, unknown>;
}

export type PageSectionUpdatePayload = Partial<PageSectionCreatePayload>;

// ============ NAVIGATION TYPES ============

export interface NavItemCreatePayload {
  locale: Locale;
  placement: 'header' | 'footer';
  label: string;
  href: string;
  sort_order?: number;
  is_external?: boolean;
}

export type NavItemUpdatePayload = Partial<NavItemCreatePayload>;

// ============ SETTINGS TYPES ============

export interface SiteSettingUpdatePayload {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
}

// ============ MEDIA TYPES ============

export interface MediaAsset {
  id: number;
  file_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  url: string;
  alt_text?: string;
  created_at: string;
}

// ============ JOB TYPES ============

export interface JobCreatePayload {
  locale: Locale;
  title: string;
  slug: string;
  slug_group?: string;
  department?: string;
  location?: string;
  employment_type?: string;
  level?: string;
  summary?: string;
  responsibilities_md?: string;
  requirements_md?: string;
  status: Status;
  published_at?: string;
}

export type JobUpdatePayload = Partial<JobCreatePayload>;

// ============ USER TYPES ============

export interface UserCreatePayload {
  email: string;
  password: string;
  full_name: string;
  role_ids: number[];
}

export interface UserUpdatePayload {
  email?: string;
  password?: string;
  full_name?: string;
  role_ids?: number[];
  is_active?: boolean;
}

// ============ RESPONSE TYPES ============

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
