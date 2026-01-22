import Link from 'next/link';
import type { Dictionary } from '../../src/i18n/generated';

interface NotFoundContentProps {
  dict: Dictionary;
  locale: string;
}

/**
 * 404 Not Found page content component.
 * 
 * Features:
 * - Displays a friendly 404 message
 * - Provides navigation options (Home, Services, Contact)
 * - Fully responsive design
 * - Smooth animations and transitions
 * - Matches the site's design system
 */
export function NotFoundContent({ dict, locale }: NotFoundContentProps) {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-white min-h-screen flex items-center">
      {/* Background gradient with animation */}
      <div
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl animate-pulse"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/4 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[210deg] bg-gradient-to-tr from-purple-600 to-blue-600 opacity-20 sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Number with bounce animation */}
          <p className="text-8xl font-bold tracking-tight text-blue-600 sm:text-9xl animate-bounce">
            404
          </p>

          {/* Heading with fade-in slide-up animation */}
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            {dict.errors.notFound.heading}
          </h1>

          {/* Description with fade-in slide-up animation (delayed) */}
          <p className="mt-6 text-lg leading-7 text-gray-600 animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
            {dict.errors.notFound.description}
          </p>

          {/* Action buttons with staggered fade-in animation */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
            <Link
              href={`/${locale}`}
              className="group relative rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 ease-out hover:shadow-lg"
            >
              <span className="relative z-10">{dict.errors.notFound.homeButton}</span>
              <div className="absolute inset-0 rounded-md bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            <Link
              href={`/${locale}/services`}
              className="group relative rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:scale-105 hover:ring-gray-400 transition-all duration-300 ease-out hover:shadow-md"
            >
              {dict.errors.notFound.servicesButton}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="group relative rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:scale-105 hover:ring-gray-400 transition-all duration-300 ease-out hover:shadow-md"
            >
              {dict.errors.notFound.contactButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
