/**
 * ServiceDetailHero Component
 *
 * Full-width hero banner with:
 * - Large background image
 * - Overlapping white content card (breadcrumbs, H1, excerpt, 2 CTAs)
 *
 * Layout matches reference image exactly.
 */

import Image from 'next/image';
import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type ServiceDetailHeroData = {
  backgroundImage: string;
  breadcrumbs: BreadcrumbItem[];
  title: string;
  excerpt: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export function ServiceDetailHero({ data }: { data: ServiceDetailHeroData }) {
  return (
    <section className="relative h-[500px] sm:h-[600px] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-16 sm:pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image src={data.backgroundImage} alt={data.title} fill className="object-cover opacity-40" priority />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90" />
        
        {/* Animated gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10" />
      </div>

      {/* Content Card - Responsive overlapping */}
      <div className="container relative h-full px-4 sm:px-6">
        <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-auto w-auto sm:w-full sm:max-w-3xl translate-y-12 sm:translate-y-20 rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-10 lg:p-12 shadow-2xl">
          {/* Breadcrumbs */}
          <nav className="mb-3 sm:mb-5 flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto">
            {data.breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-2 whitespace-nowrap">
                {index > 0 && <span className="text-slate-300">/</span>}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-emerald-600">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-900">{item.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Title - Responsive */}
          <h1 className="mb-3 sm:mb-5 text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">{data.title}</h1>

          {/* Excerpt - Responsive */}
          <p className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed text-slate-600">{data.excerpt}</p>

          {/* CTAs - Stack on mobile, right aligned on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-end">
            <Link
              href={data.ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 sm:px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-500 hover:bg-slate-50 hover:shadow-md"
            >
              {data.ctaSecondary.label}
            </Link>
            <Link
              href={data.ctaPrimary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105"
            >
              {data.ctaPrimary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
