import { ServicesHero, type ServicesHeroData } from './ServicesHero';
import { ServiceOverviewList, type ServiceOverviewListData } from './ServiceOverviewList';
import { ServicesMidQuote, type ServicesMidQuoteData } from './ServicesMidQuote';
import { ServicesCTASection, type ServicesCTASectionData } from './ServicesCTASection';

export type ServicesPageData = {
  hero: ServicesHeroData;
  servicesList: ServiceOverviewListData;
  midQuote: ServicesMidQuoteData;
  cta: ServicesCTASectionData;
  viewMoreLabel: string;
};

/**
 * Services Page Composition
 *
 * Orchestrates all services page sections:
 * 1. Hero banner
 * 2. Services overview list (alternating cards)
 * 3. Mid-page quote
 * 4. CTA banner
 */
export function ServicesPage({ data, locale }: { data: ServicesPageData; locale: string }) {
  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      {/* Hero Banner */}
      <ServicesHero data={data.hero} />

      {/* Content sections with subtle dot-grid background */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(5,150,105,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Services Overview */}
        <ServiceOverviewList data={data.servicesList} locale={locale} viewMoreLabel={data.viewMoreLabel} />

        {/* Mid-page Quote */}
        <ServicesMidQuote data={data.midQuote} />

        {/* CTA Banner */}
        <ServicesCTASection data={data.cta} />
      </div>
    </div>
  );
}
