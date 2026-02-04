'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { getAdminTranslations } from '@/i18n/admin-translations';
import { Briefcase, Save, X, ArrowLeft } from 'lucide-react';
import { logger, LogContext } from '@/lib/logger';

interface JobFormProps {
  mode: 'create' | 'edit';
  locale: 'en' | 'vi';
  jobId?: number;
}

interface JobFormData {
  locale: string;
  title: string;
  slug: string;
  slug_group: string;
  department: string;
  location: string;
  employment_type: string;
  level: string;
  summary: string;
  responsibilities_md: string;
  requirements_md: string;
  status: 'draft' | 'published' | 'archived';
}

export function JobForm({ mode, locale: currentLocale, jobId }: JobFormProps) {
  const router = useRouter();
  const t = getAdminTranslations(currentLocale);
  
  const [formData, setFormData] = useState<JobFormData>({
    locale: 'en',
    title: '',
    slug: '',
    slug_group: '',
    department: '',
    location: '',
    employment_type: 'Full-time',
    level: '',
    summary: '',
    responsibilities_md: '',
    requirements_md: '',
    status: 'draft',
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load job data in edit mode
  useEffect(() => {
    if (mode === 'edit' && jobId) {
      loadJob();
    }
  }, [mode, jobId]);

  const loadJob = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.jobs.getById(jobId!);
      const job = response.data;
      
      setFormData({
        locale: job.locale || 'en',
        title: job.title || '',
        slug: job.slug || '',
        slug_group: job.slug_group || '',
        department: job.department || '',
        location: job.location || '',
        employment_type: job.employment_type || 'Full-time',
        level: job.level || '',
        summary: job.summary || '',
        responsibilities_md: job.responsibilities_md || '',
        requirements_md: job.requirements_md || '',
        status: job.status || 'draft',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load job');
      logger.error('Failed to load job data', err, LogContext.admin('load', 'job', jobId));
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({
        ...prev,
        slug,
        slug_group: slug, // Also set slug_group
      }));
    }
  }, [formData.title, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.slug) {
        setError(currentLocale === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill in all required fields');
        setSaving(false);
        return;
      }

      if (mode === 'create') {
        await adminApi.jobs.create(formData);
        alert(currentLocale === 'vi' ? 'Đã tạo công việc thành công!' : 'Job created successfully!');
      } else {
        await adminApi.jobs.update(jobId!, formData);
        alert(currentLocale === 'vi' ? 'Đã cập nhật công việc thành công!' : 'Job updated successfully!');
      }

      router.push(`/admin/${currentLocale}/jobs`);
    } catch (err: any) {
      setError(err.message || (currentLocale === 'vi' ? 'Không thể lưu công việc' : 'Failed to save job'));
      logger.error('Failed to save job', err, LogContext.admin(mode, 'job', jobId));
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/${currentLocale}/jobs`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-600">
          {currentLocale === 'vi' ? 'Đang tải...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'create'
                ? (currentLocale === 'vi' ? 'Tạo công việc mới' : 'Create New Job')
                : (currentLocale === 'vi' ? 'Chỉnh sửa công việc' : 'Edit Job')}
            </h1>
            <p className="mt-1 text-gray-600">
              {mode === 'create'
                ? (currentLocale === 'vi' ? 'Điền thông tin tin tuyển dụng mới' : 'Fill in the job post information')
                : (currentLocale === 'vi' ? 'Cập nhật thông tin tin tuyển dụng' : 'Update job post information')}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {currentLocale === 'vi' ? 'Thông tin cơ bản' : 'Basic Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === 'vi' ? 'Ngôn ngữ' : 'Language'} <span className="text-red-500">*</span>
                </label>
                <select
                  name="locale"
                  value={formData.locale}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === 'vi' ? 'Trạng thái' : 'Status'} <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">{currentLocale === 'vi' ? 'Nháp' : 'Draft'}</option>
                  <option value="published">{currentLocale === 'vi' ? 'Đã xuất bản' : 'Published'}</option>
                  <option value="archived">{currentLocale === 'vi' ? 'Đã lưu trữ' : 'Archived'}</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {currentLocale === 'vi' 
                    ? 'Chỉ các công việc "Đã xuất bản" mới hiển thị trên website'
                    : 'Only "Published" jobs will be visible on the website'}
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLocale === 'vi' ? 'Tiêu đề' : 'Title'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={currentLocale === 'vi' ? 'Ví dụ: Senior Backend Engineer' : 'e.g. Senior Backend Engineer'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Slug */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLocale === 'vi' ? 'Đường dẫn (Slug)' : 'Slug'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="senior-backend-engineer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                {currentLocale === 'vi' 
                  ? 'Tự động tạo từ tiêu đề. URL: /careers/'
                  : 'Auto-generated from title. URL: /careers/'}
                <span className="text-blue-600">{formData.slug || '...'}</span>
              </p>
            </div>
          </div>

          {/* Job Details */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {currentLocale === 'vi' ? 'Chi tiết công việc' : 'Job Details'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === 'vi' ? 'Phòng ban' : 'Department'}
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder={currentLocale === 'vi' ? 'Ví dụ: Engineering' : 'e.g. Engineering'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === 'vi' ? 'Địa điểm' : 'Location'}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={currentLocale === 'vi' ? 'Ví dụ: Remote, Đà Lạt' : 'e.g. Remote, Da Lat'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === 'vi' ? 'Hình thức làm việc' : 'Employment Type'}
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Full-time">{currentLocale === 'vi' ? 'Toàn thời gian' : 'Full-time'}</option>
                  <option value="Part-time">{currentLocale === 'vi' ? 'Bán thời gian' : 'Part-time'}</option>
                  <option value="Contract">{currentLocale === 'vi' ? 'Hợp đồng' : 'Contract'}</option>
                  <option value="Internship">{currentLocale === 'vi' ? 'Thực tập' : 'Internship'}</option>
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === 'vi' ? 'Cấp bậc' : 'Level'}
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{currentLocale === 'vi' ? 'Chọn cấp bậc' : 'Select level'}</option>
                  <option value="Junior">{currentLocale === 'vi' ? 'Mới vào nghề' : 'Junior'}</option>
                  <option value="Mid-level">{currentLocale === 'vi' ? 'Trung cấp' : 'Mid-level'}</option>
                  <option value="Senior">{currentLocale === 'vi' ? 'Cao cấp' : 'Senior'}</option>
                  <option value="Lead">{currentLocale === 'vi' ? 'Trưởng nhóm' : 'Lead'}</option>
                  <option value="Manager">{currentLocale === 'vi' ? 'Quản lý' : 'Manager'}</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLocale === 'vi' ? 'Mô tả ngắn' : 'Summary'}
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={3}
                placeholder={currentLocale === 'vi' 
                  ? 'Mô tả ngắn gọn về vị trí công việc (hiển thị trong danh sách)'
                  : 'Brief description of the job (shown in job listings)'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {currentLocale === 'vi' ? 'Mô tả chi tiết' : 'Detailed Description'}
            </h2>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLocale === 'vi' ? 'Trách nhiệm công việc (Markdown)' : 'Responsibilities (Markdown)'}
              </label>
              <textarea
                name="responsibilities_md"
                value={formData.responsibilities_md}
                onChange={handleChange}
                rows={10}
                placeholder={`## ${currentLocale === 'vi' ? 'Trách nhiệm' : 'Responsibilities'}

- ${currentLocale === 'vi' ? 'Thiết kế và phát triển hệ thống backend' : 'Design and develop backend systems'}
- ${currentLocale === 'vi' ? 'Viết code chất lượng cao, dễ bảo trì' : 'Write high-quality, maintainable code'}
- ${currentLocale === 'vi' ? 'Làm việc với team để giải quyết vấn đề' : 'Collaborate with team to solve problems'}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                {currentLocale === 'vi' 
                  ? 'Hỗ trợ Markdown: ## tiêu đề, **bold**, *italic*, - danh sách'
                  : 'Supports Markdown: ## heading, **bold**, *italic*, - list'}
              </p>
            </div>

            {/* Requirements */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLocale === 'vi' ? 'Yêu cầu ứng viên (Markdown)' : 'Requirements (Markdown)'}
              </label>
              <textarea
                name="requirements_md"
                value={formData.requirements_md}
                onChange={handleChange}
                rows={10}
                placeholder={`## ${currentLocale === 'vi' ? 'Yêu cầu' : 'Requirements'}

- ${currentLocale === 'vi' ? '3+ năm kinh nghiệm Node.js/TypeScript' : '3+ years Node.js/TypeScript experience'}
- ${currentLocale === 'vi' ? 'Hiểu biết về PostgreSQL, Docker' : 'Knowledge of PostgreSQL, Docker'}
- ${currentLocale === 'vi' ? 'Kỹ năng giao tiếp tốt' : 'Strong communication skills'}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              {currentLocale === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving 
                ? (currentLocale === 'vi' ? 'Đang lưu...' : 'Saving...')
                : (currentLocale === 'vi' ? 'Lưu công việc' : 'Save Job')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
