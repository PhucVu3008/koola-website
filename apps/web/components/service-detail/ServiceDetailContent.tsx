/**
 * ServiceDetailContent Component
 *
 * Main article content with:
 * - Highlight line with icon + text
 * - Large cover image
 * - Markdown content rendered as HTML
 * - Bottom CTAs (2 buttons)
 *
 * Enhanced with animations and better styling.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ServiceDetailContentData } from './types';

export function ServiceDetailContent({ data }: { data: ServiceDetailContentData }) {
  // Extract body content (skip title and first section)
  // Added null safety to prevent errors if content is undefined
  const bodyContent = (data.content || '')
    .split('\n')
    .filter((line) => !line.startsWith('# ') && !line.startsWith('## Transform') && !line.startsWith('## Chuyển đổi'))
    .join('\n')
    .trim();

  return (
    <article className="space-y-6 sm:space-y-8">
      {/* Highlight Line - Enhanced + Responsive */}
      <div
        className="flex items-start gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6"
      >
        <div className="mt-0.5 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
          <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <p className="pt-1 sm:pt-2 text-base sm:text-lg font-semibold leading-relaxed text-slate-900">{data.highlightTitle}</p>
      </div>

      {/* Cover Image - Enhanced + Responsive */}
      <div
        className="relative aspect-[16/9] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-100 shadow-lg sm:shadow-xl"
      >
        <Image src={data.coverImage} alt={data.heading} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
        <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10" />
      </div>

      {/* Markdown Content - Enhanced + Responsive */}
      <div
        className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ node, ...props }) => <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 mt-6 sm:mt-8" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 mt-4 sm:mt-6" {...props} />,
            h4: ({ node, ...props }) => <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3 mt-3 sm:mt-4" {...props} />,
            p: ({ node, ...props }) => <p className="text-base sm:text-lg leading-relaxed text-slate-700 mb-4 sm:mb-5" {...props} />,
            ul: ({ node, ...props }) => <ul className="space-y-2 my-4 list-disc list-inside" {...props} />,
            ol: ({ node, ...props }) => <ol className="space-y-2 my-4 list-decimal list-inside" {...props} />,
            li: ({ node, ...props }) => <li className="text-lg text-slate-700" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
            a: ({ node, ...props }) => <a className="text-emerald-600 hover:text-emerald-700 underline" {...props} />,
            code: ({ node, ...props }) => (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-800" {...props} />
            ),
          }}
        >
          {bodyContent}
        </ReactMarkdown>
      </div>

      {/* Image Gallery */}
      {data.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.images.map((img) => (
            <figure key={img.id} className="group relative overflow-hidden rounded-2xl bg-slate-100">
              <div className="relative aspect-[4/3]">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10" />
              </div>
              {img.caption && (
                <figcaption className="px-3 py-2 text-sm text-slate-500 text-center">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {/* Bottom CTAs - Enhanced + Responsive */}
      <div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-slate-200 pt-6 sm:pt-8"
      >
        <Link
          href={data.ctaSecondary.href}
          className="btn-glass btn-glass-outline inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-7 py-3 text-sm font-semibold"
        >
          {data.ctaSecondary.label}
        </Link>
        <Link
          href={data.ctaPrimary.href}
          className="btn-glass btn-glass-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-7 py-3 text-sm font-semibold"
        >
          {data.ctaPrimary.label}
        </Link>
      </div>
    </article>
  );
}
