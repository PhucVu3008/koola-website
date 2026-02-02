'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';

/**
 * Page Sections Management
 * 
 * Manages flexible JSON-based sections for CMS pages.
 * Each section has a key and a JSON payload.
 */

interface Section {
  id: number;
  page_id: number;
  section_key: string;
  payload: any;
  sort_order: number;
}

export default function PageSectionsPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = parseInt(params?.id as string);
  const locale = (params?.locale as string) || 'en';

  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    section_key: '',
    payload: '{}',
    sort_order: 0,
  });
  const [error, setError] = useState('');

  const t = locale === 'vi' ? {
    title: 'Quản Lý Sections',
    subtitle: 'Chỉnh sửa nội dung từng section của trang',
    pageInfo: 'Thông tin trang',
    slug: 'Slug',
    status: 'Trạng thái',
    sectionsTitle: 'Sections',
    noSections: 'Chưa có sections nào',
    addSection: '+ Thêm Section',
    sectionKey: 'Section Key',
    sectionKeyHelp: 'Tên định danh (ví dụ: hero, content, about_intro)',
    payload: 'Payload (JSON)',
    payloadHelp: 'Nội dung JSON của section',
    sortOrder: 'Thứ tự',
    save: 'Lưu',
    cancel: 'Hủy',
    edit: 'Sửa',
    delete: 'Xóa',
    deleteConfirm: 'Xác nhận xóa section này?',
    back: '← Quay lại danh sách trang',
    saving: 'Đang lưu...',
    invalidJson: 'JSON không hợp lệ',
  } : {
    title: 'Manage Sections',
    subtitle: 'Edit content for each section of the page',
    pageInfo: 'Page Information',
    slug: 'Slug',
    status: 'Status',
    sectionsTitle: 'Sections',
    noSections: 'No sections yet',
    addSection: '+ Add Section',
    sectionKey: 'Section Key',
    sectionKeyHelp: 'Identifier (e.g., hero, content, about_intro)',
    payload: 'Payload (JSON)',
    payloadHelp: 'JSON content of the section',
    sortOrder: 'Sort Order',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Confirm delete this section?',
    back: '← Back to pages list',
    saving: 'Saving...',
    invalidJson: 'Invalid JSON',
  };

  useEffect(() => {
    loadData();
  }, [pageId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pageResponse, sectionsResponse] = await Promise.all([
        adminApi.getPageById(pageId),
        adminApi.listPageSections(pageId),
      ]);
      
      setPage(pageResponse.data);
      setSections(Array.isArray(sectionsResponse.data) ? sectionsResponse.data : []);
    } catch (error: any) {
      setError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingSection(null);
    setFormData({
      section_key: '',
      payload: '{\n  \n}',
      sort_order: sections.length,
    });
    setError('');
  };

  const handleStartEdit = (section: Section) => {
    setIsCreating(false);
    setEditingSection(section);
    setFormData({
      section_key: section.section_key,
      payload: JSON.stringify(section.payload, null, 2),
      sort_order: section.sort_order,
    });
    setError('');
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSection(null);
    setError('');
  };

  const handleSave = async () => {
    // Validate JSON
    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(formData.payload);
    } catch (err) {
      setError(t.invalidJson);
      return;
    }

    if (!formData.section_key.trim()) {
      setError('Section key is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        section_key: formData.section_key.trim(),
        payload: parsedPayload,
        sort_order: formData.sort_order,
      };

      if (isCreating) {
        await adminApi.createPageSection(pageId, payload);
      } else if (editingSection) {
        await adminApi.updatePageSection(pageId, editingSection.id, payload);
      }

      alert(isCreating ? 'Section created' : 'Section updated');
      setIsCreating(false);
      setEditingSection(null);
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Failed to save section');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (section: Section) => {
    if (!confirm(t.deleteConfirm)) return;

    setLoading(true);
    try {
      await adminApi.deletePageSection(pageId, section.id);
      alert('Section deleted');
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Failed to delete section');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !page) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/admin/${locale}/pages`)}
          className="text-blue-600 hover:text-blue-700 mb-2"
        >
          {t.back}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-1 text-gray-600">{t.subtitle}</p>
      </div>

      {/* Page Info */}
      {page && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t.pageInfo}</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Title:</span>
              <span className="ml-2 font-medium">{(page as any).title}</span>
            </div>
            <div>
              <span className="text-gray-600">{t.slug}:</span>
              <span className="ml-2 font-mono text-sm">{(page as any).slug}</span>
            </div>
            <div>
              <span className="text-gray-600">{t.status}:</span>
              <span className="ml-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  (page as any).status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {(page as any).status}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form (Create/Edit) */}
      {(isCreating || editingSection) && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isCreating ? t.addSection : `${t.edit}: ${editingSection?.section_key}`}
          </h3>

          <div className="space-y-4">
            {/* Section Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.sectionKey} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.section_key}
                onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                placeholder="hero"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">{t.sectionKeyHelp}</p>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.sortOrder}
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Payload JSON */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.payload} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.payload}
                onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                spellCheck={false}
              />
              <p className="mt-1 text-xs text-gray-500">{t.payloadHelp}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? t.saving : t.save}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t.sectionsTitle}</h2>
          {!isCreating && !editingSection && (
            <button
              onClick={handleStartCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.addSection}
            </button>
          )}
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t.noSections}
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-mono text-sm font-semibold text-gray-900">
                        {section.section_key}
                      </h3>
                      <span className="text-xs text-gray-500">
                        Order: {section.sort_order}
                      </span>
                    </div>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto max-h-32">
                      {JSON.stringify(section.payload, null, 2)}
                    </pre>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleStartEdit(section)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(section)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
