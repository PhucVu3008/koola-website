'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';

/**
 * PageForm Component
 * 
 * Handles creating and editing CMS pages with flexible sections.
 * Each page type (about, services, careers) has different section structures.
 */

interface PageFormProps {
  pageId?: number;
  locale: string;
  mode: 'create' | 'edit';
}

interface PageFormData {
  locale: string;
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  hero_asset_id: string;
  status: 'draft' | 'published' | 'archived';
}

export default function PageForm({ pageId, locale, mode }: PageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<PageFormData>({
    locale: locale || 'en',
    slug: '',
    title: '',
    seo_title: '',
    seo_description: '',
    hero_asset_id: '',
    status: 'draft',
  });

  const t = locale === 'vi' ? {
    title: mode === 'create' ? 'Tạo Trang Mới' : 'Chỉnh Sửa Trang',
    subtitle: mode === 'create' ? 'Thêm trang mới vào hệ thống' : 'Cập nhật thông tin trang',
    basicInfo: 'Thông Tin Cơ Bản',
    titleLabel: 'Tiêu đề',
    slugLabel: 'Slug (URL)',
    slugHelp: 'URL-friendly identifier (ví dụ: about, services, careers)',
    statusLabel: 'Trạng thái',
    draft: 'Bản nháp',
    published: 'Đã xuất bản',
    archived: 'Đã lưu trữ',
    seoInfo: 'SEO Metadata',
    metaTitleLabel: 'Meta Title',
    metaDescLabel: 'Meta Description',
    heroImageLabel: 'Hero Image ID',
    heroImageHelp: 'ID của ảnh hero từ bảng media_assets',
    sectionsTitle: 'Nội Dung Sections',
    sectionsHelp: 'Các sections được quản lý riêng sau khi tạo trang',
    saveButton: mode === 'create' ? 'Tạo Trang' : 'Lưu Thay Đổi',
    savingButton: 'Đang lưu...',
    cancelButton: 'Hủy',
    viewSections: 'Xem & Chỉnh Sửa Sections',
  } : {
    title: mode === 'create' ? 'Create New Page' : 'Edit Page',
    subtitle: mode === 'create' ? 'Add a new page to the system' : 'Update page information',
    basicInfo: 'Basic Information',
    titleLabel: 'Title',
    slugLabel: 'Slug (URL)',
    slugHelp: 'URL-friendly identifier (e.g., about, services, careers)',
    statusLabel: 'Status',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    seoInfo: 'SEO Metadata',
    metaTitleLabel: 'Meta Title',
    metaDescLabel: 'Meta Description',
    heroImageLabel: 'Hero Image ID',
    heroImageHelp: 'ID of hero image from media_assets table',
    sectionsTitle: 'Content Sections',
    sectionsHelp: 'Sections are managed separately after creating the page',
    saveButton: mode === 'create' ? 'Create Page' : 'Save Changes',
    savingButton: 'Saving...',
    cancelButton: 'Cancel',
    viewSections: 'View & Edit Sections',
  };

  useEffect(() => {
    if (mode === 'edit' && pageId) {
      loadPage();
    }
  }, [pageId, mode]);

  const loadPage = async () => {
    if (!pageId) return;
    
    setLoading(true);
    try {
      const response = await adminApi.getPageById(pageId);
      const pageData = response.data as any;
      
      setFormData({
        locale: pageData.locale || locale,
        slug: pageData.slug || '',
        title: pageData.title || '',
        seo_title: pageData.seo_title || '',
        seo_description: pageData.seo_description || '',
        hero_asset_id: pageData.hero_asset_id?.toString() || '',
        status: pageData.status || 'draft',
      });

      // Load sections separately
      if (pageId) {
        const sectionsResponse = await adminApi.listPageSections(pageId);
        setSections(Array.isArray(sectionsResponse.data) ? sectionsResponse.data : []);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        locale: formData.locale,
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        seo_title: formData.seo_title.trim() || null,
        seo_description: formData.seo_description.trim() || null,
        hero_asset_id: formData.hero_asset_id ? parseInt(formData.hero_asset_id) : null,
        status: formData.status,
      };

      if (mode === 'create') {
        const response = await adminApi.createPage(payload);
        const newId = (response.data as any).id;
        alert('Page created successfully! You can now add sections.');
        router.push(`/admin/${locale}/pages/${newId}/sections`);
      } else {
        await adminApi.updatePage(pageId!, payload);
        alert('Page updated successfully');
        router.push(`/admin/${locale}/pages`);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === 'edit') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-1 text-gray-600">{t.subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.basicInfo}</h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.titleLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.slugLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="about"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">{t.slugHelp}</p>
            </div>

            {/* Locale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Locale</label>
              <select
                value={formData.locale}
                onChange={(e) => handleChange('locale', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.statusLabel}</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">{t.draft}</option>
                <option value="published">{t.published}</option>
                <option value="archived">{t.archived}</option>
              </select>
            </div>

            {/* Hero Image ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.heroImageLabel}
              </label>
              <input
                type="number"
                value={formData.hero_asset_id}
                onChange={(e) => handleChange('hero_asset_id', e.target.value)}
                placeholder="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">{t.heroImageHelp}</p>
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.seoInfo}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.metaTitleLabel}
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => handleChange('seo_title', e.target.value)}
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.metaDescLabel}
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => handleChange('seo_description', e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sections Info (Edit Mode Only) */}
        {mode === 'edit' && pageId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.sectionsTitle}</h2>
            <p className="text-sm text-gray-600 mb-4">{t.sectionsHelp}</p>
            
            {sections.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Current sections: {sections.length}
                </p>
                <div className="space-y-1">
                  {sections.slice(0, 5).map((section) => (
                    <div key={section.id} className="text-sm text-gray-600">
                      • {section.section_key}
                    </div>
                  ))}
                  {sections.length > 5 && (
                    <div className="text-sm text-gray-500">
                      ... and {sections.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <button
              type="button"
              onClick={() => router.push(`/admin/${locale}/pages/${pageId}/sections`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.viewSections} →
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.savingButton : t.saveButton}
          </button>
          
          <button
            type="button"
            onClick={() => router.push(`/admin/${locale}/pages`)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t.cancelButton}
          </button>
        </div>
      </form>
    </div>
  );
}
