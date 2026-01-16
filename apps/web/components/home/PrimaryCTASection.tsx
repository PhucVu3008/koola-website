import Image from 'next/image';

import { Button } from '../ui/Button';

export type PrimaryCTASectionData = {
  title: string;
  ctaLabel: string;
  image: string;
};

/**
 * Final primary CTA section (high visual weight).
 */
export function PrimaryCTASection({ data }: { data: PrimaryCTASectionData }) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold leading-tight">{data.title}</h2>
        <div className="mt-8 flex justify-center">
          <Button href="/contact" variant="primary" className="bg-white text-brand-700 hover:bg-white/90">
            {data.ctaLabel}
          </Button>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-[42px] bg-white/10">
          <Image
            src={data.image}
            alt="Team photo"
            width={980}
            height={420}
            className="h-[320px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
