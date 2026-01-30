import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ContactPage } from '../../../components/contact';
import { isLocale, type Locale } from '../../../src/i18n/locales';
import { getDictionary } from '../../../src/i18n/getDictionary';
import type { ContactPageData } from '../../../components/contact/ContactPage';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    title: dict.meta.contactTitle,
    description: dict.meta.contactDescription,
  };
}

/**
 * Contact page with Hero, Info, and Form sections.
 * Fully i18n and scroll-triggered animations.
 */
export default async function ContactRoute({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  // Build page data from translations
  const pageData: ContactPageData = {
    hero: {
      title: dict.contact.hero.title,
      subtitle: dict.contact.hero.subtitle,
      backgroundImage: '/contact/hero-bg.jpg',
    },
    info: {
      title: dict.contact.info.title,
      emailLabel: dict.contact.info.email,
      email: 'contact@koola.vn',
      phoneLabel: dict.contact.info.phone,
      phone: '+84 123 456 789',
      addressLabel: dict.contact.info.address,
      address: locale === 'vi' 
        ? 'Lâm Đồng, Việt Nam' 
        : 'Lam Dong, Vietnam',
      businessHoursLabel: dict.contact.info.businessHours,
      businessHours: dict.contact.info.businessHoursValue,
    },
    form: {
      title: dict.contact.form.title,
      subtitle: dict.contact.form.subtitle,
      nameLabel: dict.contact.form.name,
      namePlaceholder: dict.contact.form.namePlaceholder,
      emailLabel: dict.contact.form.email,
      emailPlaceholder: dict.contact.form.emailPlaceholder,
      companyLabel: dict.contact.form.company,
      companyPlaceholder: dict.contact.form.companyPlaceholder,
      phoneLabel: dict.contact.form.phone,
      phonePlaceholder: dict.contact.form.phonePlaceholder,
      messageLabel: dict.contact.form.message,
      messagePlaceholder: dict.contact.form.messagePlaceholder,
      submitLabel: dict.contact.form.submit,
      submittingLabel: dict.contact.form.submitting,
      successTitle: dict.contact.form.successTitle,
      successMessage: dict.contact.form.successMessage,
      errorTitle: dict.contact.form.errorTitle,
      disclaimer: dict.contact.form.disclaimer,
    },
  };

  return <ContactPage data={pageData} />;
}
