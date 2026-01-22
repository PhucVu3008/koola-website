'use client';

import { useRouter } from 'next/navigation';
import type { Dictionary } from '../../src/i18n/generated';

interface ServerErrorContentProps {
  dict: Dictionary;
  locale: string;
  reset?: () => void;
}

/**
 * 500 Server Error page content component.
 * 
 * Features:
 * - Displays a friendly error message
 * - Provides retry functionality
 * - Option to navigate back home
 * - Smooth animations and transitions
 * - Client component for interactive retry
 */
export function ServerErrorContent({ dict, locale, reset }: ServerErrorContentProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-white min-h-screen flex items-center">
      {/* Background gradient with pulse animation */}
      <div
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl animate-pulse-glow"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/4 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-red-600 to-orange-600 opacity-20 sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[210deg] bg-gradient-to-tr from-orange-600 to-red-600 opacity-20 sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mx-auto max-w-2xl text-center">
          {/* 500 Number with shake animation on mount */}
          <p className="text-8xl font-bold tracking-tight text-red-600 sm:text-9xl animate-[shake_0.5s_ease-in-out]">
            500
          </p>

          {/* Heading with fade-in slide-up animation */}
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            {dict.errors.serverError.heading}
          </h1>

          {/* Description with fade-in slide-up animation (delayed) */}
          <p className="mt-6 text-lg leading-7 text-gray-600 animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
            {dict.errors.serverError.description}
          </p>

          {/* Action buttons with staggered fade-in animation */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
            <button
              onClick={handleRetry}
              className="group relative rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-300 ease-out hover:shadow-lg active:scale-95"
            >
              <span className="relative z-10">{dict.errors.serverError.retryButton}</span>
              <div className="absolute inset-0 rounded-md bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => router.push(`/${locale}`)}
              className="group relative rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:scale-105 hover:ring-gray-400 transition-all duration-300 ease-out hover:shadow-md active:scale-95"
            >
              {dict.errors.serverError.homeButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
