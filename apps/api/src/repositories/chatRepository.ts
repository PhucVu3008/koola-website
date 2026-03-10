import { query, queryOne } from '../db';
import * as SQL from '../sql/public/chat';

interface EmbeddingResult {
  chunk_text: string;
  metadata: Record<string, string>;
  source_type: string;
  similarity: number;
}

export const searchSimilarChunks = async (
  embeddingVector: number[],
  locale: string,
  topK = 5
): Promise<EmbeddingResult[]> => {
  const vectorLiteral = `[${embeddingVector.join(',')}]`;
  return query<EmbeddingResult>(SQL.SEARCH_EMBEDDINGS, [vectorLiteral, locale, topK]);
};

export const upsertEmbedding = async (
  sourceType: string,
  sourceId: number | null,
  locale: string,
  chunkIndex: number,
  chunkText: string,
  embedding: number[],
  metadata: object
) => {
  const vectorLiteral = `[${embedding.join(',')}]`;
  return queryOne(SQL.UPSERT_EMBEDDING, [
    sourceType,
    sourceId,
    locale,
    chunkIndex,
    chunkText,
    vectorLiteral,
    JSON.stringify(metadata),
  ]);
};
