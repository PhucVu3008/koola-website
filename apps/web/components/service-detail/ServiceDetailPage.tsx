/**
 * ServiceDetailPage Component
 *
 * Main page orchestrator that composes all service detail sections:
 * 1. ServiceDetailHero
 * 2. Two-column layout (Content + Sidebar)
 * 3. KeyBenefits
 * 4. RelatedContent
 *
 * Reuses SiteHeader and SiteFooter from layout.
 */

import { ServiceDetailHero } from './ServiceDetailHero';
import { ServiceDetailContent } from './ServiceDetailContent';
import { ServiceDetailSidebar } from './ServiceDetailSidebar';
import { KeyBenefits } from './KeyBenefits';
import { RelatedContent } from './RelatedContent';

import type {
  ServiceDetailHeroData,
  ServiceDetailContentData,
  ServiceDetailSidebarData,
  KeyBenefitsData,
  RelatedContentData,
} from './types';

export type ServiceDetailPageData = {
  hero: ServiceDetailHeroData;
  content: ServiceDetailContentData;
  sidebar: ServiceDetailSidebarData;
  benefits: KeyBenefitsData;
  related: RelatedContentData;
};

export function ServiceDetailPage({ data, locale }: { data: ServiceDetailPageData; locale: string }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <ServiceDetailHero data={data.hero} />

      {/* Add spacing for overlapping hero card - Responsive */}
      <div className="h-16 sm:h-24" />

      {/* Two-column layout: Content + Sidebar - Responsive */}
      <section className="bg-white py-8 sm:py-16">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_360px]">
            {/* Main Content (Left) */}
            <ServiceDetailContent data={data.content} />

            {/* Sidebar (Right) - Stack below on mobile */}
            <ServiceDetailSidebar data={data.sidebar} />
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <KeyBenefits data={data.benefits} />

      {/* Related Content Section */}
      <RelatedContent data={data.related} locale={locale} />
    </div>
  );
}
