import type { Metadata } from 'next';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getServices, type ServiceListItem } from '../../../src/lib/api/services';
import { isLocale, type Locale } from '../../../src/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: locale === 'vi' ? 'Dịch vụ' : 'Services',
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { items } = await getServices({ locale });

  return (
    <div className="py-12">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === 'vi' ? 'Dịch vụ' : 'Services'}
          </h1>
          <p className="text-slate-600">
            {locale === 'vi'
              ? 'Khám phá những gì KOOLA có thể mang lại.'
              : 'Browse what KOOLA can deliver.'}
          </p>
        </header>

        <div className="grid gap-4">
          {items.map((s: ServiceListItem) => (
            <Link
              key={s.id}
              href={`/${locale}/services/${s.slug}`}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <div className="font-medium">{s.title}</div>
              {s.excerpt ? <div className="mt-1 text-sm text-slate-600">{s.excerpt}</div> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
