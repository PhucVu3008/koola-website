import { ServicesHero, type ServicesHeroData } from './ServicesHero';
import { ServicesGrid, type ServicesGridData } from './ServicesGrid';
import { ServicesMidQuote, type ServicesMidQuoteData } from './ServicesMidQuote';
import { PrimaryCTASection, type PrimaryCTASectionData } from '../home/PrimaryCTASection';

export type ServicesPageData = {
  hero: ServicesHeroData;
  servicesGrid: ServicesGridData;
  midQuote: ServicesMidQuoteData;
  cta: PrimaryCTASectionData;
};

/**
 * Services Page Composition
 *
 * Orchestrates all services page sections:
 * 1. Hero banner
 * 2. Services grid (6 items)
 * 3. Mid-page quote
 * 4. CTA banner
 */
export function ServicesPage({ data, locale }: { data: ServicesPageData; locale: string }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <ServicesHero data={data.hero} />

      {/* Services Grid */}
      <ServicesGrid data={data.servicesGrid} locale={locale} />

      {/* Mid-page Quote */}
      <ServicesMidQuote data={data.midQuote} />

      {/* CTA Banner - Dark background matching reference */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        
        <div className="container relative z-10">
          <PrimaryCTASection data={data.cta} />
        </div>
      </section>
    </div>
  );
}
