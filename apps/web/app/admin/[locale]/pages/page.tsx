'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';

/**
 * Pages Management Page
 */
export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    loadPages();
  }, [locale]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listPages({ locale });
      setPages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete page "${title}"?`)) return;

    try {
      await adminApi.deletePage(id);
      alert('Page deleted successfully');
      loadPages();
    } catch (error: any) {
      alert(error.message || 'Failed to delete page');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="mt-1 text-gray-600">Manage CMS pages</p>
        </div>
        <Link
          href={`/admin/${locale}/pages/new`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Page
        </Link>
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

      {/* Pages List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📄</div>
          <p className="text-gray-600">No pages found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{page.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{page.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : page.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/${locale}/pages/${page.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/${locale}/pages/${page.id}/sections`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Sections
                    </Link>
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
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
