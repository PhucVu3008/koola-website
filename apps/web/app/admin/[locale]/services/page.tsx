'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { getAdminTranslations } from '@/i18n/admin-translations';
import { Wrench, Plus, Edit, Trash2, Filter } from 'lucide-react';

/**
 * Services Management Page
 * 
 * List all services with actions to create, edit, delete
 */
export default function AdminServicesPage() {
  const params = useParams();
  const currentLocale = (params?.locale as 'en' | 'vi') || 'en';
  const t = getAdminTranslations(currentLocale);
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    loadServices();
  }, [locale, status]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const params: any = { locale, page: 1, pageSize: 50 };
      if (status) params.status = status;

      const response = await adminApi.listServices(params);
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load services:', error);
      alert('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    const confirmMessage = currentLocale === 'vi' 
      ? `Bạn có chắc chắn muốn xóa "${title}"?`
      : `Are you sure you want to delete "${title}"?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await adminApi.deleteService(id);
      const successMessage = currentLocale === 'vi' 
        ? 'Đã xóa dịch vụ thành công'
        : 'Service deleted successfully';
      alert(successMessage);
      loadServices();
    } catch (error: any) {
      const errorMessage = currentLocale === 'vi'
        ? error.message || 'Không thể xóa dịch vụ'
        : error.message || 'Failed to delete service';
      alert(errorMessage);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.nav.services}</h1>
            <p className="mt-1 text-gray-600">
              {currentLocale === 'vi' ? 'Quản lý dịch vụ của bạn' : 'Manage your services'}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/${currentLocale}/services/new`}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {currentLocale === 'vi' ? 'Tạo Dịch Vụ Mới' : 'New Service'}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">
            {currentLocale === 'vi' ? 'Bộ lọc' : 'Filters'}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLocale === 'vi' ? 'Ngôn ngữ' : 'Language'}
            </label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.status.draft}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{currentLocale === 'vi' ? 'Tất cả' : 'All'}</option>
              <option value="draft">{t.status.draft}</option>
              <option value="published">{t.status.published}</option>
              <option value="archived">{t.status.archived}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-600">
            {currentLocale === 'vi' ? 'Đang tải dịch vụ...' : 'Loading services...'}
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-300 text-6xl mb-4">
            <Wrench className="w-20 h-20 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentLocale === 'vi' ? 'Chưa có dịch vụ nào' : 'No services found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {currentLocale === 'vi' 
              ? 'Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn' 
              : 'Get started by creating your first service'}
          </p>
          <Link
            href={`/admin/${currentLocale}/services/new`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            {currentLocale === 'vi' ? 'Tạo dịch vụ đầu tiên' : 'Create your first service'}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {currentLocale === 'vi' ? 'Tiêu đề' : 'Title'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {currentLocale === 'vi' ? 'Trạng thái' : 'Status'}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {currentLocale === 'vi' ? 'Xuất bản' : 'Published'}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {currentLocale === 'vi' ? 'Hành động' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-mono">{service.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.status === 'published' ? t.status.published : 
                       service.status === 'draft' ? t.status.draft : 
                       t.status.archived}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {service.published_at ? new Date(service.published_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/${currentLocale}/services/${service.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        {currentLocale === 'vi' ? 'Sửa' : 'Edit'}
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        {currentLocale === 'vi' ? 'Xóa' : 'Delete'}
                      </button>
                    </div>
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
