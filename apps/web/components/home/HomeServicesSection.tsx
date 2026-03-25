import { getServices } from '../../src/lib/api/services';
import { ServicesGrid } from '../services/ServicesGrid';
import { resolveImageUrl } from '../../src/lib/image-url';

type HomeServicesSectionProps = {
  locale: 'en' | 'vi';
  title: string;
};

/**
 * Home page services section — reuses the image-based card grid.
 * No outer padding wrapper — ServicesGrid fills the fluid-container from HomePage.
 */
export async function HomeServicesSection({ locale, title }: HomeServicesSectionProps) {
  const servicesData = await getServices({
    locale,
    page: 1,
    pageSize: 6,
    sort: 'order',
  });

  const gridData = {
    title,
    items: servicesData.items.map((item, index) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      imageUrl: resolveImageUrl(item.hero_image_url) || `/services/${item.slug_group || item.slug}.jpg`,
      order: index + 1,
    })),
  };

  return <ServicesGrid data={gridData} locale={locale} />;
}
