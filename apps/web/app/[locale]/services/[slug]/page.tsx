import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getServiceBySlug } from '../../../../src/lib/api/services';
import { isLocale, type Locale } from '../../../../src/i18n/locales';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const data = await getServiceBySlug({ slug, locale }).catch(() => null);
  if (!data?.service) return {};

  return {
    title: data.service.title,
    description: data.service.excerpt ?? undefined,
  };
}

/**
 * Service detail page (SSR/ISR) via `/v1/services/:slug`.
 */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const data = await getServiceBySlug({ slug, locale });

  return (
    <article className="prose prose-slate max-w-none">
      <h1>{data.service.title}</h1>
      {data.service.excerpt ? <p>{data.service.excerpt}</p> : null}

      {data.service.content_md ? <pre>{data.service.content_md}</pre> : null}
    </article>
  );
}
