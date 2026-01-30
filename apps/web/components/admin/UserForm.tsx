'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n/getDictionary';

interface UserFormProps {
  userId?: number;
  locale: string;
  mode: 'create' | 'edit';
}

interface Role {
  id: number;
  name: string;
  description: string | null;
}

interface UserFormData {
  email: string;
  password: string;
  full_name: string;
  role_ids: number[];
  is_active: boolean;
}

export function UserForm({ userId, locale, mode }: UserFormProps) {
  const router = useRouter();
  const [t, setT] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    full_name: '',
    role_ids: [],
    is_active: true,
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const dict = getDictionary(locale as Locale);
      setT(dict);
    };
    loadTranslations();
  }, [locale]);

  useEffect(() => {
    if (t) {
      loadRoles();
      
      if (mode === 'edit' && userId) {
        loadUser();
      }
    }
  }, [userId, mode, t]);

  const loadRoles = async () => {
    try {
      const response = await adminApi.listRoles();
      setRoles(response.data as Role[]);
    } catch (err: any) {
      setError('Failed to load roles');
    }
  };

  const loadUser = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await adminApi.getUserById(userId);
      const user = response.data as any;

      setFormData({
        email: user.email,
        password: '', // Don't load password
        full_name: user.full_name,
        role_ids: user.roles.map((r: any) => r.id),
        is_active: user.is_active,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRoleToggle = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId]
    }));
  };

  const validateForm = (): boolean => {
    if (!t) return false;
    
    if (!formData.email.trim()) {
      setError(locale === 'vi' ? 'Email là bắt buộc' : 'Email is required');
      return false;
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(locale === 'vi' ? 'Vui lòng nhập địa chỉ email hợp lệ' : 'Please enter a valid email address');
      return false;
    }

    if (mode === 'create' && !formData.password) {
      setError(locale === 'vi' ? 'Mật khẩu là bắt buộc' : 'Password is required');
      return false;
    }

    if (formData.password && formData.password.length < 8) {
      setError(locale === 'vi' ? 'Mật khẩu phải có ít nhất 8 ký tự' : 'Password must be at least 8 characters');
      return false;
    }

    if (!formData.full_name.trim()) {
      setError(locale === 'vi' ? 'Họ tên là bắt buộc' : 'Full name is required');
      return false;
    }

    if (formData.role_ids.length === 0) {
      setError(locale === 'vi' ? 'Phải chọn ít nhất một vai trò' : 'At least one role must be selected');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    try {
      if (mode === 'create') {
        await adminApi.createUser({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role_ids: formData.role_ids,
          is_active: formData.is_active,
        });
      } else if (userId) {
        // For edit mode, only send password if it's not empty
        const updateData: any = {
          email: formData.email,
          full_name: formData.full_name,
          role_ids: formData.role_ids,
          is_active: formData.is_active,
        };

        await adminApi.updateUser(userId, updateData);
      }

      router.push(`/admin/${locale}/users`);
    } catch (err: any) {
      // Display detailed validation errors
      if (err.message && err.message.includes('Validation')) {
        setError(`❌ ${err.message}`);
      } else {
        setError(err.message || (locale === 'vi' ? `Không thể ${mode === 'create' ? 'tạo' : 'cập nhật'} người dùng` : `Failed to ${mode} user`));
      }
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/${locale}/users`);
  };

  if (!t || loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? t.admin.users.createTitle : t.admin.users.editTitle}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {mode === 'create' 
            ? (locale === 'vi' ? 'Thêm người dùng mới vào hệ thống với vai trò và quyền hạn' : 'Add a new user to the system with roles and permissions')
            : (locale === 'vi' ? 'Cập nhật thông tin và vai trò người dùng' : 'Update user information and roles')}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">{t.admin.users.messages.error}</h3>
            <pre className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{error}</pre>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Basic Information */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'vi' ? 'Thông Tin Cơ Bản' : 'Basic Information'}
              </h2>
              
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.admin.users.form.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t.admin.users.form.emailPlaceholder}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {locale === 'vi' ? 'Địa chỉ email để đăng nhập' : "User's email address for login"}
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.admin.users.form.password} {mode === 'create' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={mode === 'edit' ? (locale === 'vi' ? 'Để trống nếu không đổi' : 'Leave blank to keep current') : t.admin.users.form.passwordPlaceholder}
                    minLength={8}
                    required={mode === 'create'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {mode === 'edit' 
                      ? (locale === 'vi' ? 'Để trống nếu không muốn đổi mật khẩu. Nếu đổi, tối thiểu 8 ký tự.' : 'Leave blank to keep current password. Otherwise, minimum 8 characters.')
                      : (locale === 'vi' ? 'Yêu cầu tối thiểu 8 ký tự' : 'Minimum 8 characters required')}
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.admin.users.form.fullName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t.admin.users.form.fullNamePlaceholder}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Roles */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'vi' ? 'Vai Trò & Quyền Hạn' : 'Roles & Permissions'} <span className="text-red-500">*</span>
              </h2>
              
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRoleToggle(role.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.role_ids.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex-1">
                      <label className="block text-sm font-medium text-gray-900 capitalize cursor-pointer">
                        {role.name}
                      </label>
                      {role.description && (
                        <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                ℹ️ <strong>Admin:</strong> {locale === 'vi' ? 'Toàn quyền bao gồm quản lý người dùng' : 'Full access including user management'} | 
                <strong> Manager:</strong> {locale === 'vi' ? 'Toàn quyền nội dung, chỉ xem người dùng' : 'Full content access, read-only user management'} | 
                <strong> Editor:</strong> {locale === 'vi' ? 'Chỉ chỉnh sửa nội dung' : 'Content editing only'}
              </p>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'vi' ? 'Trạng Thái' : 'Status'}
              </h2>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  {t.admin.users.form.active} ({t.admin.users.form.activeHelp})
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-6">
                {locale === 'vi' ? 'Người dùng không hoạt động không thể đăng nhập vào bảng quản trị' : 'Inactive users cannot log in to the admin panel'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              {locale === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.admin.users.saving}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === 'create' ? t.admin.users.createButton : t.admin.users.saveButton}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
