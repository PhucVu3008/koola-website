import Image from 'next/image';

import { getHomeData, HOME } from '../../src/lib/home/homeData';
import { getPageBySlug } from '../../src/lib/api/pages';
import { Section } from '../ui/Section';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { HeroSection } from './HeroSection';
import { CapabilityHighlights } from './CapabilityHighlights';
import { HomeServicesSection } from './HomeServicesSection';
import { TrustedLogos } from './TrustedLogos';
import { ValuePropositionSlider } from './ValuePropositionSlider';
import { BlogPreviewGrid } from './BlogPreviewGrid';
import { TeamRolesPreview } from './TeamRolesPreview';
import { PrimaryCTASection } from './PrimaryCTASection';

/**
 * Home page composition.
 * 
 * Now loads content from CMS (pages + page_sections).
 * Falls back to hard-coded content if CMS data is not available.
 * 
 * CMS Integration:
 * - Hero section: section_key='hero'
 * - Services showcase: section_key='services_showcase'
 * - Why choose us: section_key='why_choose_us'
 * - Other sections: Use hard-coded data (capabilities, trusted logos, blog, team, CTA)
 */
export async function HomePage({ locale = 'en' }: { locale?: 'en' | 'vi' } = {}) {
  // Load hard-coded data as fallback
  const fallbackData = getHomeData(locale);
  
  // Try to load CMS data
  let cmsData: Awaited<ReturnType<typeof getPageBySlug>> | null = null;
  try {
    cmsData = await getPageBySlug({ slug: 'home', locale });
  } catch (error) {
    console.warn('[HomePage] Failed to load CMS data, using fallback:', error);
  }

  // Helper to get section payload from CMS
  const getCmsSection = (key: string) => {
    if (!cmsData) return null;
    return cmsData.sections.find((s) => s.section_key === key)?.payload;
  };

  // For now, use hard-coded data for hero (complex structure)
  // CMS sections can be used for simpler content
  const heroData = fallbackData.hero;
  const servicesTitle = ((getCmsSection('services_showcase') as any)?.title as string) || fallbackData.services.title;
  
  // Use hard-coded data for sections not managed by CMS yet
  const data = fallbackData;

  return (
    <>
      {/* Hero Section - Full width, no wrapper */}
      <HeroSection data={heroData} />

      {/* Main Content - Add container with padding to prevent horizontal overflow */}
      <div className="fluid-container">
        <div className="space-y-16 py-8">
          <RevealOnScroll delayMs={80} hoverParallax>
            <Section tone="white">
              <CapabilityHighlights data={data.capabilities} />
            </Section>
          </RevealOnScroll>

        <RevealOnScroll delayMs={160} hoverParallax>
          <Section tone="white">
            <HomeServicesSection locale={locale} title={servicesTitle} />
          </Section>
        </RevealOnScroll>

        <RevealOnScroll delayMs={240} hoverParallax>
          <Section tone="muted" className="rounded-3xl py-16">
            <TrustedLogos data={data.trusted} />
          </Section>
        </RevealOnScroll>

        <RevealOnScroll delayMs={320} hoverParallax>
          <Section tone="white">
            <ValuePropositionSlider data={data.valueProps} />
          </Section>
        </RevealOnScroll>

        <RevealOnScroll delayMs={400} hoverParallax>
          <Section tone="white">
            <BlogPreviewGrid data={data.blog} />
          </Section>
        </RevealOnScroll>

        <RevealOnScroll delayMs={480} hoverParallax>
          <Section tone="white">
            <TeamRolesPreview data={data.team} />
          </Section>
        </RevealOnScroll>

        <RevealOnScroll delayMs={560} hoverParallax>
          <Section tone="brand" className="rounded-3xl py-16 text-white">
            <PrimaryCTASection data={data.primaryCta} />
          </Section>
        </RevealOnScroll>
        </div>
      </div>
    </>
  );
}
