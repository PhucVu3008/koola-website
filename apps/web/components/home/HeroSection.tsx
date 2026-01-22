import Image from 'next/image';

import { Button } from '../ui/Button';

export type HeroSectionData = {
  label: string;
  headline: readonly string[];
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: { src: string; alt: string };
};

/**
 * Home hero section (two-column: text left, image right).
 */
export function HeroSection({ data }: { data: HeroSectionData }) {
  const isPlaceholderAsset = data.image.src.startsWith('/home/');

  return (
    <div className="grid grid-cols-2 items-center gap-12">
      <div className="pl-12 md:pl-16 lg:pl-24">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {data.label}
        </div>
        <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900">
          {data.headline.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500">{data.subhead}</p>

        <div className="mt-8 flex items-center gap-4">
          <Button href={data.primaryCta.href} variant="primary">
            {data.primaryCta.label}
          </Button>
          <Button href={data.secondaryCta.href} variant="secondary">
            {data.secondaryCta.label}
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="relative overflow-hidden rounded-[36px] bg-slate-100">
          {isPlaceholderAsset ? (
            <div
              className="h-[420px] w-full bg-gradient-to-br from-slate-100 to-slate-200"
              aria-label={data.image.alt}
            />
          ) : (
            <Image
              src={data.image.src}
              alt={data.image.alt}
              width={640}
              height={440}
              className="h-[420px] w-full object-cover"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
}
