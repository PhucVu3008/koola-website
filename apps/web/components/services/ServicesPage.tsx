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

      {/* Services Overview */}
      <ServiceOverviewList data={data.servicesList} locale={locale} viewMoreLabel={data.viewMoreLabel} />

      {/* Mid-page Quote */}
      <ServicesMidQuote data={data.midQuote} />

      {/* CTA Banner */}
      <ServicesCTASection data={data.cta} />
    </div>
  );
}
