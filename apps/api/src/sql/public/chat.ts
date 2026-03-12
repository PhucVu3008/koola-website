// ─── Vector search ───────────────────────────────────────────────
export const SEARCH_EMBEDDINGS = `
  SELECT chunk_text, metadata, source_type,
         1 - (embedding <=> $1::vector) AS similarity
  FROM content_embeddings
  WHERE locale = $2
    AND 1 - (embedding <=> $1::vector) > 0.4
  ORDER BY embedding <=> $1::vector
  LIMIT $3
`;

// ─── Content fetch for indexing ─────────────────────────────────
export const GET_ALL_SERVICES_FOR_INDEX = `
  SELECT id, locale, title, slug, slug_group, excerpt, content_md
  FROM services
  WHERE status = 'published' AND locale = $1
`;

export const GET_ALL_POSTS_FOR_INDEX = `
  SELECT id, locale, title, slug, excerpt, content_md
  FROM posts
  WHERE status = 'published' AND locale = $1
`;

export const GET_ALL_JOBS_FOR_INDEX = `
  SELECT id, locale, title, slug, summary, responsibilities_md, requirements_md
  FROM job_posts
  WHERE status = 'published' AND locale = $1
`;

export const GET_SERVICE_FAQS_FOR_INDEX = `
  SELECT sf.id, sf.question, sf.answer, s.locale, s.slug AS service_slug
  FROM service_faqs sf
  JOIN services s ON sf.service_id = s.id
  WHERE s.status = 'published' AND s.locale = $1
`;

export const GET_ALL_PAGES_FOR_INDEX = `
  SELECT id, locale, slug, title, seo_description
  FROM pages
  WHERE status = 'published' AND locale = $1
`;

export const GET_PAGE_SECTIONS_FOR_INDEX = `
  SELECT ps.id, ps.section_key, ps.payload,
         p.locale, p.slug AS page_slug, p.title AS page_title
  FROM page_sections ps
  JOIN pages p ON ps.page_id = p.id
  WHERE p.status = 'published' AND p.locale = $1
  ORDER BY p.id, ps.sort_order
`;

// ─── Upsert embedding ───────────────────────────────────────────
export const UPSERT_EMBEDDING = `
  INSERT INTO content_embeddings (source_type, source_id, locale, chunk_index, chunk_text, embedding, metadata)
  VALUES ($1, $2, $3, $4, $5, $6::vector, $7)
  ON CONFLICT (source_type, source_id, locale, chunk_index)
  DO UPDATE SET chunk_text = EXCLUDED.chunk_text,
                embedding = EXCLUDED.embedding,
                metadata = EXCLUDED.metadata,
                updated_at = now()
`;

export const DELETE_EMBEDDINGS_BY_LOCALE = `
  DELETE FROM content_embeddings WHERE locale = $1
`;
