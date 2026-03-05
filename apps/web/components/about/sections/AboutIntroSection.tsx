import Image from 'next/image';

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
    <div className="grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-2">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{data.label}</div>
        <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-normal leading-relaxed text-slate-900">{data.headline}</h1>

        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-sm leading-relaxed text-slate-600">
          {data.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Image - full width mobile, fixed size desktop */}
      <div className="flex justify-center lg:justify-end">
        <div className="relative w-full max-w-sm sm:max-w-md lg:h-[280px] lg:w-[380px] aspect-[4/3] lg:aspect-auto overflow-hidden rounded-2xl sm:rounded-[32px] shadow-lg">
          <Image 
            src={data.image.src} 
            alt={data.image.alt} 
            fill
            className="object-cover"
            quality={95}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
