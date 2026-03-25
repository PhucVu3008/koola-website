import type { Metadata } from 'next';
import { isLocale, type Locale } from '../../../src/i18n/locales';
import { listPosts } from '../../../src/lib/api/posts';
import { BlogListPage } from '../../../components/blog/BlogListPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'Blog | KOOLA' : 'Blog | KOOLA',
    description:
      locale === 'vi'
        ? 'Các bài viết mới nhất về công nghệ, AI, bảo mật và chuyển đổi số từ đội ngũ KOOLA.'
        : 'Latest insights on technology, AI, security and digital transformation from the KOOLA team.',
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isLocale(locale)) return null;

  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const category = sp.category;
  const tag = sp.tag;
  const q = sp.q;

  let result = { posts: [], meta: { page: 1, pageSize: 9, total: 0, totalPages: 0 } } as any;
  try {
    result = await listPosts({ locale, page, pageSize: 9, category, tag, q });
  } catch (e) {
    console.warn('[BlogPage] Failed to load posts:', e);
  }

  return (
    <BlogListPage
      posts={result.posts}
      meta={result.meta}
      locale={locale}
      filters={{ category, tag, q }}
    />
  );
}
