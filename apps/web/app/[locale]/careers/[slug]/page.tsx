import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JobDetailPage } from '../../../../components/job-detail';
import { isLocale, type Locale } from '../../../../src/i18n/locales';
import { getDictionary } from '../../../../src/i18n/getDictionary';

export const revalidate = 300;

/**
 * Fetch job detail from API
 */
async function getJobBySlug(slug: string, locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/v1/jobs/${slug}?locale=${locale}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch job');
  }

  const json = await res.json();
  return json.data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const job = await getJobBySlug(slug, locale);
  if (!job) return {};

  const dict = await getDictionary(locale);

  return {
    title: `${job.title} — ${dict.nav.careers} — ${dict.meta.siteName}`,
    description: job.summary || `Apply for ${job.title} position at KOOLA`,
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
  const job = await getJobBySlug(slug, locale);

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
