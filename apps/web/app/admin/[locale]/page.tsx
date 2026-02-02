'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { getAdminTranslations } from '@/i18n/admin-translations';
import {
  Wrench,
  FileText,
  Mail,
  Newspaper,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  BarChart3,
  Info,
} from 'lucide-react';

/**
 * Admin Dashboard Home
 * 
 * Overview page with key statistics and i18n support.
 * Uses Lucide icons for professional appearance.
 */
export default function AdminDashboardPage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';
  const t = getAdminTranslations(locale);
  
  const [stats, setStats] = useState({
    services: 0,
    posts: 0,
    leads: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [servicesRes, postsRes, leadsRes, subscribersRes] = await Promise.all([
        adminApi.listServices({ locale: 'en', page: 1, pageSize: 1 }),
        adminApi.listPosts({ locale: 'en', page: 1, pageSize: 1 }),
        adminApi.listLeads({ page: 1, pageSize: 1 }),
        adminApi.listNewsletterSubscribers({ page: 1, pageSize: 1 }),
      ]);

      setStats({
        services: servicesRes.meta?.total || 0,
        posts: postsRes.meta?.total || 0,
        leads: leadsRes.meta?.total || 0,
        subscribers: subscribersRes.meta?.total || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: t.dashboard.statCards.services,
      value: stats.services,
      icon: Wrench,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      hoverBg: 'hover:bg-blue-50',
      href: `/admin/${locale}/services`,
    },
    {
      name: t.dashboard.statCards.posts,
      value: stats.posts,
      icon: FileText,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      hoverBorder: 'hover:border-green-400',
      hoverBg: 'hover:bg-green-50',
      href: `/admin/${locale}/posts`,
    },
    {
      name: t.dashboard.statCards.leads,
      value: stats.leads,
      icon: Mail,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      hoverBorder: 'hover:border-yellow-400',
      hoverBg: 'hover:bg-yellow-50',
      href: `/admin/${locale}/leads`,
    },
    {
      name: t.dashboard.statCards.subscribers,
      value: stats.subscribers,
      icon: Newspaper,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      hoverBg: 'hover:bg-purple-50',
      href: `/admin/${locale}/newsletter`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.dashboard.title}</h1>
          <p className="mt-2 text-gray-600">{t.dashboard.welcome}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <Activity className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            {locale === 'vi' ? 'Hệ thống hoạt động' : 'System Online'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-gray-600">
            <Activity className="w-5 h-5 animate-spin" />
            <span>{t.dashboard.loadingStats}</span>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid - Modern Card Design with Click Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <a
                  key={stat.name}
                  href={stat.href}
                  className={`group bg-white rounded-xl shadow-sm border ${stat.borderColor} ${stat.hoverBorder} ${stat.hoverBg} p-6 hover:shadow-lg transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-900 transition-colors">{stat.name}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-3">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                          {locale === 'vi' ? 'Tổng số' : 'Total count'}
                        </span>
                      </div>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  {/* Hover indicator */}
                  <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs font-medium text-gray-600">
                      {locale === 'vi' ? 'Nhấn để quản lý' : 'Click to manage'}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">{t.dashboard.quickActions}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={`/admin/${locale}/services`}
                className="group flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-lg transition-colors">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t.nav.services}</h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'vi' ? 'Quản lý dịch vụ' : 'Manage services'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href={`/admin/${locale}/posts`}
                className="group flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 group-hover:bg-green-100 p-3 rounded-lg transition-colors">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t.nav.posts}</h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'vi' ? 'Quản lý bài viết' : 'Manage blog posts'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href={`/admin/${locale}/leads`}
                className="group flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-50 group-hover:bg-yellow-100 p-3 rounded-lg transition-colors">
                    <Mail className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t.nav.leads}</h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'vi' ? 'Xem liên hệ' : 'View contacts'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>

          {/* System Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-700" />
                <h3 className="text-lg font-semibold text-blue-900">
                  {locale === 'vi' ? 'Thông tin hệ thống' : 'System Information'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/60 backdrop-blur px-4 py-3 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">Backend API</span>
                  <span className="text-sm text-blue-700 font-mono">
                    {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/60 backdrop-blur px-4 py-3 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">Environment</span>
                  <span className="text-sm text-blue-700 font-mono uppercase">
                    {process.env.NODE_ENV || 'development'}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/60 backdrop-blur px-4 py-3 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">Version</span>
                  <span className="text-sm text-blue-700 font-mono">1.0.0</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-700" />
                <h3 className="text-lg font-semibold text-purple-900">
                  {locale === 'vi' ? 'Hoạt động gần đây' : 'Recent Activity'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white/60 backdrop-blur px-4 py-3 rounded-lg">
                  <div className="bg-green-100 p-1.5 rounded">
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900">
                      {locale === 'vi' ? 'Hệ thống đang hoạt động bình thường' : 'System running normally'}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {locale === 'vi' ? 'Không có vấn đề nào được phát hiện' : 'No issues detected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/60 backdrop-blur px-4 py-3 rounded-lg">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900">
                      {locale === 'vi' ? `Tổng ${stats.services + stats.posts} nội dung` : `Total ${stats.services + stats.posts} content items`}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {locale === 'vi' ? 'Dữ liệu đã được tải' : 'Data loaded successfully'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
