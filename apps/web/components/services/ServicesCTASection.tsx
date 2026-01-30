import Image from 'next/image';
import Link from 'next/link';

export type ServicesCTASectionData = {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref?: string;
  image: string;
};

/**
 * Services CTA section with white text on dark background.
 * Button has black text (different from about page which has blue text).
 */
export function ServicesCTASection({ data }: { data: ServicesCTASectionData }) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold leading-tight text-white">{data.title}</h2>
        {data.subtitle && (
          <p className="mt-6 text-base leading-relaxed text-white/90">{data.subtitle}</p>
        )}
        <div className="mt-8 flex justify-center">
          <Link 
            href={data.ctaHref || '/contact'}
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-slate-900 shadow-lg shadow-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/95 hover:shadow-xl hover:shadow-white/30"
          >
            {data.ctaLabel}
          </Link>
        </div>
      </div>

      {data.image && (
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-4xl overflow-hidden rounded-[42px] bg-white/10">
            <Image
              src={data.image}
              alt="Team collaboration"
              width={1200}
              height={600}
              className="h-[320px] w-full object-cover"
              quality={95}
              unoptimized
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
