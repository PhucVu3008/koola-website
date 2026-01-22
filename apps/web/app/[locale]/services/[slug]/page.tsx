import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MessageCircle, Instagram, Twitter, Hash, Facebook } from 'lucide-react';

import { ServiceDetailPage } from '../../../../components/service-detail';
import { getServiceBySlug } from '../../../../src/lib/api/services';
import { getDictionary } from '../../../../src/i18n/getDictionary';
import { isLocale, type Locale } from '../../../../src/i18n/locales';

export const revalidate = 300;

/**
 * Dynamic Service Detail Page
 *
 * Route: /[locale]/services/[slug]
 *
 * Fetches service detail data from API and renders ServiceDetailPage component.
 * All content is API-driven (no hardcoded text).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  try {
    const data = await getServiceBySlug({ slug, locale });

    return {
      title: `${data.service.title} — KOOLA`,
      description: data.service.excerpt || '',
      openGraph: {
        title: data.service.title,
        description: data.service.excerpt || '',
        type: 'article',
      },
    };
  } catch {
    return {};
  }
}

export default async function ServiceDetailRoute({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  // Fetch service detail data
  const serviceData = await getServiceBySlug({ slug, locale }).catch(() => null);
  
  if (!serviceData) notFound();

  // serviceData is guaranteed non-null after this point
  const data = serviceData!;

  // Transform API data into component props
  const pageData = {
    hero: {
      backgroundImage: `/services/${slug}-hero.jpg`, // Convention: slug-based image
      breadcrumbs: [
        { label: dict.serviceDetail.breadcrumbs.home, href: `/${locale}` },
        { label: dict.serviceDetail.breadcrumbs.services, href: `/${locale}/services` },
        { label: data.service.title, href: '' },
      ],
      title: data.service.title,
      excerpt: data.service.excerpt || '',
      ctaPrimary: {
        label: dict.serviceDetail.cta.bookCall,
        href: `/${locale}/contact`,
      },
      ctaSecondary: {
        label: dict.serviceDetail.cta.caseStudies,
        href: `/${locale}/services#case-studies`,
      },
    },
    content: {
      highlightTitle: data.service.excerpt || dict.serviceDetail.content.highlightPrefix,
      coverImage: `/services/${slug}-cover.jpg`, // Convention
      heading: data.service.title,
      content: data.service.content_md || data.service.excerpt || '',
      ctaPrimary: {
        label: dict.serviceDetail.cta.bookCall,
        href: `/${locale}/contact`,
      },
      ctaSecondary: {
        label: dict.serviceDetail.cta.caseStudies,
        href: `/${locale}/services#case-studies`,
      },
    },
    sidebar: {
      searchTitle: dict.serviceDetail.sidebar.search.title,
      searchPlaceholder: dict.serviceDetail.sidebar.search.placeholder,
      socialTitle: dict.serviceDetail.sidebar.social.title,
      socialLinks: [
        {
          name: 'WhatsApp',
          icon: <MessageCircle className="h-5 w-5" />,
          href: 'https://wa.me/1234567890',
        },
        {
          name: 'Instagram',
          icon: <Instagram className="h-5 w-5" />,
          href: 'https://instagram.com/koola',
        },
        {
          name: 'Twitter',
          icon: <Twitter className="h-5 w-5" />,
          href: 'https://twitter.com/koola',
        },
        {
          name: 'Discord',
          icon: <Hash className="h-5 w-5" />,
          href: 'https://discord.gg/koola',
        },
        {
          name: 'Facebook',
          icon: <Facebook className="h-5 w-5" />,
          href: 'https://facebook.com/koola',
        },
      ],
    },
    benefits: {
      title: dict.serviceDetail.benefits.title,
      subtitle: data.service.benefits_subtitle || dict.serviceDetail.benefits.subtitle || '',
      items:
        data.benefits?.map((b: any) => ({
          title: b.title,
          description: b.description || '',
          icon: b.icon_name || 'Zap',
        })) || [],
    },
    related: {
      title: dict.serviceDetail.related.title,
      items:
        data.related_services?.map((s: any) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          excerpt: s.excerpt || '',
          imageUrl: `/services/${s.slug}.jpg`,
          type: 'service' as const,
        })).slice(0, 3) || [],
    },
  };

  return <ServiceDetailPage data={pageData} locale={locale} />;
}
