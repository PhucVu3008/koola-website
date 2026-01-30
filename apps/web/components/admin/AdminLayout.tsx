'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getStoredUser, logoutAdmin, type AdminUser } from '@/lib/admin-auth';
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Folder,
  Tag,
  FileCode,
  Navigation as NavIcon,
  Settings,
  Mail,
  Newspaper,
  Menu,
  X,
  ExternalLink,
  LogOut,
  User,
  Users,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  locale: 'en' | 'vi';
}

/**
 * Admin Layout Component
 * 
 * Provides sidebar navigation and authentication guard for admin pages.
 * Uses Lucide icons for professional appearance.
 */
export default function AdminLayout({ children, locale }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    const userData = getStoredUser();
    setUser(userData);
  }, [router]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const navigation = [
    {
      name: locale === 'vi' ? 'Tổng quan' : 'Dashboard',
      href: `/admin/${locale}`,
      icon: LayoutDashboard,
    },
    {
      name: locale === 'vi' ? 'Dịch vụ' : 'Services',
      href: `/admin/${locale}/services`,
      icon: Wrench,
    },
    {
      name: locale === 'vi' ? 'Bài viết' : 'Posts',
      href: `/admin/${locale}/posts`,
      icon: FileText,
    },
    {
      name: locale === 'vi' ? 'Danh mục' : 'Categories',
      href: `/admin/${locale}/categories`,
      icon: Folder,
    },
    {
      name: locale === 'vi' ? 'Thẻ' : 'Tags',
      href: `/admin/${locale}/tags`,
      icon: Tag,
    },
    {
      name: locale === 'vi' ? 'Trang' : 'Pages',
      href: `/admin/${locale}/pages`,
      icon: FileCode,
    },
    {
      name: locale === 'vi' ? 'Điều hướng' : 'Navigation',
      href: `/admin/${locale}/navigation`,
      icon: NavIcon,
    },
    {
      name: locale === 'vi' ? 'Người dùng' : 'Users',
      href: `/admin/${locale}/users`,
      icon: Users,
    },
    {
      name: locale === 'vi' ? 'Cài đặt' : 'Site Settings',
      href: `/admin/${locale}/settings`,
      icon: Settings,
    },
    {
      name: locale === 'vi' ? 'Liên hệ' : 'Leads',
      href: `/admin/${locale}/leads`,
      icon: Mail,
    },
    {
      name: locale === 'vi' ? 'Bản tin' : 'Newsletter',
      href: `/admin/${locale}/newsletter`,
      icon: Newspaper,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Collapsible (full width or icon-only) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center h-16 border-b border-gray-700 transition-all duration-300 ${
            sidebarOpen ? 'px-6 justify-between' : 'px-4 justify-center'
          }`}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h1 className="text-xl font-bold whitespace-nowrap">KOOLA Admin</h1>
                </div>
              </>
            ) : (
              <div 
                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors cursor-pointer"
                title="KOOLA Admin"
              >
                <Settings className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center transition-all duration-200 ${
                      sidebarOpen ? 'px-4 mx-3' : 'px-0 mx-auto w-12 justify-center'
                    } py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`} />
                    {sidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
                  </Link>
                  
                  {/* Tooltip for mini mode */}
                  {!sidebarOpen && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className={`border-t border-gray-700 p-4 transition-all duration-300 ${
            sidebarOpen ? '' : 'flex flex-col items-center'
          }`}>
            {sidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-gray-700 rounded-lg"
                  title={locale === 'vi' ? 'Đăng xuất' : 'Logout'}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-3 relative group cursor-pointer"
                  title={user.full_name}
                >
                  <User className="w-5 h-5" />
                  
                  {/* Tooltip for user in mini mode */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-semibold">{user.full_name}</div>
                    <div className="text-gray-400">{user.email}</div>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-gray-700 rounded-lg relative group"
                  title={locale === 'vi' ? 'Đăng xuất' : 'Logout'}
                >
                  <LogOut className="w-5 h-5" />
                  
                  {/* Tooltip for logout button */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {locale === 'vi' ? 'Đăng xuất' : 'Logout'}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content - adjusts based on sidebar width */}
      <div 
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200 active:scale-95 relative group"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <Menu className="w-6 h-6" />
              
              {/* Tooltip for toggle button */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                {sidebarOpen 
                  ? (locale === 'vi' ? 'Thu gọn sidebar' : 'Collapse sidebar')
                  : (locale === 'vi' ? 'Mở rộng sidebar' : 'Expand sidebar')
                }
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </button>

            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Link
                  href={pathname.replace(`/admin/${locale}`, '/admin/en')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    locale === 'en'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </Link>
                <Link
                  href={pathname.replace(`/admin/${locale}`, '/admin/vi')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    locale === 'vi'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  VI
                </Link>
              </div>

              <a
                href={`/${locale}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {locale === 'vi' ? 'Xem trang web' : 'View Site'}
              </a>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
