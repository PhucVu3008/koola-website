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
    <section className="relative h-[600px] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image src={data.backgroundImage} alt={data.title} fill className="object-cover opacity-40" priority />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90" />
        
        {/* Animated gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10" />
      </div>

      {/* Content Card - Overlapping bottom-left */}
      <div className="container relative h-full px-6">
        <div className="absolute bottom-0 left-6 w-full max-w-3xl translate-y-20 animate-fade-in-up rounded-3xl bg-white p-10 shadow-2xl lg:p-12">
          {/* Breadcrumbs */}
          <nav className="mb-5 flex items-center gap-2 text-sm text-slate-500">
            {data.breadcrumbs.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
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

          {/* Title */}
          <h1 className="mb-5 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">{data.title}</h1>

          {/* Excerpt */}
          <p className="mb-8 text-lg leading-relaxed text-slate-600">{data.excerpt}</p>

          {/* CTAs - Right aligned */}
          <div className="flex flex-wrap gap-4 lg:justify-end">
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
        </div>
      </div>
    </section>
  );
}
