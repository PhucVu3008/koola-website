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
 * Services CTA section — full-width background image (B&W),
 * white italic title, white pill button with brand-colored text + arrow.
 * Matches PrimaryCTASection style.
 */
export function ServicesCTASection({ data }: { data: ServicesCTASectionData }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background image — grayscale + dark overlay */}
      <div className="absolute inset-0">
        <Image
          src={data.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover grayscale"
          quality={75}
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Dotted pattern at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 sm:py-28 lg:py-32 text-center">
        <h2 className="max-w-3xl text-2xl sm:text-3xl lg:text-4xl font-bold italic leading-snug text-white">
          {data.title}
        </h2>

        {data.subtitle && (
          <p className="mt-4 max-w-2xl text-base text-white/80">{data.subtitle}</p>
        )}

        <Link
          href={data.ctaHref || '/contact'}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm sm:text-base font-semibold text-brand-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          {data.ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
