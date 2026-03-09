'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';

/**
 * Navigation Management Page
 */
export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');
  const [placement, setPlacement] = useState('header');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    placement: 'header',
    sort_order: 0,
    parent_id: null as number | null,
  });

  useEffect(() => {
    loadNavItems();
  }, [locale, placement]);

  const loadNavItems = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listNavItems({ locale, placement });
      setNavItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load nav items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = { ...formData, locale: locale as 'en' | 'vi', placement: formData.placement as 'header' | 'footer' };

      if (editingId) {
        await adminApi.updateNavItem(editingId, data);
        alert('Nav item updated successfully');
      } else {
        await adminApi.createNavItem(data);
        alert('Nav item created successfully');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ label: '', href: '', placement: 'header', sort_order: 0, parent_id: null });
      loadNavItems();
    } catch (error: any) {
      alert(error.message || 'Failed to save nav item');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      label: item.label,
      href: item.href,
      placement: item.placement,
      sort_order: item.sort_order || 0,
      parent_id: item.parent_id || null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, label: string) => {
    if (!confirm(`Delete nav item "${label}"?`)) return;

    try {
      await adminApi.deleteNavItem(id);
      alert('Nav item deleted successfully');
      loadNavItems();
    } catch (error: any) {
      alert(error.message || 'Failed to delete nav item');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>
          <p className="mt-1 text-gray-600">Manage header and footer menus</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ label: '', href: '', placement, sort_order: 0, parent_id: null });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Nav Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Nav Item' : 'New Nav Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  required
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="/about"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                  }
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

      {/* Nav Items List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sort Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {navItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.label}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.href}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.sort_order || 0}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.label)}
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
