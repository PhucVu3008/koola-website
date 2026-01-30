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
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ServiceDetailContentData } from './types';

export function ServiceDetailContent({ data }: { data: ServiceDetailContentData }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Extract body content (skip title and first section)
  // Added null safety to prevent errors if content is undefined
  const bodyContent = (data.content || '')
    .split('\n')
    .filter((line) => !line.startsWith('# ') && !line.startsWith('## Transform') && !line.startsWith('## Chuyển đổi'))
    .join('\n')
    .trim();

  return (
    <article ref={ref} className="space-y-8">
      {/* Highlight Line - Enhanced */}
      <div
        className={`flex items-start gap-4 rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
          <Lightbulb className="h-6 w-6 text-white" />
        </div>
        <p className="pt-2 text-lg font-semibold leading-relaxed text-slate-900">{data.highlightTitle}</p>
      </div>

      {/* Cover Image - Enhanced */}
      <div
        className={`relative aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100 shadow-xl transition-all duration-700 delay-100 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <Image src={data.coverImage} alt={data.heading} fill className="object-cover" />
        <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10" />
      </div>

      {/* Markdown Content - Enhanced */}
      <div
        className={`prose prose-lg prose-slate max-w-none transition-all duration-700 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl mb-6 mt-8" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-6" {...props} />,
            h4: ({ node, ...props }) => <h4 className="text-xl font-semibold text-slate-900 mb-3 mt-4" {...props} />,
            p: ({ node, ...props }) => <p className="text-lg leading-relaxed text-slate-700 mb-5" {...props} />,
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

      {/* Bottom CTAs - Enhanced */}
      <div
        className={`flex flex-wrap gap-4 border-t border-slate-200 pt-8 transition-all duration-700 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <Link
          href={data.ctaSecondary.href}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-500 hover:bg-slate-50 hover:shadow-md"
        >
          {data.ctaSecondary.label}
        </Link>
        <Link
          href={data.ctaPrimary.href}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105"
        >
          {data.ctaPrimary.label}
        </Link>
      </div>
    </article>
  );
}
