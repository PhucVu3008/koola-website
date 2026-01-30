/**
 * Structured Data (JSON-LD) helpers for SEO
 * 
 * Generates Schema.org compliant JSON-LD for different page types.
 * Used in generateMetadata() functions across the app.
 * 
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import type { Thing, WithContext } from 'schema-dts';

/**
 * Organization schema for KOOLA
 * Use in global layout to establish brand identity
 */
export function generateOrganizationSchema(baseUrl: string): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KOOLA',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'AI-focused software development and consulting services',
    sameAs: [
      'https://facebook.com/koola',
      'https://twitter.com/koola',
      'https://linkedin.com/company/koola',
      'https://github.com/koola',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-123-456-789',
      contactType: 'customer service',
      email: 'contact@koola.vn',
      availableLanguage: ['English', 'Vietnamese'],
    },
  };
}

/**
 * WebSite schema for search functionality
 * Use in global layout
 */
export function generateWebSiteSchema(baseUrl: string, locale: string): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KOOLA',
    url: `${baseUrl}/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/${locale}/services?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    } as any,
    inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
  };
}

/**
 * Service schema for service detail pages
 */
export interface ServiceSchemaInput {
  name: string;
  description: string;
  slug: string;
  locale: string;
  baseUrl: string;
  image?: string;
  benefits?: string[];
}

export function generateServiceSchema(input: ServiceSchemaInput): WithContext<Thing> {
  const { name, description, slug, locale, baseUrl, image, benefits } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${baseUrl}/${locale}/services/${slug}`,
    image: image || `${baseUrl}/services/${slug}.jpg`,
    provider: {
      '@type': 'Organization',
      name: 'KOOLA',
      url: baseUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam',
    },
    serviceType: 'Technology Consulting',
    ...(benefits && {
      termsOfService: `${baseUrl}/${locale}/terms`,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Service Benefits',
        itemListElement: benefits.map((benefit, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: benefit,
          },
          position: index + 1,
        })),
      },
    }),
  };
}

/**
 * FAQPage schema for services with FAQs
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQPageSchema(faqs: FAQItem[]): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList schema for navigation
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string
): WithContext<Thing> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  };
}

/**
 * JobPosting schema for job listings
 */
export interface JobPostingSchemaInput {
  title: string;
  description: string;
  slug: string;
  locale: string;
  baseUrl: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  jobLocation?: {
    city?: string;
    country?: string;
  };
  salary?: {
    currency: string;
    value: number;
    unitText: string;
  };
  qualifications?: string[];
  responsibilities?: string[];
}

export function generateJobPostingSchema(input: JobPostingSchemaInput): WithContext<Thing> {
  const {
    title,
    description,
    slug,
    locale,
    baseUrl,
    datePosted,
    validThrough,
    employmentType = 'FULL_TIME',
    jobLocation = { city: 'Lam Dong', country: 'VN' },
    salary,
    qualifications,
    responsibilities,
  } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    url: `${baseUrl}/${locale}/careers/${slug}`,
    datePosted,
    ...(validThrough && { validThrough }),
    employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'KOOLA',
      sameAs: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: jobLocation.city,
        addressCountry: jobLocation.country,
      },
    },
    ...(salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: salary.currency,
        value: {
          '@type': 'QuantitativeValue',
          value: salary.value,
          unitText: salary.unitText,
        },
      },
    }),
    ...(qualifications && {
      qualifications: qualifications.join('. '),
    }),
    ...(responsibilities && {
      responsibilities: responsibilities.join('. '),
    }),
  };
}

/**
 * Article schema for blog posts (future use)
 */
export interface ArticleSchemaInput {
  headline: string;
  description: string;
  slug: string;
  locale: string;
  baseUrl: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

export function generateArticleSchema(input: ArticleSchemaInput): WithContext<Thing> {
  const {
    headline,
    description,
    slug,
    locale,
    baseUrl,
    datePublished,
    dateModified,
    authorName = 'KOOLA Team',
    image,
  } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${baseUrl}/${locale}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'KOOLA',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
  };
}

/**
 * Helper to serialize JSON-LD for Next.js metadata
 * Use in generateMetadata() return value
 */
export function serializeJsonLd(data: WithContext<Thing> | WithContext<Thing>[]): string {
  return JSON.stringify(data);
}

/**
 * Combine multiple schemas into array
 */
export function combineSchemas(...schemas: WithContext<Thing>[]): WithContext<Thing>[] {
  return schemas;
}
