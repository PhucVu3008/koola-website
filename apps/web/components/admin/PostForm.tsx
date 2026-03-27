'use client';

import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';

interface PostFormProps {
  initialData?: any;
  categories: any[];
  tags: any[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

/**
 * Post Form Component
 *
 * Handles both create and edit modes for blog posts.
 * Includes hero image upload integrated with the media library.
 */
export default function PostForm({
  initialData,
  categories,
  tags,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    locale: 'en',
    title: '',
    slug: '',
    excerpt: '',
    content_md: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
    canonical_url: '',
    published_at: '',
    category_ids: [] as number[],
    tag_ids: [] as number[],
    hero_asset_id: '',  // stored as string for ImageUploader, sent as number
    og_asset_id: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        locale: initialData.locale || 'en',
        title: initialData.title || '',
        slug: initialData.slug || '',
        excerpt: initialData.excerpt || '',
        content_md: initialData.content_md || '',
        status: initialData.status || 'draft',
        seo_title: initialData.seo_title || '',
        seo_description: initialData.seo_description || '',
        canonical_url: initialData.canonical_url || '',
        published_at: initialData.published_at
          ? new Date(initialData.published_at).toISOString().slice(0, 16)
          : '',
        category_ids: Array.isArray(initialData.categories)
          ? initialData.categories.map((c: any) => (typeof c === 'number' ? c : c.id))
          : [],
        tag_ids: Array.isArray(initialData.tags)
          ? initialData.tags.map((t: any) => (typeof t === 'number' ? t : t.id))
          : [],
        hero_asset_id: initialData.hero_asset_id ? String(initialData.hero_asset_id) : '',
        og_asset_id: initialData.og_asset_id ? String(initialData.og_asset_id) : '',
      });
    }
  }, [initialData]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug:
        !prev.slug || prev.slug === generateSlug(prev.title)
          ? generateSlug(value)
          : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData: any = {
        locale: formData.locale,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content_md: formData.content_md,
        status: formData.status,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        canonical_url: formData.canonical_url,
      };

      if (formData.published_at) {
        submitData.published_at = new Date(formData.published_at).toISOString();
      }

      // Image asset IDs — only include if set
      if (formData.hero_asset_id) {
        submitData.hero_asset_id = parseInt(formData.hero_asset_id, 10);
      }
      if (formData.og_asset_id) {
        submitData.og_asset_id = parseInt(formData.og_asset_id, 10);
      }

      const validCategories = formData.category_ids.filter(
        (id): id is number => id !== null && id !== undefined && typeof id === 'number'
      );
      const validTags = formData.tag_ids.filter(
        (id): id is number => id !== null && id !== undefined && typeof id === 'number'
      );

      if (validCategories.length > 0) submitData.categories = validCategories;
      if (validTags.length > 0) submitData.tags = validTags;

      await onSubmit(submitData);
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter((id) => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  const toggleTag = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter((id) => id !== tagId)
        : [...prev.tag_ids, tagId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Global error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {/* ── Basic Information ─────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

        <div className="space-y-4">
          {/* Locale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Locale <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.locale}
              onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="vi">Vietnamese</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Post title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="post-url-slug"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated from title. You can edit manually.</p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Short summary shown in blog list (optional)"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.content_md}
              onChange={(e) => setFormData({ ...formData, content_md: e.target.value })}
              rows={16}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder={'# Post Content\n\nWrite your post content in Markdown format...'}
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports Markdown: **bold**, *italic*, # headings, - lists, [link](url), etc.
            </p>
          </div>
        </div>
      </div>

      {/* ── Images ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Cover Image</h2>
        <p className="text-sm text-gray-500 mb-4">
          The hero/cover image shown at the top of the post and in the blog list.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Hero Image (Cover)"
            value={formData.hero_asset_id}
            onChange={(id) => setFormData({ ...formData, hero_asset_id: id })}
            maxSizeMB={5}
          />
          <ImageUploader
            label="OG Image (Social Share)"
            value={formData.og_asset_id}
            onChange={(id) => setFormData({ ...formData, og_asset_id: id })}
            maxSizeMB={5}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">
          OG image is used when sharing the post on social media. Leave empty to use the hero image.
        </p>
      </div>

      {/* ── Publishing Settings ────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Publishing Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft — not visible to public</option>
              <option value="published">Published — visible to public</option>
              <option value="archived">Archived — hidden from public</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Published Date & Time</label>
            <input
              type="datetime-local"
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to use current time when publishing.</p>
          </div>
        </div>
      </div>

      {/* ── Categories & Tags ──────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories & Tags</h2>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories available</p>
              ) : (
                categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.category_ids.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 border border-gray-200 rounded-md p-3 min-h-[60px]">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags available</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.tag_ids.includes(tag.id)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEO Settings ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input
              type="text"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave empty to use post title"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seo_title.length}/60 characters (recommended: 50–60)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <textarea
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description for search engines"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seo_description.length}/160 characters (recommended: 120–160)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
            <input
              type="url"
              value={formData.canonical_url}
              onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/original-post"
            />
            <p className="text-xs text-gray-500 mt-1">Optional. Use if this content was published elsewhere first.</p>
          </div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end space-x-4 pb-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
