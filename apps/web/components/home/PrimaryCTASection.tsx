import Image from 'next/image';

import { Button } from '../ui/Button';

export type PrimaryCTASectionData = {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref?: string;
  image: string;
};

/**
 * Final primary CTA section (high visual weight).
 */
export function PrimaryCTASection({ data }: { data: PrimaryCTASectionData }) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold leading-tight">{data.title}</h2>
        {data.subtitle && (
          <p className="mt-6 text-base leading-relaxed opacity-90">{data.subtitle}</p>
        )}
        <div className="mt-8 flex justify-center">
          <Button href={data.ctaHref || '/contact'} variant="primary" className="bg-white text-blue-600 hover:bg-white/90">
            {data.ctaLabel}
          </Button>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-[42px] bg-white/10">
          <Image
            src={data.image}
            alt="Team collaboration"
            width={980}
            height={420}
            className="h-[320px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
