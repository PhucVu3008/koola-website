import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ServicesPage } from '../../../components/services';
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
    getServices({ locale, pageSize: 6, sort: 'order' }),
  ]);

  // Transform API data into component props
  const servicesPageData = {
    hero: {
      label: pageData.hero.label,
      title: pageData.hero.title,
      backgroundImage: pageData.hero.backgroundImage,
    },
    servicesGrid: {
      title: dict.services.grid.title,
      items: servicesData.items.map((item, index) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        imageUrl: `/services/${item.slug}.jpg`, // Convention: use slug for image filename
        order: index + 1,
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
      image: pageData.cta.backgroundImage,
    },
  };

  return <ServicesPage data={servicesPageData} locale={locale} />;
}
