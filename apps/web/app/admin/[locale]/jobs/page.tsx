'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { getAdminTranslations } from '@/i18n/admin-translations';
import { Briefcase, Plus, Edit, Trash2, Filter, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { logger, LogContext } from '@/lib/logger';

interface Job {
  id: number;
  locale: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  employment_type?: string;
  level?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
}

/**
 * Jobs Management Page
 * 
 * List all job posts with actions to create, edit, delete
 */
export default function AdminJobsPage() {
  const params = useParams();
  const router = useRouter();
  const currentLocale = (params?.locale as 'en' | 'vi') || 'en';
  const t = getAdminTranslations(currentLocale);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadJobs();
  }, [locale, status, page]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params: any = { locale, page, pageSize: 20 };
      if (status) params.status = status;

      const response = await adminApi.jobs.list(params);
      setJobs(Array.isArray(response.data) ? response.data : []);
      
      if (response.meta) {
        setTotal(response.meta.total || 0);
        setTotalPages(response.meta.totalPages || 1);
      }
    } catch (error) {
      logger.error('Failed to load jobs list', error, LogContext.admin('list', 'jobs'));
      alert('Failed to load jobs');
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
      await adminApi.jobs.delete(id);
      const successMessage = currentLocale === 'vi' 
        ? 'Đã xóa công việc thành công'
        : 'Job deleted successfully';
      alert(successMessage);
      loadJobs();
    } catch (error: any) {
      const errorMessage = currentLocale === 'vi'
        ? error.message || 'Không thể xóa công việc'
        : error.message || 'Failed to delete job';
      alert(errorMessage);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await adminApi.jobs.updateStatus(id, newStatus);
      loadJobs();
    } catch (error: any) {
      const errorMessage = currentLocale === 'vi'
        ? error.message || 'Không thể cập nhật trạng thái'
        : error.message || 'Failed to update status';
      alert(errorMessage);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentLocale === 'vi' ? 'Tuyển dụng' : 'Jobs'}
            </h1>
            <p className="mt-1 text-gray-600">
              {currentLocale === 'vi' 
                ? 'Quản lý tin tuyển dụng và ứng viên' 
                : 'Manage job posts and applications'}
            </p>
          </div>
        </div>
        
        <Link
          href={`/admin/${currentLocale}/jobs/new`}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {currentLocale === 'vi' ? 'Tạo công việc mới' : 'Create New Job'}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">
            {currentLocale === 'vi' ? 'Bộ lọc' : 'Filters'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLocale === 'vi' ? 'Ngôn ngữ' : 'Language'}
            </label>
            <select
              value={locale}
              onChange={(e) => {
                setLocale(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLocale === 'vi' ? 'Trạng thái' : 'Status'}
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{currentLocale === 'vi' ? 'Tất cả' : 'All'}</option>
              <option value="draft">{currentLocale === 'vi' ? 'Nháp' : 'Draft'}</option>
              <option value="published">{currentLocale === 'vi' ? 'Đã xuất bản' : 'Published'}</option>
              <option value="archived">{currentLocale === 'vi' ? 'Đã lưu trữ' : 'Archived'}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setLocale('en');
                setStatus('');
                setPage(1);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {currentLocale === 'vi' ? 'Đặt lại' : 'Reset'}
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            {currentLocale === 'vi' ? 'Đang tải...' : 'Loading...'}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {currentLocale === 'vi' ? 'Không có công việc nào' : 'No jobs found'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLocale === 'vi' ? 'Tiêu đề' : 'Title'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLocale === 'vi' ? 'Phòng ban' : 'Department'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLocale === 'vi' ? 'Địa điểm' : 'Location'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLocale === 'vi' ? 'Cấp bậc' : 'Level'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLocale === 'vi' ? 'Trạng thái' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentLocale === 'vi' ? 'Thao tác' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              /{job.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.department || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.location || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.level || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(job.status)}`}>
                          {job.status === 'published' 
                            ? (currentLocale === 'vi' ? 'Đã xuất bản' : 'Published')
                            : job.status === 'draft'
                            ? (currentLocale === 'vi' ? 'Nháp' : 'Draft')
                            : (currentLocale === 'vi' ? 'Đã lưu trữ' : 'Archived')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(job.id, job.status)}
                            className={`p-2 rounded transition-colors ${
                              job.status === 'published'
                                ? 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title={
                              job.status === 'published'
                                ? (currentLocale === 'vi' ? 'Ẩn công việc' : 'Unpublish')
                                : (currentLocale === 'vi' ? 'Hiển thị công việc' : 'Publish')
                            }
                          >
                            {job.status === 'published' ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <Link
                            href={`/admin/${currentLocale}/jobs/${job.id}/applications`}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                            title={currentLocale === 'vi' ? 'Xem ứng viên' : 'View applications'}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/${currentLocale}/jobs/${job.id}`}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                            title={currentLocale === 'vi' ? 'Chỉnh sửa' : 'Edit'}
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(job.id, job.title)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                            title={currentLocale === 'vi' ? 'Xóa' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {currentLocale === 'vi' 
                    ? `Trang ${page} / ${totalPages} (${total} công việc)`
                    : `Page ${page} of ${totalPages} (${total} jobs)`}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentLocale === 'vi' ? 'Trước' : 'Previous'}
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentLocale === 'vi' ? 'Sau' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
