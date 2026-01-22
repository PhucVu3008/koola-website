import { ContactHeroSection, type ContactHeroData } from './ContactHeroSection';
import { ContactInfoSection, type ContactInfoData } from './ContactInfoSection';
import { ContactFormSection, type ContactFormData } from './ContactFormSection';

export type ContactPageData = {
  hero: ContactHeroData;
  info: ContactInfoData;
  form: ContactFormData;
};

export type ContactPageProps = {
  data: ContactPageData;
};

/**
 * Contact Page Composition
 * 
 * Sections (top to bottom):
 * 1. Hero Banner (always visible, animates immediately)
 * 2. Contact Information (email, phone, address, hours) - scroll-triggered
 * 3. Contact Form (lead submission) - scroll-triggered
 */
export function ContactPage({ data }: ContactPageProps) {
  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <ContactHeroSection data={data.hero} />

      {/* Contact Information */}
      <ContactInfoSection data={data.info} />

      {/* Contact Form */}
      <ContactFormSection data={data.form} />
    </div>
  );
}
