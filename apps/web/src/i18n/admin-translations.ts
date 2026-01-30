/**
 * Admin Panel Translations
 * 
 * Static translations for admin interface.
 * These are NOT dynamic content (which comes from DB).
 */

export type AdminTranslations = {
  // Sidebar navigation
  nav: {
    dashboard: string;
    services: string;
    posts: string;
    categories: string;
    tags: string;
    pages: string;
    navigation: string;
    settings: string;
    leads: string;
    newsletter: string;
  };
  
  // Top bar
  topBar: {
    adminDashboard: string;
    viewSite: string;
    logout: string;
  };
  
  // Login page
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signInButton: string;
    signingIn: string;
    defaultCredentials: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    loadingStats: string;
    quickActions: string;
    statCards: {
      services: string;
      posts: string;
      leads: string;
      subscribers: string;
    };
  };
  
  // Common actions
  actions: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    search: string;
    filter: string;
    refresh: string;
  };
  
  // Status labels
  status: {
    draft: string;
    published: string;
    archived: string;
    active: string;
    inactive: string;
  };
  
  // Messages
  messages: {
    loading: string;
    noData: string;
    deleteConfirm: string;
    saveSuccess: string;
    deleteSuccess: string;
    error: string;
  };
  
  // Error pages
  errors: {
    backToDashboard: string;
    dashboard: string;
    services: string;
    settings: string;
  };
};

export const ADMIN_TRANSLATIONS: Record<'en' | 'vi', AdminTranslations> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      services: 'Services',
      posts: 'Posts',
      categories: 'Categories',
      tags: 'Tags',
      pages: 'Pages',
      navigation: 'Navigation',
      settings: 'Site Settings',
      leads: 'Leads',
      newsletter: 'Newsletter',
    },
    topBar: {
      adminDashboard: 'Admin Dashboard',
      viewSite: 'View Site',
      logout: 'Logout',
    },
    login: {
      title: 'KOOLA Admin',
      subtitle: 'Sign in to your account',
      emailLabel: 'Email',
      emailPlaceholder: 'admin@koola.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Password',
      signInButton: 'Sign in',
      signingIn: 'Signing in...',
      defaultCredentials: 'Default: admin@koola.com / admin123',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome to KOOLA Admin Panel',
      loadingStats: 'Loading statistics...',
      quickActions: 'Quick Actions',
      statCards: {
        services: 'Services',
        posts: 'Blog Posts',
        leads: 'Leads',
        subscribers: 'Subscribers',
      },
    },
    actions: {
      add: 'Add New',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
      refresh: 'Refresh',
    },
    status: {
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived',
      active: 'Active',
      inactive: 'Inactive',
    },
    messages: {
      loading: 'Loading...',
      noData: 'No data available',
      deleteConfirm: 'Are you sure you want to delete this item?',
      saveSuccess: 'Saved successfully!',
      deleteSuccess: 'Deleted successfully!',
      error: 'An error occurred',
    },
    errors: {
      backToDashboard: 'Back to Dashboard',
      dashboard: 'Dashboard',
      services: 'Manage Services',
      settings: 'Settings',
    },
  },
  vi: {
    nav: {
      dashboard: 'Tổng quan',
      services: 'Dịch vụ',
      posts: 'Bài viết',
      categories: 'Danh mục',
      tags: 'Thẻ',
      pages: 'Trang',
      navigation: 'Điều hướng',
      settings: 'Cài đặt',
      leads: 'Khách hàng tiềm năng',
      newsletter: 'Đăng ký nhận tin',
    },
    topBar: {
      adminDashboard: 'Quản trị',
      viewSite: 'Xem trang web',
      logout: 'Đăng xuất',
    },
    login: {
      title: 'KOOLA Admin',
      subtitle: 'Đăng nhập vào tài khoản của bạn',
      emailLabel: 'Email',
      emailPlaceholder: 'admin@koola.com',
      passwordLabel: 'Mật khẩu',
      passwordPlaceholder: 'Mật khẩu',
      signInButton: 'Đăng nhập',
      signingIn: 'Đang đăng nhập...',
      defaultCredentials: 'Mặc định: admin@koola.com / admin123',
    },
    dashboard: {
      title: 'Tổng quan',
      welcome: 'Chào mừng đến với Bảng quản trị KOOLA',
      loadingStats: 'Đang tải thống kê...',
      quickActions: 'Thao tác nhanh',
      statCards: {
        services: 'Dịch vụ',
        posts: 'Bài viết',
        leads: 'Khách hàng tiềm năng',
        subscribers: 'Đăng ký nhận tin',
      },
    },
    actions: {
      add: 'Thêm mới',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      save: 'Lưu',
      cancel: 'Hủy',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      refresh: 'Làm mới',
    },
    status: {
      draft: 'Bản nháp',
      published: 'Đã xuất bản',
      archived: 'Đã lưu trữ',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
    },
    messages: {
      loading: 'Đang tải...',
      noData: 'Không có dữ liệu',
      deleteConfirm: 'Bạn có chắc chắn muốn xóa mục này?',
      saveSuccess: 'Đã lưu thành công!',
      deleteSuccess: 'Đã xóa thành công!',
      error: 'Đã xảy ra lỗi',
    },
    errors: {
      backToDashboard: 'Về Trang Tổng Quan',
      dashboard: 'Tổng Quan',
      services: 'Quản Lý Dịch Vụ',
      settings: 'Cài Đặt',
    },
  },
};

export function getAdminTranslations(locale: 'en' | 'vi'): AdminTranslations {
  return ADMIN_TRANSLATIONS[locale] ?? ADMIN_TRANSLATIONS.en;
}
