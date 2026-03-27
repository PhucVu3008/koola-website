'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PostPreview, PostListMeta } from '../../src/lib/api/posts';
import { resolveUploadUrl } from '../../src/lib/env';
import { useScrollReveal, revealStyle } from '../../src/lib/ui/useScrollReveal';

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BlogListPage({
  posts,
  meta,
  locale,
  filters,
}: {
  posts: PostPreview[];
  meta: PostListMeta;
  locale: string;
  filters: { category?: string; tag?: string; q?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isVI = locale === 'vi';
  const { ref: gridRef, visible: gridVisible } = useScrollReveal(0.05);

  const navigate = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-24">
        <div className="container px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-3">
            {isVI ? 'Kiến thức & Chia sẻ' : 'Insights & Knowledge'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            {isVI
              ? 'Các bài viết mới nhất về công nghệ, AI và chuyển đổi số.'
              : 'Latest articles on technology, AI, and digital transformation.'}
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              navigate({ q: fd.get('q') as string | undefined, page: '1' });
            }}
            className="mt-8 flex max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="q"
                defaultValue={filters.q ?? ''}
                placeholder={isVI ? 'Tìm kiếm bài viết...' : 'Search posts...'}
                className="w-full rounded-l-xl border-0 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-r-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {isVI ? 'Tìm' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-10 sm:py-16">
        {/* Active filters */}
        {(filters.category || filters.tag || filters.q) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">{isVI ? 'Đang lọc:' : 'Filtering by:'}</span>
            {filters.category && (
              <button
                onClick={() => navigate({ ...filters, category: undefined, page: '1' })}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors"
              >
                📁 {filters.category} ✕
              </button>
            )}
            {filters.tag && (
              <button
                onClick={() => navigate({ ...filters, tag: undefined, page: '1' })}
                className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200 transition-colors"
              >
                # {filters.tag} ✕
              </button>
            )}
            {filters.q && (
              <button
                onClick={() => navigate({ ...filters, q: undefined, page: '1' })}
                className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200 transition-colors"
              >
                🔍 &ldquo;{filters.q}&rdquo; ✕
              </button>
            )}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-slate-500">
              {isVI ? 'Không có bài viết nào.' : 'No posts found.'}
            </p>
          </div>
        ) : (
          <>
            <div ref={gridRef as React.RefObject<HTMLDivElement>} className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  style={revealStyle(gridVisible, i)}
                  className="group block rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden hover:shadow-lg hover:ring-blue-200 transition-shadow duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <Image
                      src={
                        post.hero_storage_path
                          ? resolveUploadUrl(post.hero_storage_path)
                          : '/home/blog-1.png'
                      }
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={!!post.hero_storage_path}
                    />
                    {/* Category badge */}
                    {post.categories.length > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                          {post.categories[0].name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col p-5">
                    {post.published_at && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.published_at, locale)}
                      </div>
                    )}
                    <h2 className="text-base font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                      {isVI ? 'Đọc tiếp' : 'Read more'} →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => navigate({ ...filters, page: String(meta.page - 1) })}
                  disabled={meta.page <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => navigate({ ...filters, page: String(p) })}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                      p === meta.page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => navigate({ ...filters, page: String(meta.page + 1) })}
                  disabled={meta.page >= meta.totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
