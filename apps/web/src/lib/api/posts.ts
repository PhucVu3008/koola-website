import { apiFetchJson, type ApiSuccessEnvelope } from './http';

export type PostPreview = {
  id: number;
  locale: string;
  title: string;
  slug: string;
  excerpt: string | null;
  hero_asset_id: number | null;
  hero_storage_path: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  tags: Array<{ id: number; name: string; slug: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
};

export type PostDetail = {
  id: number;
  locale: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string;
  hero_asset_id: number | null;
  hero_storage_path: string | null;
  og_asset_id: number | null;
  author_id: number | null;
  status: string;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  author_name: string | null;
  author_email: string | null;
  author_avatar_id: number | null;
};

export type PostDetailPayload = {
  post: PostDetail;
  tags: Array<{ id: number; name: string; slug: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  related_posts: Array<{
    id: number;
    locale: string;
    title: string;
    slug: string;
    excerpt: string | null;
    hero_asset_id: number | null;
    hero_storage_path: string | null;
    published_at: string | null;
  }>;
  sidebar: {
    categories: Array<{ id: number; name: string; slug: string }>;
    tags: Array<{ id: number; name: string; slug: string }>;
    ads: unknown[];
  };
};

export type PostListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * List published posts with pagination.
 */
export async function listPosts(params: {
  locale: string;
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  q?: string;
  sort?: string;
}): Promise<{ posts: PostPreview[]; meta: PostListMeta }> {
  const qs = new URLSearchParams({
    locale: params.locale,
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 10),
    ...(params.category ? { category: params.category } : {}),
    ...(params.tag ? { tag: params.tag } : {}),
    ...(params.q ? { q: params.q } : {}),
    ...(params.sort ? { sort: params.sort } : {}),
  });

  const res = await apiFetchJson<{
    data: PostPreview[];
    meta: PostListMeta;
  }>(`/v1/posts?${qs.toString()}`, { cache: 'no-store' } as any);

  return { posts: res.data, meta: res.meta as PostListMeta };
}

/**
 * Fetch post detail by slug.
 */
export async function getPostBySlug(params: {
  slug: string;
  locale: string;
}): Promise<PostDetailPayload> {
  const res = await apiFetchJson<ApiSuccessEnvelope<PostDetailPayload>>(
    `/v1/posts/${encodeURIComponent(params.slug)}?locale=${encodeURIComponent(params.locale)}`,
    { cache: 'no-store' } as any
  );
  return res.data;
}
