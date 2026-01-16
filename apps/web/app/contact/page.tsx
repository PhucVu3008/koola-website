import type { Metadata } from 'next';

import { ContactForm } from '../../components/ContactForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact KOOLA — tell us what you are building. We reply within 1–2 business days.',
};

/**
 * Contact page.
 */
export default function ContactPage() {
  return (
    <div className="py-12">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
          <p className="text-slate-600">Send us a message.</p>
        </header>

        <ContactForm />
      </div>
    </div>
  );
}
