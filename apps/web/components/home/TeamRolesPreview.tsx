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
      <div className="mb-8 text-center text-base leading-relaxed text-slate-900">{data.title}</div>

      <div className="flex items-center justify-center gap-8">
        {data.roles.map((r) => (
          <InteractiveCard key={r.role} className="inline-block">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-1">
                <Image
                  src={r.image}
                  alt={r.role}
                  width={80}
                  height={80}
                  className="h-full w-full rounded-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="mt-3 whitespace-pre-line text-xs font-medium text-slate-700 transition-colors duration-300 group-hover:text-slate-900">
                {r.role}
              </div>
            </div>
          </InteractiveCard>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button href={data.ctaHref || '/contact'} variant="secondary" className="text-sm">
          {data.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
