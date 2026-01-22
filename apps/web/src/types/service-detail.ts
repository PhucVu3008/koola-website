/**
 * Service Detail Page Types
 *
 * Type definitions for service detail page data structures.
 * Matches backend API response shape from GET /v1/services/:slug
 */

export type ServiceDetailService = {
  id: number;
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMd: string;
  heroAssetId: number | null;
  ogAssetId: number | null;
  status: string;
  publishedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ServiceDetailTag = {
  id: number;
  name: string;
  slug: string;
};

export type ServiceDetailCategory = {
  id: number;
  name: string;
  slug: string;
};

export type ServiceDetailDeliverable = {
  id: number;
  title: string;
  description: string;
  iconAssetId: number | null;
  sortOrder: number;
};

export type ServiceDetailProcessStep = {
  id: number;
  title: string;
  description: string;
  sortOrder: number;
};

export type ServiceDetailFAQ = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
};

export type ServiceDetailRelatedService = {
  id: number;
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  heroAssetId: number | null;
};

export type ServiceDetailRelatedPost = {
  id: number;
  locale: string;
  title: string;
  slug: string;
  excerpt: string;
  heroAssetId: number | null;
  publishedAt: string;
};

export type ServiceDetailSidebar = {
  tags: ServiceDetailTag[];
  ads: any[]; // Define ad type if needed
};

export type ServiceDetailData = {
  service: ServiceDetailService;
  tags: ServiceDetailTag[];
  categories: ServiceDetailCategory[];
  deliverables: ServiceDetailDeliverable[];
  processSteps: ServiceDetailProcessStep[];
  faqs: ServiceDetailFAQ[];
  relatedServices: ServiceDetailRelatedService[];
  relatedPosts: ServiceDetailRelatedPost[];
  sidebar?: ServiceDetailSidebar;
};

/**
 * Component props for Service Detail page
 */
export type ServiceDetailPageProps = {
  data: ServiceDetailData;
  locale: string;
};

/**
 * Breadcrumb item
 */
export type BreadcrumbItem = {
  label: string;
  href: string;
};

/**
 * Hero section props
 */
export type ServiceDetailHeroProps = {
  backgroundImage: string;
  breadcrumbs: BreadcrumbItem[];
  title: string;
  excerpt: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

/**
 * Content section props
 */
export type ServiceDetailContentProps = {
  highlightTitle: string;
  coverImage: string;
  heading: string;
  bodyParagraphs: string[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

/**
 * Key benefits item
 */
export type KeyBenefitItem = {
  title: string;
  description: string;
  icon?: string;
};

/**
 * Related content item
 */
export type RelatedContentItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  type: 'service' | 'post';
};
