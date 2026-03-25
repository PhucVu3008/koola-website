import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '../../../../src/i18n/locales';
import { getPostBySlug } from '../../../../src/lib/api/posts';
import { PostDetailPage } from '../../../../components/blog/PostDetailPage';
import { resolveImageUrl } from '../../../../src/lib/image-url';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  try {
    const data = await getPostBySlug({ slug, locale });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://koola.vn';
    const heroUrl = data.post.hero_asset_id
      ? resolveImageUrl(`/uploads/media/`)
      : undefined;

    return {
      title: data.post.seo_title || data.post.title,
      description: data.post.seo_description || data.post.excerpt || undefined,
      openGraph: {
        title: data.post.seo_title || data.post.title,
        description: data.post.seo_description || data.post.excerpt || undefined,
        url: `${baseUrl}/${locale}/blog/${slug}`,
        type: 'article',
        publishedTime: data.post.published_at ?? undefined,
        authors: data.post.author_name ? [data.post.author_name] : undefined,
      },
      alternates: {
        canonical: data.post.canonical_url || `${baseUrl}/${locale}/blog/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  try {
    const data = await getPostBySlug({ slug, locale });
    return <PostDetailPage data={data} locale={locale} />;
  } catch (error: any) {
    if (error?.status === 404 || error?.code === 'NOT_FOUND') {
      notFound();
    }
    throw error;
  }
}
