import Link from 'next/link';

/**
 * Test page to preview all error pages
 * Only for development - should be removed in production
 */

interface TestErrorsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TestErrorsPage({ params }: TestErrorsPageProps) {
  const { locale } = await params;

  const errorTests = [
    { code: 400, label: 'Bad Request', path: '/test-errors/400', color: 'yellow' },
    { code: 401, label: 'Unauthorized', path: '/test-errors/401', color: 'red' },
    { code: 403, label: 'Forbidden', path: '/test-errors/403', color: 'red' },
    { code: 404, label: 'Not Found', path: '/nonexistent-page', color: 'blue' },
    { code: 500, label: 'Server Error', path: '/test-errors/500', color: 'red' },
    { code: 502, label: 'Bad Gateway', path: '/test-errors/502', color: 'purple' },
    { code: 503, label: 'Service Unavailable', path: '/test-errors/503', color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Error Pages Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Click on any card below to preview the error page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {errorTests.map((test) => (
            <Link
              key={test.code}
              href={`/${locale}${test.path}`}
              className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className={`text-5xl font-bold text-${test.color}-600 mb-3`}>
                  {test.code}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {test.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to preview →
                </p>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br from-${test.color}-400/10 to-${test.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
