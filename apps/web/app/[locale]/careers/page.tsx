import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CareersPage } from '../../../components/careers';
import { getCareersPage, getFeaturedJobs } from '../../../src/lib/api/careers';
import { isLocale, type Locale } from '../../../src/i18n/locales';
import { getDictionary } from '../../../src/i18n/getDictionary';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    title: `${dict.nav.careers} — ${dict.meta.siteName}`,
    description: dict.meta.careersDescription,
  };
}

/**
 * Careers page (API-driven via `/v1/pages/careers/aggregate` + `/v1/jobs` + `/v1/posts`).
 */
export default async function CareersRoute({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  // Fetch all data in parallel
  const [pageData, jobs] = await Promise.all([
    getCareersPage({ locale }),
    getFeaturedJobs({ locale }),
  ]);

  return (
    <CareersPage
      pageData={pageData}
      jobs={jobs}
      locale={locale}
      dict={{
        hero: {
          title: dict.careers.hero.title,
          subtitle: dict.careers.hero.subtitle,
        },
        featuredJobs: {
          title: dict.careers.featuredJobs.title,
          exploreMore: dict.careers.featuredJobs.exploreMore,
        },
        job: {
          locationLabel: dict.careers.job.locationLabel,
          levelLabel: dict.careers.job.levelLabel,
          responsibilitiesTitle: dict.careers.job.responsibilitiesTitle,
          qualificationsTitle: dict.careers.job.qualificationsTitle,
          applyButton: dict.careers.job.applyButton,
        },
        pride: {
          title: dict.careers.pride.title,
        },
        culture: {
          title: dict.careers.culture.title,
        },
      }}
    />
  );
}
