import * as adminPagesRepository from '../repositories/adminPagesRepository';

/**
 * Admin Pages service.
 *
 * Responsibilities:
 * - Provide a thin business layer above the repository.
 * - Enforce basic existence checks where helpful.
 */

export const listPages = async (locale: string) => {
  return await adminPagesRepository.listPages(locale);
};

export const getPageById = async (id: number) => {
  return await adminPagesRepository.getPageById(id);
};

export const createPage = async (input: adminPagesRepository.AdminCreatePageInput) => {
  const id = await adminPagesRepository.createPage(input);
  return id;
};

export const updatePage = async (id: number, input: adminPagesRepository.AdminCreatePageInput) => {
  const updated = await adminPagesRepository.updatePage({ id, ...input });
  return updated;
};

export const deletePage = async (id: number) => {
  return await adminPagesRepository.deletePage(id);
};

// -------- Sections --------

/**
 * Fetch a single page section by id.
 */
export const getPageSectionById = async (id: number) => {
  return await adminPagesRepository.getPageSectionById(id);
};

export const listPageSections = async (pageId: number) => {
  // Optional: validate that page exists for nicer errors.
  const page = await adminPagesRepository.getPageById(pageId);
  if (!page) {
    return { ok: false as const, error: 'PAGE_NOT_FOUND' as const };
  }

  const sections = await adminPagesRepository.listPageSections(pageId);
  return { ok: true as const, sections };
};

export const createPageSection = async (input: adminPagesRepository.AdminCreatePageSectionInput) => {
  const page = await adminPagesRepository.getPageById(input.page_id);
  if (!page) {
    return { ok: false as const, error: 'PAGE_NOT_FOUND' as const };
  }

  const id = await adminPagesRepository.createPageSection(input);
  if (!id) {
    return { ok: false as const, error: 'CREATE_FAILED' as const };
  }

  return { ok: true as const, id };
};

export const updatePageSection = async (
  id: number,
  input: adminPagesRepository.AdminCreatePageSectionInput
) => {
  // Ensure target exists.
  const existing = await adminPagesRepository.getPageSectionById(id);
  if (!existing) {
    return { ok: false as const, error: 'NOT_FOUND' as const };
  }

  // Validate page exists (if moved).
  const page = await adminPagesRepository.getPageById(input.page_id);
  if (!page) {
    return { ok: false as const, error: 'PAGE_NOT_FOUND' as const };
  }

  const updatedId = await adminPagesRepository.updatePageSection({ id, ...input });
  if (!updatedId) {
    return { ok: false as const, error: 'UPDATE_FAILED' as const };
  }

  return { ok: true as const, id: updatedId };
};

export const deletePageSection = async (id: number) => {
  const rowCount = await adminPagesRepository.deletePageSection(id);
  return rowCount;
};
