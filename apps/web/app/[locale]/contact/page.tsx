import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ContactForm } from '../../../components/ContactForm';
import { isLocale, type Locale } from '../../../src/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: locale === 'vi' ? 'Liên hệ' : 'Contact',
    description:
      locale === 'vi'
        ? 'Liên hệ KOOLA — cho chúng tôi biết bạn đang xây dựng gì. Chúng tôi phản hồi trong 1–2 ngày làm việc.'
        : 'Contact KOOLA — tell us what you are building. We reply within 1–2 business days.',
  };
}

/**
 * Contact page.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="py-12">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === 'vi' ? 'Liên hệ' : 'Contact'}
          </h1>
          <p className="text-slate-600">
            {locale === 'vi' ? 'Gửi cho chúng tôi một tin nhắn.' : 'Send us a message.'}
          </p>
        </header>

        <ContactForm />
      </div>
    </div>
  );
}
