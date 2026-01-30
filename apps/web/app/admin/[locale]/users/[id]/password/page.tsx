'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { Save, X, Loader2, AlertCircle, Key } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n/getDictionary';

export default function ChangePasswordPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const userId = parseInt(params.id);
  const { locale } = params;
  const [t, setT] = useState<any>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      const dict = getDictionary(locale as Locale);
      setT(dict);
    };
    loadTranslations();
  }, [locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!t) return;
    
    setError('');
    setSuccess(false);

    // Validation
    if (!newPassword) {
      setError(locale === 'vi' ? 'Mật khẩu là bắt buộc' : 'Password is required');
      return;
    }

    if (newPassword.length < 8) {
      setError(locale === 'vi' ? 'Mật khẩu phải có ít nhất 8 ký tự' : 'Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.admin.users.messages.passwordMismatch);
      return;
    }

    setSaving(true);

    try {
      await adminApi.changeUserPassword(userId, newPassword);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/admin/${locale}/users`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || (locale === 'vi' ? 'Không thể đổi mật khẩu' : 'Failed to change password'));
      setSaving(false);
    }
  };

  if (!t) {
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-6 h-6" />
            {t.admin.users.changePasswordTitle}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {locale === 'vi' ? 'Đặt mật khẩu mới cho tài khoản này' : 'Set a new password for this user account'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">{t.admin.users.messages.error}</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">{locale === 'vi' ? 'Thành công!' : 'Success!'}</h3>
              <p className="text-sm text-green-700 mt-1">
                {t.admin.users.messages.passwordSuccess}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.users.form.newPassword} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t.admin.users.form.passwordPlaceholder}
                  minLength={8}
                  required
                  disabled={saving || success}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {locale === 'vi' ? 'Phải có ít nhất 8 ký tự' : 'Must be at least 8 characters long'}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.users.form.confirmPassword} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t.admin.users.form.confirmPasswordPlaceholder}
                  required
                  disabled={saving || success}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {locale === 'vi' ? 'Phải khớp với mật khẩu mới' : 'Must match the new password'}
                </p>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  🔒 {t.admin.users.security.notifyUser}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push(`/admin/${locale}/users`)}
                disabled={saving || success}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                {locale === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={saving || success}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {locale === 'vi' ? 'Đang đổi...' : 'Changing...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t.admin.users.passwordButton}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>🔒 Security Note:</strong> The user will need to use this new password on their next login. 
            Consider informing them about the password change through a secure channel.
          </p>
        </div>
      </div>
    </div>
  );
}
