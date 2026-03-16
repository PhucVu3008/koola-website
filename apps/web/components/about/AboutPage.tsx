import { Section } from '../ui/Section';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { AboutIntroSection, type AboutIntroSectionData } from './sections/AboutIntroSection';
import { OurStorySection, type OurStorySectionData } from './sections/OurStorySection';
import { MissionValues, type MissionValuesData } from './sections/MissionValues';
import { TeamRolesPreview, type TeamRolesPreviewData } from '../home/TeamRolesPreview';
import { WorkProcess, type WorkProcessData } from './sections/WorkProcess';
import { PrimaryCTASection, type PrimaryCTASectionData } from '../home/PrimaryCTASection';

export type AboutPageData = {
  intro: AboutIntroSectionData | null;
  story: OurStorySectionData | null;
  missionValues: MissionValuesData | null;
  team: TeamRolesPreviewData | null;
  process: WorkProcessData | null;
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
  const missionValues = assertSection('about_mission_values', data.missionValues);
  const team = assertSection('about_team_roles', data.team);
  const process = assertSection('about_process', data.process);
  const cta = assertSection('about_cta', data.cta);

  return (
    <>
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
            <MissionValues data={missionValues} />
          </Section>
        </RevealOnScroll>

        <RevealOnScroll delayMs={280} hoverParallax>
          <Section tone="white">
            <TeamRolesPreview data={team} />
          </Section>
        </RevealOnScroll>

        <RevealOnScroll delayMs={440} hoverParallax>
          <Section tone="white">
            <WorkProcess data={process} />
          </Section>
        </RevealOnScroll>
      </div>

      {/* CTA — full width, outside container */}
      <RevealOnScroll delayMs={520} hoverParallax>
        <PrimaryCTASection data={cta} />
      </RevealOnScroll>
    </>
  );
}
