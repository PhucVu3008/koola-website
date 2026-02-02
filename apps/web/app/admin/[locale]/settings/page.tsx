'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';

/**
 * Site Settings Management Page
 */
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
  });
  const [notificationEmail, setNotificationEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [locale]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await adminApi.listSettings({ locale });
      const allSettings = Array.isArray(response.data) ? response.data : [];
      setSettings(allSettings);
      
      // Load notification_email (global, not locale-specific)
      const notifEmailSetting = allSettings.find((s: any) => s.key === 'notification_email');
      if (notifEmailSetting) {
        // Value is stored as JSON string in database, parse it
        const emailValue = typeof notifEmailSetting.value === 'string' 
          ? notifEmailSetting.value 
          : JSON.stringify(notifEmailSetting.value);
        setNotificationEmail(emailValue);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = { locale, value: formData.value, description: formData.description };
      const key = editingKey || formData.key;

      await adminApi.upsertSetting(key, data);
      alert('Setting saved successfully');

      setShowForm(false);
      setEditingKey(null);
      setFormData({ key: '', value: '', description: '' });
      loadSettings();
    } catch (error: any) {
      alert(error.message || 'Failed to save setting');
    }
  };

  const handleEdit = (setting: any) => {
    setEditingKey(setting.key);
    setFormData({
      key: setting.key,
      value: setting.value || '',
      description: setting.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;

    try {
      await adminApi.deleteSetting(key, locale);
      alert('Setting deleted successfully');
      loadSettings();
    } catch (error: any) {
      alert(error.message || 'Failed to delete setting');
    }
  };

  const handleSaveNotificationEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);

    try {
      // Save as global setting (no locale)
      await adminApi.upsertSetting('notification_email', {
        value: notificationEmail,
        description: 'Email address to receive contact form notifications',
      });
      alert('✅ Notification email updated successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to update notification email');
    } finally {
      setSavingEmail(false);
    }
  };

  // Group settings by prefix
  const groupedSettings = settings.reduce((acc: any, setting: any) => {
    const prefix = setting.key.split('_')[0] || 'general';
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(setting);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="mt-1 text-gray-600">Configure global site settings</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingKey(null);
            setFormData({ key: '', value: '', description: '' });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Setting
        </button>
      </div>

      {/* Locale Filter */}
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

      {/* Email Notification Settings (Global) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📧</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email Notification Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure where to receive notifications when users submit the contact form.
              This email will receive instant alerts with lead details.
            </p>
            
            <form onSubmit={handleSaveNotificationEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Email Address
                </label>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    required
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="admin@yourcompany.com"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={savingEmail}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    {savingEmail ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 <strong>Tip:</strong> You can use your Gmail, company email, or any SMTP-configured address.
                  Make sure SMTP settings are configured in your environment variables.
                </p>
              </div>
              
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">ℹ️</span>
                  <div className="text-sm text-blue-900">
                    <strong>Current behavior:</strong> When someone submits the contact form, an email with 
                    their details will be sent to this address immediately. Failed emails are logged in the database 
                    for troubleshooting.
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingKey ? 'Edit Setting' : 'New Setting'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                <input
                  type="text"
                  required
                  disabled={!!editingKey}
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  placeholder="site_name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use prefixes like: site_, seo_, social_, contact_
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <textarea
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingKey(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingKey ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings List (Grouped) */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSettings).map(([group, items]: [string, any]) => (
            <div key={group} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 uppercase">{group}</h3>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((setting: any) => (
                    <tr key={setting.key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {setting.key}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {typeof setting.value === 'object' 
                          ? JSON.stringify(setting.value) 
                          : setting.value}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {setting.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(setting)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(setting.key)}
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
          ))}
        </div>
      )}
    </div>
  );
}
