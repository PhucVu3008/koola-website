import Link from 'next/link';
import type { Dictionary } from '../../src/i18n/generated';

export type ErrorCode = 400 | 401 | 403 | 404 | 500 | 502 | 503;

interface ErrorPageContentProps {
  dict: Dictionary;
  locale: string;
  errorCode: ErrorCode;
  customMessage?: string;
}

/**
 * Universal error page content component.
 * 
 * Supports multiple error codes:
 * - 400: Bad Request
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Not Found
 * - 500: Internal Server Error
 * - 502: Bad Gateway
 * - 503: Service Unavailable
 * 
 * Features:
 * - Dynamic content based on error code
 * - Smooth animations
 * - Appropriate colors per error type
 * - Localized messages
 */
export function ErrorPageContent({ dict, locale, errorCode, customMessage }: ErrorPageContentProps) {
  // Error-specific configuration (colors and animations only)
  const errorConfig = {
    400: { color: 'yellow', animation: 'animate-[shake_0.5s_ease-in-out]' },
    401: { color: 'red', animation: 'animate-[shake_0.5s_ease-in-out]' },
    403: { color: 'red', animation: 'animate-[shake_0.5s_ease-in-out]' },
    404: { color: 'blue', animation: 'animate-bounce' },
    500: { color: 'red', animation: 'animate-[shake_0.5s_ease-in-out]' },
    502: { color: 'purple', animation: 'animate-pulse' },
    503: { color: 'orange', animation: 'animate-pulse' },
  };

  const config = errorConfig[errorCode];
  
  // Map error codes to dictionary keys
  const errorData = (() => {
    switch (errorCode) {
      case 400: return dict.errors.badRequest;
      case 401: return dict.errors.unauthorized;
      case 403: return dict.errors.forbidden;
      case 404: return dict.errors.notFound;
      case 500: return dict.errors.serverError;
      case 502: return dict.errors.badGateway;
      case 503: return dict.errors.serviceUnavailable;
      default: return dict.errors.serverError;
    }
  })();
  
  // Define color classes explicitly for Tailwind (dynamic classes won't be purged)
  const colorClasses = {
    yellow: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-600',
      hoverBg: 'hover:bg-yellow-500',
      focus: 'focus-visible:outline-yellow-600',
      overlay: 'bg-yellow-400',
    },
    red: {
      text: 'text-red-600',
      bg: 'bg-red-600',
      hoverBg: 'hover:bg-red-500',
      focus: 'focus-visible:outline-red-600',
      overlay: 'bg-red-400',
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-500',
      focus: 'focus-visible:outline-blue-600',
      overlay: 'bg-blue-400',
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-600',
      hoverBg: 'hover:bg-purple-500',
      focus: 'focus-visible:outline-purple-600',
      overlay: 'bg-purple-400',
    },
    orange: {
      text: 'text-orange-600',
      bg: 'bg-orange-600',
      hoverBg: 'hover:bg-orange-500',
      focus: 'focus-visible:outline-orange-600',
      overlay: 'bg-orange-400',
    },
  } as const;

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <div className="relative isolate overflow-hidden min-h-screen flex items-center bg-white dark:bg-gray-900">
      {/* Background gradient blobs with animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div
          className={`absolute top-0 left-0 w-96 h-96 ${colors.overlay}/30 rounded-full blur-3xl animate-[floatIn_3s_ease-in-out]`}
          style={{ animationDelay: '0s' }}
        />
        <div
          className={`absolute bottom-0 right-0 w-96 h-96 ${colors.overlay}/20 rounded-full blur-3xl animate-[floatIn_3s_ease-in-out]`}
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mx-auto max-w-2xl text-center">
          {/* Error Code Number with animation */}
          <p className={`text-8xl font-bold tracking-tight ${colors.text} sm:text-9xl ${config.animation}`}>
            {errorCode}
          </p>

          {/* Heading with fade-in slide-up animation */}
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            {errorData.heading}
          </h1>

          {/* Description with fade-in slide-up animation (delayed) */}
          <p className="mt-6 text-lg leading-7 text-gray-600 dark:text-gray-400 animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
            {customMessage || errorData.description}
          </p>

          {/* Action buttons with staggered fade-in animation */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
            <Link
              href={`/${locale}`}
              className={`group relative rounded-md ${colors.bg} px-6 py-3 text-sm font-semibold text-white shadow-sm ${colors.hoverBg} hover:scale-105 ${colors.focus} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300 ease-out hover:shadow-lg`}
            >
              <span className="relative z-10">{errorData.homeButton}</span>
              <div className={`absolute inset-0 rounded-md ${colors.overlay} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            </Link>
            
            {errorCode === 404 && (
              <>
                <Link
                  href={`/${locale}/services`}
                  className="group relative rounded-md bg-white dark:bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 hover:ring-gray-400 dark:hover:ring-gray-600 transition-all duration-300 ease-out hover:shadow-md"
                >
                  {dict.errors.notFound.servicesButton}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="group relative rounded-md bg-white dark:bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 hover:ring-gray-400 dark:hover:ring-gray-600 transition-all duration-300 ease-out hover:shadow-md"
                >
                  {dict.errors.notFound.contactButton}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
