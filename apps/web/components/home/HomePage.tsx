import { getHomeData } from '../../src/lib/home/homeData';
import { getPageBySlug } from '../../src/lib/api/pages';
import { listPosts } from '../../src/lib/api/posts';
import { Section } from '../ui/Section';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { HeroSection } from './HeroSection';
import { HomeServicesSection } from './HomeServicesSection';
import { ValuePropositionSlider } from './ValuePropositionSlider';
import { BlogPreviewGrid } from './BlogPreviewGrid';
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

  // Fetch latest published posts for blog section
  let homePosts: any[] = [];
  try {
    const postsResult = await listPosts({ locale, page: 1, pageSize: 6, sort: 'newest' });
    homePosts = postsResult.posts;
  } catch (error) {
    console.warn('[HomePage] Failed to load posts:', error);
  }

  // Helper to get section payload from CMS
  const getCmsSection = (key: string) => {
    if (!cmsData) return null;
    return cmsData.sections.find((s) => s.section_key === key)?.payload;
  };

  // For now, use hard-coded data for hero (complex structure)
  // CMS sections can be used for simpler content
  const heroData = {
    ...fallbackData.hero,
    primaryCta: { ...fallbackData.hero.primaryCta, href: `/${locale}${fallbackData.hero.primaryCta.href}` },
    secondaryCta: { ...fallbackData.hero.secondaryCta, href: `/${locale}${fallbackData.hero.secondaryCta.href}` },
  };
  const servicesTitle = ((getCmsSection('services_showcase') as any)?.title as string) || fallbackData.services.title;
  
  // Use hard-coded data for sections not managed by CMS yet
  const data = fallbackData;

  const ctaData = {
    title: data.primaryCta.title,
    ctaLabel: data.primaryCta.ctaLabel,
    ctaHref: `/${locale}/contact`,
    image: data.primaryCta.image,
  };

  return (
    <>
      {/* Hero Section - Full width, no wrapper */}
      <HeroSection data={heroData} />

      {/* Main Content — subtle background from Services section downward */}
      <div className="relative overflow-hidden">
        {/* Dot grid overlay — mix-blend-mode: multiply renders on top of any bg-white children */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(99,102,241,0.22) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
            mixBlendMode: 'multiply',
            zIndex: 1,
          }}
        />
        {/* Soft warm blob — top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)',
            mixBlendMode: 'multiply',
            zIndex: 1,
          }}
        />
        {/* Soft cool blob — bottom-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-40 h-[500px] w-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            mixBlendMode: 'multiply',
            zIndex: 1,
          }}
        />

        <div className="fluid-container relative" style={{ zIndex: 2 }}>
          <div className="space-y-16 py-8">

          <RevealOnScroll delayMs={160} hoverParallax>
              <HomeServicesSection locale={locale} title={servicesTitle} />
          </RevealOnScroll>

          <RevealOnScroll delayMs={320} hoverParallax>
            <Section tone="white">
              <ValuePropositionSlider data={data.valueProps} />
            </Section>
          </RevealOnScroll>

          <RevealOnScroll delayMs={400} hoverParallax>
            <Section tone="white">
              <BlogPreviewGrid
                data={data.blog}
                posts={homePosts.length > 0 ? homePosts : undefined}
                locale={locale}
              />
            </Section>
          </RevealOnScroll>

          </div>
        </div>

        {/* CTA — full-width, outside the fluid container */}
        <div className="relative" style={{ zIndex: 2 }}>
          <RevealOnScroll delayMs={480}>
            <PrimaryCTASection data={ctaData} />
          </RevealOnScroll>
        </div>
      </div>
    </>
  );
}
