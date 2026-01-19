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

      <div className="mt-6 grid grid-cols-3 gap-6">
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
