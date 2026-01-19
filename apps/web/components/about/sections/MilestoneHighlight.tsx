export type MilestoneHighlightData = {
  label: string;
  headline: string;
  iconAlt: string;
};

/**
 * Section 3: Milestone Highlight.
 */
export function MilestoneHighlight({ data }: { data: MilestoneHighlightData }) {
  return (
    <div className="flex items-center justify-between gap-12">
      <div className="flex items-center gap-6">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg" aria-label={data.iconAlt}>
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.5 5.8 6.3.5-4.8 4.1 1.5 6.2L12 16.1 6.5 18.6 8 12.4 3.2 8.3l6.3-.5L12 2Z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-700">{data.label}</div>
        </div>
      </div>

      <div className="max-w-2xl text-lg font-normal leading-relaxed text-slate-900">{data.headline}</div>
    </div>
  );
}
