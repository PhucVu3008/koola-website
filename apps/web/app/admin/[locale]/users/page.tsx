'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { Plus, Pencil, Trash2, Key, Power, PowerOff, AlertCircle } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n/getDictionary';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  roles: { id: number; name: string; description: string | null }[];
}

export default function UsersListPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { locale } = params;
  const [t, setT] = useState<any>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      const dict = getDictionary(locale as Locale);
      setT(dict);
    };
    loadTranslations();
  }, [locale]);

  useEffect(() => {
    if (t) {
      loadUsers();
    }
  }, [page, roleFilter, statusFilter, t]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listUsers({
        page,
        pageSize,
        role: roleFilter || undefined,
        isActive: statusFilter,
      });

      setUsers(response.data as User[]);
      setTotal(response.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm(t?.admin?.users?.messages?.deleteConfirm || 'Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      loadUsers();
    } catch (err: any) {
      alert(err.message || t?.admin?.users?.messages?.error || 'Failed to delete user');
    }
  };

  const handleToggleActive = async (userId: number) => {
    try {
      await adminApi.toggleUserActive(userId);
      loadUsers();
    } catch (err: any) {
      alert(err.message || t?.admin?.users?.messages?.error || 'Failed to toggle user status');
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'editor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t?.admin?.users?.table?.never || 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Show loading while translations are loading
  if (!t || (loading && users.length === 0)) {
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.admin.users.title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {locale === 'vi' ? 'Quản lý tài khoản và phân quyền người dùng' : 'Manage user accounts and permissions'}
          </p>
        </div>
        <button
          onClick={() => router.push(`/admin/${locale}/users/new`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.admin.users.createButton}
        </button>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.admin.users.filters.role}
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.admin.users.filters.allRoles}</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.admin.users.filters.status}
            </label>
            <select
              value={statusFilter === undefined ? '' : statusFilter ? 'active' : 'inactive'}
              onChange={(e) => {
                if (e.target.value === '') setStatusFilter(undefined);
                else setStatusFilter(e.target.value === 'active');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.admin.users.filters.allStatuses}</option>
              <option value="active">{t.admin.users.filters.active}</option>
              <option value="inactive">{t.admin.users.filters.inactive}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setRoleFilter('');
                setStatusFilter(undefined);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {locale === 'vi' ? 'Xóa Bộ Lọc' : 'Clear Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {locale === 'vi' ? 'Người dùng' : 'User'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.admin.users.table.roles}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.admin.users.table.status}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.admin.users.table.lastLogin}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.admin.users.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(role.name)}`}
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.is_active ? t.admin.users.table.activeStatus : t.admin.users.table.inactiveStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.last_login_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/admin/${locale}/users/${user.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                      title={t.admin.users.editButton}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/${locale}/users/${user.id}/password`)}
                      className="text-green-600 hover:text-green-900"
                      title={t.admin.users.passwordButton}
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(user.id)}
                      className={user.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                      title={t.admin.users.toggleActiveButton}
                    >
                      {user.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title={t.admin.users.deleteButton}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t.admin.users.messages.noUsers}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            {t.admin.users.pagination.showing} <span className="font-medium">{(page - 1) * pageSize + 1}</span> {t.admin.users.pagination.to}{' '}
            <span className="font-medium">{Math.min(page * pageSize, total)}</span> {t.admin.users.pagination.of}{' '}
            <span className="font-medium">{total}</span> {t.admin.users.pagination.results}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.admin.users.pagination.previous}
            </button>
            <button
              onClick={() => setPage(Math.min(Math.ceil(total / pageSize), page + 1))}
              disabled={page >= Math.ceil(total / pageSize)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.admin.users.pagination.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
