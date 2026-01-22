import Image from 'next/image';

export type ServicesHeroData = {
  label: string;
  title: string;
  backgroundImage: string;
};

/**
 * Services Hero Banner
 *
 * Full-width hero with background image, rounded bottom corners,
 * left-aligned label + title overlay.
 */
export function ServicesHero({ data }: { data: ServicesHeroData }) {
  return (
    <section className="relative h-[420px] w-full overflow-hidden rounded-b-[42px] bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600">
      {/* Background Image with Icons */}
      <div className="absolute inset-0">
        <Image
          src={data.backgroundImage}
          alt={data.title}
          fill
          className="object-cover opacity-90"
          priority
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-transparent" />
      </div>

      {/* Decorative Icons - floating in background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-[15%] top-[15%] h-16 w-16 animate-float-slow opacity-20">
          <div className="h-full w-full rounded-lg bg-white/30 backdrop-blur-sm" />
        </div>
        <div className="absolute right-[25%] top-[40%] h-12 w-12 animate-float-medium opacity-20">
          <div className="h-full w-full rounded-full bg-white/30 backdrop-blur-sm" />
        </div>
        <div className="absolute right-[35%] top-[25%] h-10 w-10 animate-float-fast opacity-20">
          <div className="h-full w-full rounded-lg bg-white/30 backdrop-blur-sm" />
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 flex h-full items-center px-6">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="mb-4 inline-block rounded-full border border-yellow-400/40 bg-yellow-500/20 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-yellow-300 backdrop-blur-sm">
            {data.label}
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {data.title}
          </h1>
        </div>
      </div>

      {/* Decorative hand illustration (right side) */}
      <div className="absolute bottom-0 right-[10%] h-[60%] w-[30%] opacity-80">
        <div className="relative h-full w-full">
          {/* Simplified hand silhouette representation */}
          <div className="absolute bottom-0 right-0 h-[80%] w-[60%] rounded-t-full bg-gradient-to-t from-white/10 to-transparent backdrop-blur-sm" />
        </div>
      </div>
    </section>
  );
}
