/**
 * Service Detail Component Types
 *
 * Type definitions for service detail page component props.
 */

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type ServiceDetailHeroData = {
  backgroundImage: string;
  breadcrumbs: BreadcrumbItem[];
  title: string;
  excerpt: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export type ServiceDetailContentData = {
  highlightTitle: string;
  coverImage: string;
  heading: string;
  content: string; // Full markdown content as string
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export type SocialLink = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

export type ServiceDetailSidebarData = {
  searchTitle: string;
  searchPlaceholder: string;
  socialTitle: string;
  socialLinks: SocialLink[];
};

export type KeyBenefitItem = {
  title: string;
  description: string;
};

export type KeyBenefitsData = {
  title: string;
  subtitle: string;
  items: KeyBenefitItem[];
};

export type RelatedContentItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  type: 'service' | 'post';
};

export type RelatedContentData = {
  title: string;
  items: RelatedContentItem[];
};
