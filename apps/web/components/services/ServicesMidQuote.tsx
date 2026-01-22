import Image from 'next/image';

export type ServicesMidQuoteData = {
  imageUrl: string;
  headline: string;
  paragraph: string;
};

/**
 * Services Mid-page Quote Section
 *
 * Two-column layout:
 * - Left: large photo with decorative pixel blocks
 * - Right: text block with green outline, large headline, supporting paragraph
 */
export function ServicesMidQuote({ data }: { data: ServicesMidQuoteData }) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="container">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            {/* Decorative pixel blocks (top-left corner) */}
            <div className="absolute left-0 top-0 z-20 grid grid-cols-3 gap-2 -translate-x-6 -translate-y-6">
              <div className="h-4 w-4 animate-pulse rounded-sm bg-blue-500" style={{ animationDelay: '0ms' }} />
              <div className="h-4 w-4 animate-pulse rounded-sm bg-purple-500" style={{ animationDelay: '200ms' }} />
              <div className="h-4 w-4 animate-pulse rounded-sm bg-pink-500" style={{ animationDelay: '400ms' }} />
              <div className="h-4 w-4 animate-pulse rounded-sm bg-blue-400" style={{ animationDelay: '600ms' }} />
              <div className="h-4 w-4 animate-pulse rounded-sm bg-purple-400" style={{ animationDelay: '800ms' }} />
              <div className="h-4 w-4 animate-pulse rounded-sm bg-pink-400" style={{ animationDelay: '1000ms' }} />
            </div>

            {/* Image with shadow */}
            <div className="relative h-[480px] w-full overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={data.imageUrl}
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>

            {/* Decorative element bottom-right */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/20 blur-2xl" />
          </div>

          {/* Right: Quote Block */}
          <div className="relative animate-fade-in-up">
            {/* Green outline border with subtle glow */}
            <div className="relative rounded-3xl border-2 border-emerald-500/30 bg-white p-12 shadow-lg">
              {/* Top-left accent */}
              <div className="absolute left-0 top-0 h-20 w-20 rounded-tl-3xl border-l-4 border-t-4 border-emerald-500/40" />
              
              <blockquote className="space-y-6">
                <p className="text-2xl font-semibold leading-tight text-slate-900">
                  {data.headline}
                </p>
                <p className="text-base leading-relaxed text-slate-600">
                  {data.paragraph}
                </p>
              </blockquote>

              {/* Bottom-right accent */}
              <div className="absolute bottom-0 right-0 h-20 w-20 rounded-br-3xl border-b-4 border-r-4 border-emerald-500/40" />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-green-500/5 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
