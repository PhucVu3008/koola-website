import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { getPageBySlug } from '../../../src/lib/api/pages';
import { isLocale, type Locale } from '../../../src/i18n/locales';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: locale === 'vi' ? 'Về chúng tôi' : 'About',
    description:
      locale === 'vi'
        ? 'Tìm hiểu về KOOLA và cách chúng tôi làm việc.'
        : 'Learn more about KOOLA and how we work.',
  };
}

/**
 * About page (CMS-backed via `/v1/pages/about`).
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { page, sections } = await getPageBySlug({ slug: 'about', locale });

  return (
    <article className="prose prose-slate max-w-none">
      <h1>{page.title}</h1>

      {page.content_md ? <p>{page.content_md}</p> : null}

      {sections.length ? (
        <section>
          <h2>Sections</h2>
          <ul>
            {sections.map((s: { id: number; section_key: string; payload: unknown }) => (
              <li key={s.id}>
                <strong>{s.section_key}</strong>
                <pre>{JSON.stringify(s.payload, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
