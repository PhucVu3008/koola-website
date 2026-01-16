import type { Metadata } from 'next';

import Link from 'next/link';

import { getServices, type ServiceListItem } from '../../src/lib/api/services';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services',
};

export default async function ServicesPage() {
  const locale = 'en';
  const { items } = await getServices({ locale });

  return (
    <div className="py-12">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
          <p className="text-slate-600">Browse what KOOLA can deliver.</p>
        </header>

        <div className="grid gap-4">
          {items.map((s: ServiceListItem) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
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
