import { getServices } from '../../src/lib/api/services';
import { ServicesGrid } from './ServicesGrid';

type HomeServicesSectionProps = {
  locale: 'en' | 'vi';
  title: string;
};

/**
 * Home page services section - fetches real services from API.
 * 
 * Displays the first 6 services with links to detail pages.
 * This replaces the static services data with real database content.
 * 
 * @param locale - Current locale (en/vi)
 * @param title - Section title (from i18n)
 */
export async function HomeServicesSection({ locale, title }: HomeServicesSectionProps) {
  // Fetch first 6 services sorted by order
  const servicesData = await getServices({
    locale,
    page: 1,
    pageSize: 6,
    sort: 'order',
  });

  // Map icon names from database to component format
  // If icon_name is stored in benefits table, we'll use a default mapping
  const iconMap: Record<string, string> = {
    'code': 'code',
    'code2': 'code',
    'spark': 'spark',
    'test-tube': 'spark',
    'brain': 'brain',
    'ai': 'brain',
    'pen': 'pen',
    'pen-tool': 'pen',
    'design': 'pen',
    'phone': 'phone',
    'smartphone': 'phone',
    'mobile': 'phone',
    'cloud': 'cloud',
    'server': 'cloud',
    'infrastructure': 'cloud',
  };

  // Transform API data to ServicesGrid format
  const gridData = {
    title,
    items: servicesData.items.map((service) => {
      // Use icon_name from database, fallback to intelligent mapping if not set
      let iconName = service.icon_name || 'code'; // default
      
      // If no icon_name in database, fallback to slug-based mapping
      if (!service.icon_name) {
        const slug = service.slug;
        const titleLower = service.title.toLowerCase();
        
        if (slug.includes('iot') || titleLower.includes('iot')) {
          iconName = 'brain';
        } else if (slug.includes('automation') || titleLower.includes('automation')) {
          iconName = 'spark';
        } else if (slug.includes('infrastructure') || slug.includes('cloud')) {
          iconName = 'cloud';
        } else if (slug.includes('smart-building') || titleLower.includes('smart building')) {
          iconName = 'pen';
        } else if (slug.includes('cybersecurity') || slug.includes('security')) {
          iconName = 'code';
        } else if (titleLower.includes('mobile') || titleLower.includes('app')) {
          iconName = 'phone';
        }
      }

      // Ensure we always have a description (fallback to title if excerpt is empty)
      const description = service.excerpt?.trim() || service.title;

      return {
        slug: service.slug,
        icon: iconName,
        title: service.title,
        description,
      };
    }),
  };

  return <ServicesGrid data={gridData} locale={locale} />;
}
