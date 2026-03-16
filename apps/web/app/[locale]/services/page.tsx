import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ServicesPage } from '../../../components/services';

export const dynamic = 'force-dynamic';
import { getServices, getServicesPage } from '../../../src/lib/api/services';
import { getDictionary } from '../../../src/i18n/getDictionary';
import { isLocale, type Locale } from '../../../src/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    title: dict.meta.servicesTitle,
    description: dict.meta.servicesDescription,
  };
}

export default async function ServicesPageRoute({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  // Fetch page content and services list
  const [pageData, servicesData] = await Promise.all([
    getServicesPage({ locale }),
    getServices({ locale, pageSize: 100, sort: 'order' }), // Fetch all services (up to 100)
  ]);

  // Transform API data into component props
  const servicesPageData = {
    hero: {
      label: pageData.hero.label,
      title: pageData.hero.title,
      backgroundImage: pageData.hero.backgroundImage,
    },
    servicesList: {
      title: dict.services.grid.title,
      items: servicesData.items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt || '',
        imageUrl: item.hero_image_url || `/services/${item.slug_group || item.slug}.jpg`,
        category: item.categories?.[0]?.name ?? item.tags?.[0]?.name,
        iconName: item.icon_name,
      })),
    },
    midQuote: {
      imageUrl: pageData.midQuote.imageUrl,
      headline: pageData.midQuote.headline,
      paragraph: pageData.midQuote.paragraph,
    },
    cta: {
      title: pageData.cta.title,
      ctaLabel: pageData.cta.buttonLabel,
      ctaHref: `/${locale}/contact`,
      image: pageData.cta.image,
    },
    viewMoreLabel: dict.services.viewMore,
  };

  return <ServicesPage data={servicesPageData} locale={locale} />;
}
