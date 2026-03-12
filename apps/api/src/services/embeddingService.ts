import { GoogleGenerativeAI } from '@google/generative-ai';
import * as chatRepo from '../repositories/chatRepository';
import { query } from '../db';
import * as SQL from '../sql/public/chat';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const embedText = async (text: string): Promise<number[]> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent({
    content: { role: 'user', parts: [{ text }] },
    outputDimensionality: 768,
  } as Parameters<typeof model.embedContent>[0]);
  return result.embedding.values;
};

interface IndexableRow {
  id: number;
  locale: string;
  title: string;
  slug: string;
  excerpt?: string;
  content_md?: string;
  summary?: string;
  responsibilities_md?: string;
  requirements_md?: string;
}

interface FaqRow {
  id: number;
  question: string;
  answer: string;
  locale: string;
  service_slug: string;
}

interface PageSectionRow {
  id: number;
  section_key: string;
  payload: Record<string, unknown>;
  locale: string;
  page_slug: string;
  page_title: string;
}

/**
 * Extract readable text from a page_section JSONB payload.
 * Handles common field patterns: headline, paragraphs, content_md, description, items, etc.
 */
function extractTextFromPayload(_sectionKey: string, payload: Record<string, unknown>): string {
  const parts: string[] = [];

  const addIfString = (val: unknown) => {
    if (typeof val === 'string' && val.trim()) parts.push(val.trim());
  };

  addIfString(payload.label);
  addIfString(payload.headline);
  addIfString(payload.subheadline);
  addIfString(payload.title);
  addIfString(payload.subtitle);
  addIfString(payload.description);
  addIfString(payload.content_md);

  if (Array.isArray(payload.paragraphs)) {
    for (const p of payload.paragraphs) addIfString(p);
  }

  if (Array.isArray(payload.items)) {
    for (const item of payload.items) {
      if (typeof item === 'object' && item !== null) {
        const obj = item as Record<string, unknown>;
        addIfString(obj.title);
        addIfString(obj.description);
        addIfString(obj.quote);
        addIfString(obj.year);
        addIfString(obj.role);
      }
    }
  }

  return parts.join('\n').slice(0, 2000);
}

/**
 * Split markdown content into focused chunks by ## headings.
 * Each chunk gets the parent title prepended for context.
 */
function chunkMarkdown(title: string, excerpt: string, contentMd: string): string[] {
  const chunks: string[] = [];

  // Chunk 0: summary (title + excerpt) — matches broad queries like "what services?"
  chunks.push(`${title}: ${excerpt}`);

  // Split by ## headings
  const sections = contentMd.split(/(?=^## )/m).filter((s) => s.trim());
  for (const section of sections) {
    const text = `${title}\n${section}`.trim();
    if (text.length > 50) {
      // If section is too long (>1500 chars), split further by paragraphs
      if (text.length > 1500) {
        const paragraphs = text.split(/\n\n+/);
        let buf = '';
        for (const p of paragraphs) {
          if (buf.length + p.length > 1200 && buf.length > 100) {
            chunks.push(buf.trim());
            buf = `${title}\n${p}`;
          } else {
            buf += (buf ? '\n\n' : '') + p;
          }
        }
        if (buf.trim().length > 50) chunks.push(buf.trim());
      } else {
        chunks.push(text);
      }
    }
  }

  return chunks;
}

export const indexLocale = async (locale: string) => {
  // Clear existing embeddings for this locale before re-indexing
  await query(SQL.DELETE_EMBEDDINGS_BY_LOCALE, [locale]);
  console.log(`  Cleared old embeddings for ${locale}`);

  console.log(`  Indexing services (${locale})...`);
  const services = await query<IndexableRow>(SQL.GET_ALL_SERVICES_FOR_INDEX, [locale]);
  let serviceChunkCount = 0;
  for (const s of services) {
    const chunks = chunkMarkdown(s.title, s.excerpt ?? '', s.content_md ?? '');
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await embedText(chunks[i]);
      await chatRepo.upsertEmbedding('service', s.id, locale, i, chunks[i], embedding, {
        title: s.title,
        slug: s.slug,
        url: `/${locale}/services/${s.slug}`,
        chunk: `${i + 1}/${chunks.length}`,
      });
      serviceChunkCount++;
    }
  }
  console.log(`    ${services.length} services → ${serviceChunkCount} chunks`);

  console.log(`  Indexing posts (${locale})...`);
  const posts = await query<IndexableRow>(SQL.GET_ALL_POSTS_FOR_INDEX, [locale]);
  let postChunkCount = 0;
  for (const p of posts) {
    const chunks = chunkMarkdown(p.title, p.excerpt ?? '', p.content_md ?? '');
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await embedText(chunks[i]);
      await chatRepo.upsertEmbedding('post', p.id, locale, i, chunks[i], embedding, {
        title: p.title,
        slug: p.slug,
        url: `/${locale}/blog/${p.slug}`,
        chunk: `${i + 1}/${chunks.length}`,
      });
      postChunkCount++;
    }
  }
  console.log(`    ${posts.length} posts → ${postChunkCount} chunks`);

  console.log(`  Indexing jobs (${locale})...`);
  const jobs = await query<IndexableRow>(SQL.GET_ALL_JOBS_FOR_INDEX, [locale]);
  for (const j of jobs) {
    const text = `${j.title}\n${j.summary ?? ''}\n${j.responsibilities_md ?? ''}\n${j.requirements_md ?? ''}`.slice(0, 2000);
    const embedding = await embedText(text);
    await chatRepo.upsertEmbedding('job', j.id, locale, 0, text, embedding, {
      title: j.title,
      slug: j.slug,
      url: `/${locale}/careers/${j.slug}`,
    });
  }
  console.log(`    ${jobs.length} jobs indexed`);

  console.log(`  Indexing FAQs (${locale})...`);
  const faqs = await query<FaqRow>(SQL.GET_SERVICE_FAQS_FOR_INDEX, [locale]);
  for (const f of faqs) {
    const text = `Q: ${f.question}\nA: ${f.answer}`;
    const embedding = await embedText(text);
    await chatRepo.upsertEmbedding('faq', f.id, locale, 0, text, embedding, {
      title: f.question,
      url: `/${locale}/services/${f.service_slug}`,
    });
  }
  console.log(`    ${faqs.length} FAQs indexed`);

  console.log(`  Indexing page sections (${locale})...`);
  const sections = await query<PageSectionRow>(SQL.GET_PAGE_SECTIONS_FOR_INDEX, [locale]);
  let pageSectionCount = 0;
  for (const s of sections) {
    const text = extractTextFromPayload(s.section_key, s.payload);
    if (text.length < 30) continue; // skip trivial sections (CTAs, empty payloads)

    const chunkText = `${s.page_title} — ${s.section_key}\n${text}`;
    const embedding = await embedText(chunkText);
    const pageUrl = s.page_slug === 'home' ? `/${locale}` : `/${locale}/${s.page_slug}`;
    await chatRepo.upsertEmbedding('page', s.id, locale, 0, chunkText, embedding, {
      title: s.page_title,
      section: s.section_key,
      url: pageUrl,
    });
    pageSectionCount++;
  }
  console.log(`    ${sections.length} sections → ${pageSectionCount} chunks indexed`);
};
