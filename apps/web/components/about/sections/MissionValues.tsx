export type MissionValuesData = {
  title: string;
  subtitle: string;
  values: Array<{ icon: string; title: string; description: string }>;
};

const iconMap: Record<string, JSX.Element> = {
  lightbulb: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 17a1 1 0 0 1-1 1H6l-4-4 2.5-2.5L7 14" />
      <path d="M13 17a1 1 0 0 0 1 1h4l4-4-2.5-2.5L17 14" />
      <path d="m8 8 4-4 4 4" />
      <path d="M12 4v9" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

/** Section: Mission & Core Values — grid of 4 values with icons. */
export function MissionValues({ data }: { data: MissionValuesData }) {
  return (
    <div>
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{data.title}</h2>
        <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {data.values.map((v) => (
          <div key={v.title} className="flex gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              {iconMap[v.icon] ?? iconMap.lightbulb}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{v.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
