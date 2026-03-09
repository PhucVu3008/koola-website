import { Section } from '../ui/Section';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { AboutIntroSection, type AboutIntroSectionData } from './sections/AboutIntroSection';
import { OurStorySection, type OurStorySectionData } from './sections/OurStorySection';
import { MilestoneHighlight, type MilestoneHighlightData } from './sections/MilestoneHighlight';
import { TeamRolesPreview, type TeamRolesPreviewData } from '../home/TeamRolesPreview';
import { TestimonialsSlider, type TestimonialsSliderData } from '../home/TestimonialsSlider';
import { CompanyTimeline, type CompanyTimelineData } from './sections/CompanyTimeline';
import { PerformanceMetric, type PerformanceMetricData } from './sections/PerformanceMetric';
import { PrimaryCTASection, type PrimaryCTASectionData } from '../home/PrimaryCTASection';

export type AboutPageData = {
  intro: AboutIntroSectionData | null;
  story: OurStorySectionData | null;
  milestone: MilestoneHighlightData | null;
  team: TeamRolesPreviewData | null;
  testimonials: TestimonialsSliderData | null;
  timeline: CompanyTimelineData | null;
  performance: PerformanceMetricData | null;
  cta: PrimaryCTASectionData | null;
};

function assertSection<T>(name: string, value: T | null | undefined): T {
  if (value == null) {
    throw new Error(
      `About page is missing required section '${name}'. ` +
        `Update DB seed/page_sections (section_key) for /v1/pages/about/aggregate.`
    );
  }
  return value;
}

/**
 * About page composition (desktop-only), matching the provided reference structure.
 */
export function AboutPage({ data }: { data: AboutPageData }) {
  const intro = assertSection('about_intro', data.intro);
  const story = assertSection('about_story', data.story);
  const milestone = assertSection('about_milestone', data.milestone);
  const team = assertSection('about_team_roles', data.team);
  const testimonials = assertSection('about_testimonials', data.testimonials);
  const timeline = assertSection('about_timeline', data.timeline);
  const performance = assertSection('about_performance', data.performance);
  const cta = assertSection('about_cta', data.cta);

  return (
    <div className="space-y-10 sm:space-y-16 py-6 sm:py-8 px-4 md:px-6 lg:px-8 pb-24 lg:pb-8">
      <RevealOnScroll delayMs={0} hoverParallax>
        <Section tone="white">
          <AboutIntroSection data={intro} />
        </Section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={120} hoverParallax>
        <Section tone="white">
          <OurStorySection data={story} />
        </Section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={200} hoverParallax>
        <Section tone="white">
          <MilestoneHighlight data={milestone} />
        </Section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={280} hoverParallax>
        <Section tone="white">
          <TeamRolesPreview data={team} />
        </Section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={440} hoverParallax>
        <Section tone="white">
          <TestimonialsSlider data={testimonials} />
        </Section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={520} hoverParallax>
        <Section tone="white">
          <CompanyTimeline data={timeline} />
        </Section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={600} hoverParallax>
        <Section tone="white">
          <PerformanceMetric data={performance} />
        </Section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={680} hoverParallax>
        <Section tone="brand" className="rounded-3xl py-16 text-white">
          <PrimaryCTASection data={cta} />
        </Section>
      </RevealOnScroll>
    </div>
  );
}
