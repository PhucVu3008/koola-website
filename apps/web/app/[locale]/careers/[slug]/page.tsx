import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JobDetailPage } from '../../../../components/job-detail';
import { isLocale, type Locale } from '../../../../src/i18n/locales';
import { getDictionary } from '../../../../src/i18n/getDictionary';
import { getJobBySlug } from '../../../../src/lib/api/careers';
import {
  generateJobPostingSchema,
  generateBreadcrumbSchema,
  combineSchemas,
  serializeJsonLd,
} from '../../../../src/lib/seo/structuredData';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const job = await getJobBySlug({ slug, locale });
  if (!job) return {};

  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  // Generate structured data schemas
  const schemas = [];

  // JobPosting schema
  schemas.push(
    generateJobPostingSchema({
      title: job.title,
      description: job.summary || `Apply for ${job.title} position at KOOLA`,
      slug,
      locale,
      baseUrl,
      datePosted: job.published_at || new Date().toISOString(),
      validThrough: job.valid_through,
      employmentType: job.employment_type || 'FULL_TIME',
      jobLocation: {
        city: job.location || 'Lam Dong',
        country: 'VN',
      },
      qualifications: job.qualifications,
      responsibilities: job.responsibilities,
    })
  );

  // Breadcrumb schema
  schemas.push(
    generateBreadcrumbSchema(
      [
        { name: dict.careers.jobDetail.breadcrumbs.home, url: `/${locale}` },
        { name: dict.careers.jobDetail.breadcrumbs.careers, url: `/${locale}/careers` },
        { name: job.title, url: '' },
      ],
      baseUrl
    )
  );

  return {
    title: `${job.title} — ${dict.nav.careers} — ${dict.meta.siteName}`,
    description: job.summary || `Apply for ${job.title} position at KOOLA`,
    openGraph: {
      title: job.title,
      description: job.summary || `Apply for ${job.title} position at KOOLA`,
      type: 'article',
      images: [
        {
          url: `${baseUrl}/careers/${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: job.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: job.title,
      description: job.summary || `Apply for ${job.title} position at KOOLA`,
      images: [`${baseUrl}/careers/${slug}.jpg`],
    },
    other: {
      'script:ld+json': serializeJsonLd(schemas),
    },
  };
}

/**
 * Job Detail page route
 * 
 * URL: /[locale]/careers/[slug]
 * Example: /en/careers/nodejs-developer-senior
 */
export default async function JobDetailRoute({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const job = await getJobBySlug({ slug, locale });

  if (!job) notFound();

  return (
    <JobDetailPage
      job={job}
      locale={locale}
      dict={{
        breadcrumbs: {
          home: dict.careers.jobDetail.breadcrumbs.home,
          careers: dict.careers.jobDetail.breadcrumbs.careers,
        },
        overview: dict.careers.jobDetail.overview,
        responsibilities: dict.careers.jobDetail.responsibilities,
        qualifications: dict.careers.jobDetail.qualifications,
        locationLabel: dict.careers.job.locationLabel,
        levelLabel: dict.careers.job.levelLabel,
        applySection: {
          title: dict.careers.jobDetail.applySection.title,
          subtitle: dict.careers.jobDetail.applySection.subtitle,
        },
        form: dict.careers.jobDetail.form,
      }}
    />
  );
}
