'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal, revealStyle } from '../../src/lib/ui/useScrollReveal';

export type ServiceOverviewItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category?: string;
  iconName?: string | null;
};

type ServiceOverviewCardProps = {
  item: ServiceOverviewItem;
  /** Even index = image right, odd index = image left */
  reversed?: boolean;
  locale: string;
  viewMoreLabel: string;
};

/**
 * Service overview card — alternating image/text layout.
 *
 * Shows a concise summary: category badge, title, excerpt, image,
 * and a "view more" link to the detail page.
 *
 * Shared between Services page and Home page.
 */
export function ServiceOverviewCard({
  item,
  reversed = false,
  locale,
  viewMoreLabel,
}: ServiceOverviewCardProps) {
  const detailHref = `/${locale}/services/${item.slug}`;
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      style={revealStyle(visible, 0, { translateY: 32 })}
      className="group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center"
    >
      {/* Text side */}
      <div className={`flex flex-col gap-4 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
        {/* Category badge */}
        {item.category && (
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            {item.iconName && (
              <span className="text-brand-600 text-xs">
                <ServiceIcon name={item.iconName} />
              </span>
            )}
            <span className="text-xs font-medium text-slate-600">{item.category}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
          {item.title}
        </h3>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
            {item.excerpt}
          </p>
        )}

        {/* View more link */}
        <Link
          href={detailHref}
          className="inline-flex items-center gap-2 self-start rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow-md"
        >
          {viewMoreLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Image side */}
      <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 ${
        reversed ? 'lg:order-1' : 'lg:order-2'
      }`}>
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </article>
  );
}

/** Simple icon resolver — maps icon_name to inline SVG. */
function ServiceIcon({ name }: { name: string }) {
  switch (name) {
    case 'brain':
    case 'ai':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M10 2a6 6 0 00-6 6c0 1.66.68 3.16 1.76 4.24L10 16.49l4.24-4.25A5.98 5.98 0 0016 8a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
        </svg>
      );
    case 'code':
    case 'dev':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      );
  }
}
