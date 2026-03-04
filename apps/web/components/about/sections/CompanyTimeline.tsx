import { Card } from '../../ui/Card';

export type CompanyTimelineItem = {
  year: string;
  title: string;
  description: string;
};

export type CompanyTimelineData = {
  label: string;
  items: CompanyTimelineItem[];
};

/**
 * Section 7: Company Timeline (horizontal cards).
 */
export function CompanyTimeline({ data }: { data: CompanyTimelineData }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{data.label}</div>

      {/* Mobile: 1 cột, Tablet: 2 cột, Desktop: 3 cột */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((it) => (
          <Card key={it.year} className="p-6">
            <div className="text-xs font-semibold text-brand-700">{it.year}</div>
            <div className="mt-3 text-sm font-semibold text-slate-900">{it.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{it.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
