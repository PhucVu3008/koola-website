'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Tag, Folder } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PostDetailPayload } from '../../src/lib/api/posts';

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function resolvePostImage(post: any): string {
  if (post.hero_storage_path) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
    return `${base}/uploads/${post.hero_storage_path}`;
  }
  return '/home/blog-1.png';
}

function resolveRelatedImage(rp: any): string {
  if (rp.hero_storage_path) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
    return `${base}/uploads/${rp.hero_storage_path}`;
  }
  return '/home/blog-1.png';
}

export function PostDetailPage({
  data,
  locale,
}: {
  data: PostDetailPayload;
  locale: string;
}) {
  const { post, tags, categories, related_posts, sidebar } = data;
  const isVI = locale === 'vi';
  const heroUrl = resolvePostImage(post);
  const isUploadedHero = !!(post as any).hero_storage_path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative h-[340px] sm:h-[460px] w-full overflow-hidden bg-slate-900">
        <Image
          src={heroUrl}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          priority
          unoptimized={isUploadedHero}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90" />
        <div className="container relative flex h-full flex-col justify-end pb-10 px-4 sm:px-6">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {isVI ? 'Trang chủ' : 'Home'}
            </Link>
            <span className="text-slate-500">/</span>
            <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">Blog</Link>
            <span className="text-slate-500">/</span>
            <span className="text-white font-medium line-clamp-1">{post.title}</span>
          </nav>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-3xl line-clamp-2">{post.excerpt}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {post.author_name && (
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author_name}</span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.published_at, locale)}</span>
            )}
            {categories.length > 0 && (
              <span className="flex items-center gap-1.5"><Folder className="h-4 w-4" />{categories.map((c) => c.name).join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Article */}
          <article>
            <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-slate-100">
              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none
                prose-headings:font-bold prose-headings:text-slate-900
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:text-slate-700
                prose-li:text-slate-700 prose-strong:text-slate-900
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                prose-code:bg-slate-100 prose-code:px-1.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-slate-900 prose-pre:rounded-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content_md}</ReactMarkdown>
              </div>

              {tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-400 shrink-0" />
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/${locale}/blog?tag=${tag.slug}`}
                        className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {related_posts.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {isVI ? 'Bài viết liên quan' : 'Related Posts'}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related_posts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/${locale}/blog/${rp.slug}`}
                      className="group block rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden hover:shadow-md hover:ring-blue-200 transition-all"
                    >
                      <div className="relative h-40 bg-slate-100">
                        <Image
                          src={resolveRelatedImage(rp)}
                          alt={rp.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={!!(rp as any).hero_storage_path}
                        />
                      </div>
                      <div className="p-4">
                        {rp.published_at && (
                          <p className="text-xs text-slate-400 mb-1">{formatDate(rp.published_at, locale)}</p>
                        )}
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {rp.title}
                        </h3>
                        {rp.excerpt && (
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{rp.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">{isVI ? 'Cần tư vấn?' : 'Need consultation?'}</h3>
              <p className="text-sm text-blue-100 mb-4">
                {isVI ? 'Đội ngũ chuyên gia KOOLA sẵn sàng hỗ trợ dự án của bạn.' : "KOOLA's expert team is ready to support your project."}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isVI ? 'Liên hệ ngay' : 'Contact us'}
              </Link>
            </div>

            {sidebar.categories.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4">{isVI ? 'Danh mục' : 'Categories'}</h3>
                <ul className="space-y-2">
                  {sidebar.categories.map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/${locale}/blog?category=${cat.slug}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />{cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sidebar.tags.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4">{isVI ? 'Thẻ' : 'Tags'}</h3>
                <div className="flex flex-wrap gap-2">
                  {sidebar.tags.map((tag) => (
                    <Link key={tag.id} href={`/${locale}/blog?tag=${tag.slug}`} className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/${locale}/blog`}
              className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              ← {isVI ? 'Tất cả bài viết' : 'All posts'}
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
