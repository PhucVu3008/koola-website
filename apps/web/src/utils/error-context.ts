/**
 * Error Page Context Utilities
 * 
 * Provides utilities to detect the current context (admin or public)
 * and generate appropriate navigation actions.
 */

export type ErrorContext = 'admin' | 'public';

/**
 * Detect if the current path is within the admin area
 */
export function detectErrorContext(pathname?: string): ErrorContext {
  if (!pathname) {
    // Try to get from window if available (client-side)
    if (typeof window !== 'undefined') {
      pathname = window.location.pathname;
    }
  }
  
  return pathname?.startsWith('/admin') ? 'admin' : 'public';
}

/**
 * Get the appropriate locale from pathname
 */
export function extractLocaleFromPath(pathname?: string): string {
  if (!pathname) {
    if (typeof window !== 'undefined') {
      pathname = window.location.pathname;
    } else {
      return 'en'; // Default fallback
    }
  }
  
  // Extract locale from paths like:
  // /admin/en/... → en
  // /admin/vi/... → vi
  // /en/... → en
  // /vi/... → vi
  const match = pathname.match(/\/(en|vi)(?:\/|$)/);
  return match ? match[1] : 'en';
}

/**
 * Generate navigation paths based on context
 */
export interface ErrorNavigation {
  home: {
    href: string;
    label: string;
  };
  secondary?: {
    href: string;
    label: string;
  }[];
}

export function generateErrorNavigation(
  context: ErrorContext,
  locale: string,
  errorCode: number,
  translations: {
    // Admin translations
    admin: {
      dashboard: string;
      services: string;
      settings: string;
      backToDashboard: string;
    };
    // Public translations
    public: {
      home: string;
      services: string;
      contact: string;
      backToHome: string;
    };
  }
): ErrorNavigation {
  if (context === 'admin') {
    // Admin context navigation
    const navigation: ErrorNavigation = {
      home: {
        href: `/admin/${locale}`,
        label: translations.admin.backToDashboard,
      },
    };
    
    // Add secondary actions based on error code
    if (errorCode === 404) {
      navigation.secondary = [
        {
          href: `/admin/${locale}/services`,
          label: translations.admin.services,
        },
        {
          href: `/admin/${locale}/settings`,
          label: translations.admin.settings,
        },
      ];
    }
    
    return navigation;
  } else {
    // Public context navigation
    const navigation: ErrorNavigation = {
      home: {
        href: `/${locale}`,
        label: translations.public.backToHome,
      },
    };
    
    // Add secondary actions based on error code
    if (errorCode === 404) {
      navigation.secondary = [
        {
          href: `/${locale}/services`,
          label: translations.public.services,
        },
        {
          href: `/${locale}/contact`,
          label: translations.public.contact,
        },
      ];
    }
    
    return navigation;
  }
}
