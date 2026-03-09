'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';

/**
 * Tags Management Page
 */
export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  useEffect(() => {
    loadTags();
  }, [locale]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listTags({ locale });
      setTags(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = { ...formData, locale: locale as 'en' | 'vi' };

      if (editingId) {
        await adminApi.updateTag(editingId, data);
        alert('Tag updated successfully');
      } else {
        await adminApi.createTag(data);
        alert('Tag created successfully');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', slug: '' });
      loadTags();
    } catch (error: any) {
      alert(error.message || 'Failed to save tag');
    }
  };

  const handleEdit = (tag: any) => {
    setEditingId(tag.id);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete tag "${name}"?`)) return;

    try {
      await adminApi.deleteTag(id);
      alert('Tag deleted successfully');
      loadTags();
    } catch (error: any) {
      alert(error.message || 'Failed to delete tag');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="mt-1 text-gray-600">Manage content tags</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', slug: '' });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Tag
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Locale</label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
          </select>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Tag' : 'New Tag'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tags List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{tag.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tag.slug}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id, tag.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
