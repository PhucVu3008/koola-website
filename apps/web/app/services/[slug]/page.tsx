import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getServiceDetail } from '../../../src/lib/api/serviceDetail';

export const revalidate = 300;

type PageProps = {
  params: { slug: string };
};

/**
 * Service detail page.
 *
 * Data source:
 * - `GET /v1/services/:slug?locale=en` (bundled payload)
 */
export default async function ServiceDetailPage({ params }: PageProps) {
  const locale = 'en';

  let data;
  try {
    data = await getServiceDetail({ slug: params.slug, locale });
  } catch (e: any) {
    if (e?.status === 404) notFound();
    throw e;
  }

  const { service, deliverables, process_steps, faqs, related_services, sidebar } = data;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <article className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{service.title}</h1>
          {service.seo_description ? <p className="max-w-2xl text-slate-600">{service.seo_description}</p> : null}
        </header>

        {service.content_md ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            <p className="mt-2 whitespace-pre-line text-slate-700">{service.content_md}</p>
          </section>
        ) : null}

        {deliverables.length ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Deliverables</h2>
            <ul className="mt-4 space-y-3">
              {deliverables.map((d) => (
                <li key={d.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="font-medium text-slate-900">{d.title}</div>
                  {d.description ? <div className="mt-1 text-sm text-slate-600">{d.description}</div> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {process_steps.length ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Process</h2>
            <ol className="mt-4 space-y-3">
              {process_steps.map((s) => (
                <li key={s.id} className="rounded-xl bg-slate-50 p-4">
                  <div className="font-medium text-slate-900">{s.title}</div>
                  {s.description ? <div className="mt-1 text-sm text-slate-600">{s.description}</div> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {faqs.length ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">FAQs</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((f) => (
                <details key={f.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <summary className="cursor-pointer font-medium text-slate-900">{f.question}</summary>
                  <div className="mt-2 text-sm text-slate-700">{f.answer}</div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {related_services.length ? (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Related services</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related_services.map((rs) => (
                <Link
                  key={rs.id}
                  href={`/services/${rs.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300"
                >
                  <div className="font-medium text-slate-900">{rs.title}</div>
                  <div className="mt-3 text-sm font-medium">View →</div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <aside className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-900">Get in touch</div>
          <p className="mt-2 text-sm text-slate-600">Tell us what you’re building. We’ll respond within 1–2 days.</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Contact
          </Link>
        </section>

        {sidebar?.tags?.length ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">Tags</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {sidebar.tags.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </aside>
    </div>
  );
}

/**
 * Generate per-service metadata.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = 'en';

  try {
    const data = await getServiceDetail({ slug: params.slug, locale });
    const s = data.service;

    return {
      title: s.seo_title ?? s.title,
      description: s.seo_description ?? undefined,
    };
  } catch (e: any) {
    if (e?.status === 404) return { title: 'Service not found' };
    throw e;
  }
}
