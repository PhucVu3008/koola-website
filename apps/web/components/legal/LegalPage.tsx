'use client';

import React from 'react';
import type { LegalPageProps } from './types';

/**
 * Legal page component with fade-in animations.
 * Used for Terms of Service, Privacy Policy, and Cookie Policy.
 */
export function LegalPage({
  title,
  description,
  lastUpdated,
  sections,
  contactInfo,
  locale,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 md:py-28 animate-fade-in">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {description}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <article
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {section.title}
                </h2>
                <div className="prose prose-slate max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-slate-600 leading-relaxed mb-4 last:mb-0 whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}

            {/* Contact Information Section */}
            <article
              className="mt-16 border-t border-slate-200 pt-12 animate-fade-in-up"
              style={{ animationDelay: `${sections.length * 100}ms` }}
            >
              <div className="rounded-2xl bg-slate-50 p-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-6 w-6 text-slate-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="h-6 w-6 text-slate-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-slate-900">
                        {locale === 'vi' ? 'Điện thoại' : 'Phone'}
                      </p>
                      <a
                        href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                        className="text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="h-6 w-6 text-slate-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-slate-900">
                        {locale === 'vi' ? 'Địa chỉ' : 'Address'}
                      </p>
                      <p className="text-slate-600">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
