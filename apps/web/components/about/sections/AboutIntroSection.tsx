port Image from 'next/image';

export type AboutIntroSectionData = {
  label: string;
  headline: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

/**
 * Section 1: About Intro (two-column, text left + decorative image right).
 */
export function AboutIntroSection({ data }: { data: AboutIntroSectionData }) {
  return (
    <div className="grid grid-cols-2 items-start gap-12">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{data.label}</div>
        <h1 className="mt-4 text-2xl font-normal leading-relaxed text-slate-900">{data.headline}</h1>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
          {data.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="relative h-[280px] w-[380px] overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-200 to-blue-200">
          <Image src={data.image.src} alt={data.image.alt} width={760} height={560} className="h-full w-full object-cover mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
}
