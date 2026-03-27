import { AboutIntroSection, type AboutIntroSectionData } from './sections/AboutIntroSection';
import { OurStorySection, type OurStorySectionData } from './sections/OurStorySection';
import { MissionValues, type MissionValuesData } from './sections/MissionValues';
import { WorkProcess, type WorkProcessData } from './sections/WorkProcess';
import { PrimaryCTASection, type PrimaryCTASectionData } from '../home/PrimaryCTASection';

export type AboutPageData = {
  intro: AboutIntroSectionData | null;
  story: OurStorySectionData | null;
  missionValues: MissionValuesData | null;
  /** Team section exists in DB but is not rendered on About page. */
  team: unknown | null;
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
 * About page composition — full-width sections with dark tech aesthetic and scroll animations.
 * Section order: Hero → Our Story → Mission & Values → Work Process → CTA
 */
export function AboutPage({ data }: { data: AboutPageData }) {
  const intro = assertSection('about_intro', data.intro);
  const story = assertSection('about_story', data.story);
  const missionValues = assertSection('about_mission_values', data.missionValues);
  const process = assertSection('about_process', data.process);
  const cta = assertSection('about_cta', data.cta);

  return (
    <main>
      <AboutIntroSection data={intro} />
      <OurStorySection data={story} />
      <MissionValues data={missionValues} />
      <WorkProcess data={process} />
      <PrimaryCTASection data={cta} />
    </main>
  );
}
