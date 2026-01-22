import Image from 'next/image';

export type CareersHeroSectionData = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle: string;
};

/**
 * Careers Hero Banner
 * Full-width background image with centered title + subtitle
 */
export function CareersHeroSection({ data }: { data: CareersHeroSectionData }) {
  return (
    <div className="relative h-[280px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={data.imageUrl}
          alt={data.imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-purple-800/60 to-purple-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="space-y-2 animate-fade-in-up">
          <h1 className="text-3xl font-semibold text-white">
            {data.title}
          </h1>
          <p className="text-lg font-light text-white/90">
            {data.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
