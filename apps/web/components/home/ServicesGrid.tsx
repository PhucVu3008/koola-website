import Link from 'next/link';
import { Card } from '../ui/Card';
import { InteractiveCard } from '../ui/InteractiveCard';
import { Brain, Cloud, Code2, PenTool, Smartphone, TestTube2 } from 'lucide-react';

export type ServicesGridData = {
  title: string;
  items: ReadonlyArray<{ 
    slug: string; 
    icon: string; 
    title: string; 
    description: string;
  }>;
};

export type ServicesGridProps = {
  data: ServicesGridData;
  locale: 'en' | 'vi';
};

function ServiceIcon({ name }: { name: string }) {
  // Icon container with tech-style animations on hover
  const common =
    'relative grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:via-purple-50 group-hover:to-pink-50 group-hover:ring-2 group-hover:ring-blue-300 group-hover:shadow-lg group-hover:shadow-blue-200/50';

  // Icon with rotation and scale animation
  const iconCls = 'h-[18px] w-[18px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-blue-600';

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
      {/* Animated glow effect behind icon */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/0 via-purple-400/0 to-pink-400/0 opacity-0 blur-md transition-all duration-500 group-hover:from-blue-400/30 group-hover:via-purple-400/20 group-hover:to-pink-400/30 group-hover:opacity-100" />
      
      {/* Pulse ring effect */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-blue-400/0 transition-all duration-500 group-hover:scale-150 group-hover:ring-blue-400/30 group-hover:opacity-0" />
      
      {/* Icon */}
      <Icon className={iconCls} />
    </div>
  );
}

/**
 * Services overview grid (2 rows, 3 columns).
 * Now displays real services from database with links to detail pages.
 */
export function ServicesGrid({ data, locale }: ServicesGridProps) {
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
          <Link 
            key={it.slug} 
            href={`/${locale}/services/${it.slug}`}
            className="group block h-full transition-transform duration-300 hover:scale-[1.02]"
          >
            <InteractiveCard>
              <Card className="flex h-full min-h-[200px] flex-col p-7">
                <div className="transition-transform duration-300 ease-out">
                  <ServiceIcon name={it.icon} />
                </div>
                <div className="mt-5 text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                  {it.title}
                </div>
                <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-500 transition-colors duration-300 group-hover:text-slate-700">
                  {it.description}
                </p>
                {/* Keep baseline consistent across cards even when text is shorter. */}
                <div className="mt-auto" />
              </Card>
            </InteractiveCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
