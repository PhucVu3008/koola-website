import Image from 'next/image';

import { Button } from '../ui/Button';

export type TrustedLogosData = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  logos: ReadonlyArray<string>;
};

/**
 * Trusted logos strip.
 */
export function TrustedLogos({ data }: { data: TrustedLogosData }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>
      <p className="mt-2 text-sm text-slate-500">{data.subtitle}</p>

      <div className="mt-10 flex items-center justify-center gap-10 opacity-70">
        {data.logos.map((logo) => (
          <Image
            key={logo}
            src={`/home/logos/${logo}.svg`}
            alt={logo}
            width={90}
            height={28}
            className="h-7 w-auto grayscale"
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button href="/contact" variant="primary" className="h-9 px-6 text-xs">
          {data.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
