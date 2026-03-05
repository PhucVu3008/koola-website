import Image from 'next/image';

export type OurStorySectionData = {
  label: string;
  paragraphs: string[];
  image: { src: string; alt: string };
};

/**
 * Section 2: Our Story (label + paragraphs left, image right).
 */
export function OurStorySection({ data }: { data: OurStorySectionData }) {
  return (
    <div className="grid grid-cols-1 items-start gap-8 sm:gap-16 lg:grid-cols-2">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] text-brand-700">{data.label}</div>
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-sm leading-7 text-slate-500">
          {data.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Image - full width mobile, fixed size desktop */}
      <div className="flex justify-center lg:justify-end">
        <div className="relative w-full max-w-sm sm:max-w-md lg:h-[300px] lg:w-[420px] aspect-[4/3] lg:aspect-auto overflow-hidden rounded-2xl sm:rounded-[44px] shadow-lg">
          <Image 
            src={data.image.src} 
            alt={data.image.alt} 
            fill
            className="object-cover"
            quality={95}
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-brand-500/8" />
        </div>
      </div>
    </div>
  );
}
