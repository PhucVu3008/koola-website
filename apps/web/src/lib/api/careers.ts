/**
 * Careers page API client
 */

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export type CareersHeroData = {
  imageUrl: string;
  imageAlt: string;
};

export type CareersPrideSlide = {
  quote: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
};

export type CareersPrideData = {
  slides: CareersPrideSlide[];
};

export type CareersCultureBullet = {
  title: string;
  body: string;
};

export type CareersCultureData = {
  bullets: CareersCultureBullet[];
  imageUrl: string;
  imageAlt: string;
};

export type CareersPageData = {
  hero: CareersHeroData;
  pride: CareersPrideData;
  culture: CareersCultureData;
};

export type FeaturedJob = {
  id: number;
  title: string;
  location: string;
  level: string;
  responsibilities_md: string;
  requirements_md: string;
  slug: string;
};

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featured_image_url?: string;
  author_name?: string;
  author_role?: string;
  published_at: string;
  category_name?: string;
};

/**
 * Fetch careers page aggregate data
 */
export async function getCareersPage({ locale }: { locale: string }): Promise<CareersPageData> {
  const url = `${API_URL}/v1/pages/careers/aggregate?locale=${locale}`;
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch careers page: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Fetch featured jobs list
 */
export async function getFeaturedJobs({ locale }: { locale: string }): Promise<FeaturedJob[]> {
  const url = `${API_URL}/v1/jobs?locale=${locale}&status=published`;
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch featured jobs: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

/**
 * Fetch latest blog posts for news section
 */
export async function getLatestPosts({ 
  locale, 
  limit = 3 
}: { 
  locale: string; 
  limit?: number;
}): Promise<BlogPost[]> {
  const url = `${API_URL}/v1/posts?locale=${locale}&page=1&pageSize=${limit}&sort=newest`;
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch latest posts: ${res.status}`);
  }

  const json = await res.json();
  return json.data.posts || [];
}
