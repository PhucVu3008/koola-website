export type WorkProcessData = {
  title: string;
  subtitle: string;
  steps: Array<{ step: number; title: string; description: string }>;
};

/** Section: Work Process — 4-step horizontal timeline. */
export function WorkProcess({ data }: { data: WorkProcessData }) {
  return (
    <div>
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{data.title}</h2>
        <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto">{data.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.steps.map((s, i) => (
          <div key={s.step} className="relative flex flex-col items-center text-center p-6">
            {/* Connector line (hidden on first item and mobile) */}
            {i > 0 && (
              <div className="hidden lg:block absolute top-8 -left-3 w-6 h-0.5 bg-brand-200" aria-hidden="true" />
            )}
            {/* Step number */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-lg font-bold shadow-md">
              {s.step}
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 text-lg">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
