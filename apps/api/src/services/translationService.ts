/**
 * Translation Service
 * 
 * Handles automatic translation of service content
 * Currently uses mock translation, can be replaced with Google Translate API
 */

interface TranslateInput {
  text: string;
  fromLang: string;
  toLang: string;
}

interface TranslationResult {
  translatedText: string;
  originalText: string;
  sourceLang: string;
  targetLang: string;
}

/**
 * Mock translation function
 * TODO: Replace with Google Translate API integration
 * 
 * @param input - Translation input parameters
 * @returns Translated text with metadata
 */
export const translateText = async (input: TranslateInput): Promise<TranslationResult> => {
  const { text, fromLang, toLang } = input;
  
  // Mock translation - just adds prefix to indicate translation
  // In production, integrate with Google Translate API:
  // const { Translate } = require('@google-cloud/translate').v2;
  // const translate = new Translate({ projectId: 'your-project-id' });
  // const [translation] = await translate.translate(text, toLang);
  
  const translatedText = `[${toLang.toUpperCase()}] ${text}`;
  
  return {
    translatedText,
    originalText: text,
    sourceLang: fromLang,
    targetLang: toLang,
  };
};

/**
 * Translate service data structure
 * 
 * @param serviceData - Service object to translate
 * @param fromLang - Source language
 * @param toLang - Target language
 * @returns Translated service data
 */
export const translateServiceData = async (
  serviceData: {
    title: string;
    excerpt: string;
    content_md: string;
    seo_title?: string | null;
    seo_description?: string | null;
  },
  fromLang: string,
  toLang: string
): Promise<{
  title: string;
  excerpt: string;
  content_md: string;
  seo_title: string | null;
  seo_description: string | null;
}> => {
  
  // Translate main fields
  const titleResult = await translateText({ text: serviceData.title, fromLang, toLang });
  const excerptResult = await translateText({ text: serviceData.excerpt, fromLang, toLang });
  const contentResult = await translateText({ text: serviceData.content_md, fromLang, toLang });
  
  // Translate optional SEO fields
  let seoTitleResult = null;
  let seoDescResult = null;
  
  if (serviceData.seo_title) {
    seoTitleResult = await translateText({ text: serviceData.seo_title, fromLang, toLang });
  }
  
  if (serviceData.seo_description) {
    seoDescResult = await translateText({ text: serviceData.seo_description, fromLang, toLang });
  }
  
  return {
    title: titleResult.translatedText,
    excerpt: excerptResult.translatedText,
    content_md: contentResult.translatedText,
    seo_title: seoTitleResult?.translatedText || null,
    seo_description: seoDescResult?.translatedText || null,
  };
};

/**
 * Generate slug from translated title
 * Handles both English and Vietnamese text
 * 
 * @param title - Title to convert to slug
 * @param locale - Target locale (en or vi)
 * @returns URL-friendly slug
 */
export const generateSlugFromTitle = (title: string, locale: string): string => {
  let slug = title.toLowerCase();
  
  // Vietnamese-specific character normalization
  if (locale === 'vi') {
    const vietnameseMap: Record<string, string> = {
      'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ': 'a',
      'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ': 'e',
      'ì|í|ị|ỉ|ĩ': 'i',
      'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ': 'o',
      'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ': 'u',
      'ỳ|ý|ỵ|ỷ|ỹ': 'y',
      'đ': 'd',
    };
    
    Object.entries(vietnameseMap).forEach(([pattern, replacement]) => {
      slug = slug.replace(new RegExp(pattern, 'g'), replacement);
    });
  }
  
  // Remove special characters and normalize
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
  
  return slug;
};
