/**
 * Contact Hero Section
 * 
 * Top banner for contact page with title and subtitle.
 * Animated immediately on page load (always visible).
 */

export type ContactHeroData = {
  title: string;
  subtitle: string;
};

export type ContactHeroSectionProps = {
  data: ContactHeroData;
};

export function ContactHeroSection({ data }: ContactHeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-brand-50 via-white to-brand-50/30 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 md:text-xl">
            {data.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
