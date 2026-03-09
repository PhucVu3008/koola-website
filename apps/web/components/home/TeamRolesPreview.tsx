import { Button } from '../ui/Button';

export type TeamRolesPreviewData = {
  title: string;
  ctaLabel: string;
  ctaHref?: string;
  roles: ReadonlyArray<{ role: string; image?: string }>;
};

/**
 * Team roles tag strip — displays role names as pill badges without avatars.
 */
export function TeamRolesPreview({ data }: { data: TeamRolesPreviewData }) {
  return (
    <div className="text-center">
      <p className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-slate-600">{data.title}</p>

      {/* Role pill badges */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {data.roles.map((r) => (
          <span
            key={r.role}
            className="whitespace-pre-line rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs sm:text-sm font-medium text-blue-700 leading-snug"
          >
            {r.role.replace('\n', ' ')}
          </span>
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
