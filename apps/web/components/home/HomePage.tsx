import Image from 'next/image';

import { getHomeData, HOME } from '../../src/lib/home/homeData';
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
 * Services section now fetches real data from database instead of static content.
 */
export async function HomePage({ locale = 'en' }: { locale?: 'en' | 'vi' } = {}) {
  const data = getHomeData(locale);

  return (
    <>
      {/* Hero Section - Full width, no wrapper */}
      <HeroSection data={data.hero} />

      <div className="space-y-16 py-8">
        <RevealOnScroll delayMs={80} hoverParallax>
          <Section tone="white">
            <CapabilityHighlights data={data.capabilities} />
          </Section>
        </RevealOnScroll>

      <RevealOnScroll delayMs={160} hoverParallax>
        <Section tone="white">
          <HomeServicesSection locale={locale} title={data.services.title} />
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
    </>
  );
}
