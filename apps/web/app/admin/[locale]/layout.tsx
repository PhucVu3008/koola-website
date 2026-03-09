import React, { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { isLocale, type Locale, LOCALES } from '../../../src/i18n/locales';
import '../../globals.css';

/**
 * Admin Root Layout
 * 
 * This layout creates a completely independent admin area.
 * Separate from public [locale] routes to avoid layout conflicts.
 * 
 * Structure: /admin/[locale]/*
 * Examples: /admin/en/services, /admin/vi/posts
 */

export const metadata: Metadata = {
  title: {
    default: 'KOOLA Admin',
    template: '%s | KOOLA Admin',
  },
  description: 'KOOLA Admin Panel - Content Management System',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Generate static params for all supported locales
 */
export function generateStaticParams(): Array<{ locale: Locale }> {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function AdminRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <AdminLayout locale={locale as Locale}>
          {children as any}
        </AdminLayout>
      </body>
    </html>
  );
}
