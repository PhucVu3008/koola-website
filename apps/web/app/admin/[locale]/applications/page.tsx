'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { UserCheck, Filter, Search, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { logger, LogContext } from '@/lib/logger';

interface Application {
  id: number;
  job_id: number;
  full_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  cover_letter?: string;
  status: string;
  created_at: string;
  job_title: string;
  job_slug: string;
  job_locale: string;
}

const STATUS_OPTIONS = ['pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'] as const;

/**
 * Admin Applications Page
 *
 * List all job applications across all jobs with filters and pagination
 */
export default function AdminApplicationsPage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

/* PLACEHOLDER_FUNCTIONS */

  useEffect(() => {
    loadApplications();
  }, [status, search, page]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize: 20 };
      if (status) params.status = status;
      if (search) params.search = search;

      const response = await adminApi.jobs.listAllApplications(params);
      setApplications(Array.isArray(response.data) ? response.data : []);

      if (response.meta) {
        setTotal(response.meta.total || 0);
        setTotalPages(response.meta.totalPages || 1);
      }
    } catch (error) {
      logger.error('Failed to load applications', error, LogContext.admin('list', 'applications'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: number, jobId: number, newStatus: string) => {
    try {
      await adminApi.jobs.updateApplicationStatus(jobId, appId, newStatus);
      loadApplications();
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (s: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[s] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (s: string) => {
    if (locale === 'vi') {
      const labels: Record<string, string> = {
        pending: 'Chờ xử lý', reviewing: 'Đang xem xét', shortlisted: 'Vào vòng trong',
        accepted: 'Đã chấp nhận', rejected: 'Đã từ chối',
      };
      return labels[s] || s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

/* PLACEHOLDER_RENDER */

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <UserCheck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {locale === 'vi' ? 'Hồ sơ ứng tuyển' : 'Applications'}
            </h1>
            <p className="mt-1 text-gray-600">
              {locale === 'vi' ? 'Quản lý tất cả hồ sơ ứng tuyển' : 'Manage all job applications'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">
            {locale === 'vi' ? 'Bộ lọc' : 'Filters'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'vi' ? 'Trạng thái' : 'Status'}
            </label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">{locale === 'vi' ? 'Tất cả' : 'All'}</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'vi' ? 'Tìm kiếm' : 'Search'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={locale === 'vi' ? 'Tên hoặc email...' : 'Name or email...'}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setStatus(''); setSearch(''); setPage(1); }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {locale === 'vi' ? 'Đặt lại' : 'Reset'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            {locale === 'vi' ? 'Đang tải...' : 'Loading...'}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {locale === 'vi' ? 'Không có hồ sơ nào' : 'No applications found'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'vi' ? 'Ứng viên' : 'Applicant'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'vi' ? 'Liên hệ' : 'Contact'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'vi' ? 'Vị trí' : 'Position'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'vi' ? 'Trạng thái' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'vi' ? 'Ngày nộp' : 'Date'}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'vi' ? 'Chi tiết' : 'Details'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <>
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{app.full_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                              <Mail className="w-3.5 h-3.5" />{app.email}
                            </a>
                            {app.phone && (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <Phone className="w-3.5 h-3.5" />{app.phone}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {app.job_title}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, app.job_id, e.target.value)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusBadge(app.status)}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{getStatusLabel(s)}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(app.created_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {(app.cover_letter || app.linkedin_url || app.portfolio_url) && (
                            <button
                              onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-500"
                            >
                              {expandedId === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedId === app.id && (
                        <tr key={`${app.id}-detail`} className="bg-gray-50">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-2 text-sm">
                              {app.linkedin_url && (
                                <div><span className="font-medium text-gray-700">LinkedIn:</span>{' '}
                                  <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{app.linkedin_url}</a>
                                </div>
                              )}
                              {app.portfolio_url && (
                                <div><span className="font-medium text-gray-700">Portfolio:</span>{' '}
                                  <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{app.portfolio_url}</a>
                                </div>
                              )}
                              {app.cover_letter && (
                                <div>
                                  <span className="font-medium text-gray-700">{locale === 'vi' ? 'Thư xin việc:' : 'Cover Letter:'}</span>
                                  <p className="mt-1 p-3 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-700">{app.cover_letter}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  {locale === 'vi'
                    ? `Trang ${page} / ${totalPages} (${total} hồ sơ)`
                    : `Page ${page} of ${totalPages} (${total} applications)`}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {locale === 'vi' ? 'Trước' : 'Previous'}
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {locale === 'vi' ? 'Sau' : 'Next'}
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
