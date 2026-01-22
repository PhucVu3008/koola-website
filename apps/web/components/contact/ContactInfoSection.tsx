'use client';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useScrollAnimation } from '../../src/hooks/useScrollAnimation';

export type ContactInfoData = {
  title: string;
  email: string;
  emailLabel: string;
  phone: string;
  phoneLabel: string;
  address: string;
  addressLabel: string;
  businessHours: string;
  businessHoursLabel: string;
};

export type ContactInfoSectionProps = {
  data: ContactInfoData;
};

/**
 * Contact Information Section
 * 
 * Displays email, phone, address, and business hours with icons.
 * Uses scroll-triggered animation.
 */
export function ContactInfoSection({ data }: ContactInfoSectionProps) {
  const [sectionRef, isSectionVisible] = useScrollAnimation<HTMLElement>();

  const contactItems = [
    {
      icon: Mail,
      label: data.emailLabel,
      value: data.email,
      href: `mailto:${data.email}`,
    },
    {
      icon: Phone,
      label: data.phoneLabel,
      value: data.phone,
      href: `tel:${data.phone}`,
    },
    {
      icon: MapPin,
      label: data.addressLabel,
      value: data.address,
      href: null,
    },
    {
      icon: Clock,
      label: data.businessHoursLabel,
      value: data.businessHours,
      href: null,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`px-6 py-12 ${isSectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      <div className="mx-auto max-w-screen-xl">
        <h2 className="mb-8 text-2xl font-semibold text-slate-900 md:text-3xl">
          {data.title}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactItems.map((item, index) => {
            const Icon = item.icon;
            const content = (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-500">{item.label}</h3>
                  <p className="mt-1 text-base font-medium text-slate-900">{item.value}</p>
                </div>
              </>
            );

            return item.href ? (
              <a
                key={index}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-md"
              >
                {content}
              </a>
            ) : (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
