import { ServiceOverviewCard, type ServiceOverviewItem } from './ServiceOverviewCard';

export type ServiceOverviewListData = {
  title: string;
  items: ServiceOverviewItem[];
};

type ServiceOverviewListProps = {
  data: ServiceOverviewListData;
  locale: string;
  viewMoreLabel: string;
};

/**
 * Alternating service overview list.
 *
 * Renders ServiceOverviewCard in an alternating layout
 * (text-left/image-right, then image-left/text-right).
 *
 * Used on both the Services page and Home page.
 */
export function ServiceOverviewList({ data, locale, viewMoreLabel }: ServiceOverviewListProps) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-16">
      {/* Section Title */}
      <div className="mb-10 sm:mb-14 text-center">
        <h2 className="inline-flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-semibold text-slate-900">
          <span className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-500" />
          {data.title}
        </h2>
      </div>

      {/* Service cards — alternating layout with dividers */}
      <div className="mx-auto max-w-6xl">
        {data.items.map((item, index) => (
          <div key={item.id}>
            {index > 0 && <div className="my-10 sm:my-14 lg:my-16 h-px bg-slate-200" />}
            <ServiceOverviewCard
              item={item}
              reversed={index % 2 !== 0}
              locale={locale}
              viewMoreLabel={viewMoreLabel}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
