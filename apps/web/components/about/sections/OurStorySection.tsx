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
    <div className="grid grid-cols-2 items-start gap-16">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] text-brand-700">{data.label}</div>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-500">
          {data.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <div className="relative h-[300px] w-[420px] overflow-hidden rounded-[44px] shadow-lg">
          <Image 
            src={data.image.src} 
            alt={data.image.alt} 
            width={840} 
            height={600} 
            className="h-full w-full object-cover"
            quality={95}
            priority
          />
          {/* Subtle overlay for brand color tint - much lighter */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-brand-500/8" />
        </div>
      </div>
    </div>
  );
}
