import Image from 'next/image';

import { Button } from '../ui/Button';
import { InteractiveCard } from '../ui/InteractiveCard';

export type TeamRolesPreviewData = {
  title: string;
  ctaLabel: string;
  ctaHref?: string;
  roles: ReadonlyArray<{ role: string; image: string }>;
};

/**
 * Team roles avatar strip.
 */
export function TeamRolesPreview({ data }: { data: TeamRolesPreviewData }) {
  return (
    <div className="text-center">
      <div className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-slate-900">{data.title}</div>

      {/* Responsive: 3 per row mobile, all in row on desktop */}
      <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8">
        {data.roles.map((r) => (
          <InteractiveCard key={r.role} className="inline-block">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 sm:h-20 sm:w-20 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-0.5 sm:p-1">
                <Image
                  src={r.image}
                  alt={r.role}
                  width={80}
                  height={80}
                  className="h-full w-full rounded-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-2 sm:mt-3 whitespace-pre-line text-[10px] sm:text-xs font-medium text-slate-700 transition-colors duration-300 group-hover:text-slate-900">
                {r.role}
              </div>
            </div>
          </InteractiveCard>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 flex justify-center">
        <Button href={data.ctaHref || '/contact'} variant="secondary" className="text-sm">
          {data.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
