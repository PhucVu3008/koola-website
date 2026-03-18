'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Globe, Eye, EyeOff } from 'lucide-react';
import { loginAdmin, isAuthenticated } from '@/lib/admin-auth';
import { getAdminTranslations } from '@/i18n/admin-translations';

/**
 * Admin Login Page
 * 
 * Handles authentication for admin users with i18n support
 * Redirects to dashboard if already authenticated
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';
  const t = getAdminTranslations(locale);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      // Redirect to admin dashboard with correct locale (using window.location for instant redirect)
      window.location.href = `/admin/${locale}`;
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Language switcher
  const switchLocale = (newLocale: 'en' | 'vi') => {
    router.push(`/admin/${newLocale}/login`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            <Globe className="w-4 h-4 text-gray-400 ml-2" />
            <button
              onClick={() => switchLocale('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                locale === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLocale('vi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                locale === 'vi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              VI
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            {t.login.title}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t.login.subtitle}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t.login.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t.login.emailPlaceholder}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t.login.passwordLabel}
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t.login.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? t.login.signingIn : t.login.signInButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
