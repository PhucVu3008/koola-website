'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type NewsPost = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featured_image_url?: string;
  author_name?: string;
  author_role?: string;
  published_at: string;
  category_name?: string;
};

export type CareersNewsPreviewData = {
  title: string;
  posts: NewsPost[];
};

/**
 * Format date to readable string
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Careers News Preview Section
 * Shows 3 blog cards with slider controls at bottom
 */
export function CareersNewsPreview({ data }: { data: CareersNewsPreviewData }) {
  const [_currentPage, setCurrentPage] = useState(0);

  // For the reference, we show exactly 3 cards, but keep controls for UI consistency
  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <section className="mx-auto max-w-6xl py-16 px-8">
      {/* Section Title with Decorative Element */}
      <div className="mb-10 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600" />
        <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {data.posts.slice(0, 3).map((post) => (
          <a
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              {post.featured_image_url ? (
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                {post.title}
              </h3>
              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {post.excerpt}
              </p>

              {/* Author & Date */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {post.author_name && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-200 to-brand-300" />
                      <span className="font-medium">{post.author_name}</span>
                    </div>
                    <span>•</span>
                  </>
                )}
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Slider Navigation Controls */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={goToPrevious}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
