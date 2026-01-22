import { CareersHeroSection } from './CareersHeroSection';
import { FeaturedJobsAccordion, type FeaturedJobsAccordionData } from './FeaturedJobsAccordion';
import { PrideQuoteSlider } from './PrideQuoteSlider';
import { CultureValuesSection } from './CultureValuesSection';
import type { CareersPageData, FeaturedJob } from '../../src/lib/api/careers';

export type CareersPageProps = {
  pageData: CareersPageData;
  jobs: FeaturedJob[];
  locale: string;
  dict: {
    hero: {
      title: string;
      subtitle: string;
    };
    featuredJobs: {
      title: string;
      exploreMore: string;
    };
    job: {
      locationLabel: string;
      levelLabel: string;
      responsibilitiesTitle: string;
      qualificationsTitle: string;
      applyButton: string;
    };
    pride: {
      title: string;
    };
    culture: {
      title: string;
    };
  };
};

/**
 * Careers Page Composition
 * 
 * Sections (top to bottom):
 * 1. Hero Banner
 * 2. Featured Jobs Accordion
 * 3. Pride Quote Slider
 * 4. Culture/Values Section
 */
export function CareersPage({ pageData, jobs, locale, dict }: CareersPageProps) {
  const heroData = {
    ...pageData.hero,
    title: dict.hero.title,
    subtitle: dict.hero.subtitle,
  };

  const jobsData: FeaturedJobsAccordionData = {
    title: dict.featuredJobs.title,
    exploreMoreLabel: dict.featuredJobs.exploreMore,
    exploreMoreHref: '/jobs',
    locationLabel: dict.job.locationLabel,
    levelLabel: dict.job.levelLabel,
    responsibilitiesTitle: dict.job.responsibilitiesTitle,
    qualificationsTitle: dict.job.qualificationsTitle,
    applyButtonLabel: dict.job.applyButton,
    locale,
    jobs,
  };

  const prideData = {
    title: dict.pride.title,
    slides: pageData.pride.slides,
  };

  const cultureData = {
    title: dict.culture.title,
    bullets: pageData.culture.bullets,
    imageUrl: pageData.culture.imageUrl,
    imageAlt: pageData.culture.imageAlt,
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <CareersHeroSection data={heroData} />

      {/* Featured Jobs */}
      <FeaturedJobsAccordion data={jobsData} />

      {/* Pride Quote Slider */}
      <PrideQuoteSlider data={prideData} />

      {/* Culture Values */}
      <CultureValuesSection data={cultureData} />
    </div>
  );
}
