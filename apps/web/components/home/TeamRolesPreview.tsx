import Image from 'next/image';

import { Button } from '../ui/Button';
import { InteractiveCard } from '../ui/InteractiveCard';

export type TeamRolesPreviewData = {
  title: string;
  ctaLabel: string;
  roles: ReadonlyArray<{ role: string; image: string }>;
};

/**
 * Team roles avatar strip.
 */
export function TeamRolesPreview({ data }: { data: TeamRolesPreviewData }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-10">
        {data.roles.map((r) => (
          <InteractiveCard key={r.role} className="inline-block">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src={r.image}
                  alt={r.role}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                />
              </div>
              <div className="mt-4 text-xs font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-900">
                {r.role}
              </div>
            </div>
          </InteractiveCard>
        ))}
      </div>

      <div className="mt-10">
        <div className="text-2xl font-semibold text-slate-900">{data.title}</div>
        <div className="mt-6 flex justify-center">
          <Button href="/contact" variant="primary" className="h-9 px-7 text-xs">
            {data.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
