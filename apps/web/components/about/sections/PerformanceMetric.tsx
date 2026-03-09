export type PerformanceMetricData = {
  description: string;
  percent: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Section 8: Performance & Satisfaction Metric (circular progress).
 * Shows target percentage immediately on load.
 */
export function PerformanceMetric({ data }: { data: PerformanceMetricData }) {
  const currentPct = clamp(Number.isFinite(data.percent) ? data.percent : 0, 0, 100);

  // SVG circle math
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - currentPct / 100);

  return (
    <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
      <div>
        <p className="text-sm leading-7 text-slate-500 sm:max-w-xl">{data.description}</p>
      </div>

      {/* Circular progress - centered on mobile */}
      <div className="flex justify-center sm:justify-start">
        <div className="relative h-[110px] w-[110px] sm:h-[120px] sm:w-[120px]">
          <svg viewBox="0 0 120 120" className="h-full w-full" aria-label={`${currentPct}%`}>
            {/* Background circle */}
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="10" />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="rgb(79,70,229)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-2xl sm:text-3xl font-semibold text-brand-700 tabular-nums">
              {currentPct}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
