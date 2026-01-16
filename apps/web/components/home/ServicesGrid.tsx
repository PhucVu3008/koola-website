import { Card } from '../ui/Card';
import { InteractiveCard } from '../ui/InteractiveCard';
import { Brain, Cloud, Code2, PenTool, Smartphone, TestTube2 } from 'lucide-react';

export type ServicesGridData = {
  title: string;
  items: ReadonlyArray<{ icon: string; title: string; description: string }>;
};

function ServiceIcon({ name }: { name: string }) {
  const common =
    'grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200';

  const iconCls = 'h-[18px] w-[18px]';

  const Icon =
    name === 'code'
      ? Code2
      : name === 'spark'
        ? TestTube2
        : name === 'brain'
          ? Brain
          : name === 'pen'
            ? PenTool
            : name === 'phone'
              ? Smartphone
              : Cloud;

  return (
    <div className={common} aria-hidden>
      <Icon className={iconCls} />
    </div>
  );
}

/**
 * Services overview grid (2 rows, 3 columns).
 */
export function ServicesGrid({ data }: { data: ServicesGridData }) {
  return (
    <div className="space-y-10">
      <div className="flex items-start gap-4">
        <div className="h-7 w-7 rounded-lg bg-brand-100" aria-hidden />
        <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-slate-900">
          {data.title}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-7">
        {data.items.map((it) => (
          <InteractiveCard key={it.title}>
            <Card className="flex h-full flex-col p-7">
              <div className="transition-transform duration-300 ease-out group-hover:scale-105">
                <ServiceIcon name={it.icon} />
              </div>
              <div className="mt-5 text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                {it.title}
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                {it.description}
              </p>
              {/* Keep baseline consistent across cards even when text is shorter. */}
              <div className="mt-auto" />
            </Card>
          </InteractiveCard>
        ))}
      </div>
    </div>
  );
}
