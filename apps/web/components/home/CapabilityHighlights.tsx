import { Card } from '../ui/Card';
import { InteractiveCard } from '../ui/InteractiveCard';
import { BarChart3, Layout, ShieldCheck } from 'lucide-react';

export type CapabilityHighlightsData = {
  heading: string;
  items: ReadonlyArray<{ icon: string; title: string; description: string }>;
};

function CapabilityIcon({ name }: { name: string }) {
  const common =
    'grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100';

  const iconCls = 'h-[18px] w-[18px]';

  // Map icons to content meaning.
  if (name === 'chat') {
    return (
      <div className={common} aria-hidden>
        <Layout className={iconCls} />
      </div>
    );
  }

  if (name === 'shield') {
    return (
      <div className={common} aria-hidden>
        <ShieldCheck className={iconCls} />
      </div>
    );
  }

  return (
    <div className={common} aria-hidden>
      <BarChart3 className={iconCls} />
    </div>
  );
}

/**
 * Capabilities overview section.
 */
export function CapabilityHighlights({
  data,
}: {
  data: CapabilityHighlightsData;
}) {
  return (
    <div className="space-y-10">
      <p className="text-center text-sm font-medium text-slate-700">{data.heading}</p>

      <div className="grid grid-cols-3 gap-8">
        {data.items.map((it) => (
          <InteractiveCard key={it.title}>
            <Card className="flex h-full flex-col p-7">
              <div className="transition-transform duration-300 ease-out group-hover:scale-105">
                <CapabilityIcon name={it.icon} />
              </div>
              <div className="mt-5 text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                {it.title}
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                {it.description}
              </p>
              <div className="mt-auto" />
            </Card>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
