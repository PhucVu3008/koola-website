import Image from 'next/image';

import { Button } from '../ui/Button';

export type TrustedLogosData = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref?: string;
  logos: ReadonlyArray<string>;
};

/**
 * Trusted logos strip.
 */
export function TrustedLogos({ data }: { data: TrustedLogosData }) {
  return (
    <div className="text-center">
      <div className="mb-8 text-base leading-relaxed text-slate-900">{data.title}</div>

      <div className="flex items-center justify-center gap-12 opacity-60 grayscale">
        {data.logos.map((logo) => (
          <Image
            key={logo}
            src={`/home/logos/${logo}.svg`}
            alt={logo}
            width={100}
            height={32}
            className="h-8 w-auto transition-opacity hover:opacity-100"
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button href={data.ctaHref || '/contact'} variant="secondary" className="text-sm">
          {data.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
