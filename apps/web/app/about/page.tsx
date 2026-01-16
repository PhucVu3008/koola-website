import type { Metadata } from 'next';

import { getPageBySlug } from '../../src/lib/api/pages';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about KOOLA and how we work.',
};

/**
 * About page (CMS-backed via `/v1/pages/about`).
 */
export default async function AboutPage() {
  const locale = 'en';
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
