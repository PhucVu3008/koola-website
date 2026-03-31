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

      {/* Content sections with visible dot-grid + soft gradient background */}
      <div className="relative overflow-hidden">
        {/* Dot grid — mix-blend-mode: multiply renders through bg-white child sections */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(5,150,105,0.20) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
            mixBlendMode: 'multiply',
            zIndex: 1,
          }}
        />
        {/* Soft emerald blob — top-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 70%)',
            mixBlendMode: 'multiply',
            zIndex: 1,
          }}
        />
        {/* Soft amber blob — bottom-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-32 h-[400px] w-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)',
            mixBlendMode: 'multiply',
            zIndex: 1,
          }}
        />

        {/* Services Overview */}
        <div className="relative" style={{ zIndex: 2 }}>
          <ServiceOverviewList data={data.servicesList} locale={locale} viewMoreLabel={data.viewMoreLabel} />
        </div>

        {/* Mid-page Quote */}
        <div className="relative" style={{ zIndex: 2 }}>
          <ServicesMidQuote data={data.midQuote} />
        </div>

        {/* CTA Banner */}
        <div className="relative" style={{ zIndex: 2 }}>
          <ServicesCTASection data={data.cta} />
        </div>
      </div>
    </div>
  );
}
