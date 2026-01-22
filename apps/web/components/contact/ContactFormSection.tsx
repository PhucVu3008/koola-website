'use client';

import { useState, type FormEvent } from 'react';
import { useScrollAnimation } from '../../src/hooks/useScrollAnimation';
import { createLead } from '../../src/lib/api/leads';

export type ContactFormData = {
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  disclaimer: string;
};

export type ContactFormSectionProps = {
  data: ContactFormData;
};

/**
 * Contact Form Section
 * 
 * Main contact form that submits to `POST /v1/leads`.
 * Features:
 * - Scroll-triggered animation
 * - Client-side validation
 * - Success/error states
 * - i18n support
 */
export function ContactFormSection({ data }: ContactFormSectionProps) {
  const [sectionRef, isSectionVisible] = useScrollAnimation<HTMLElement>();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <section
      ref={sectionRef}
      className={`px-6 py-12 ${isSectionVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      <div className="mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-2xl">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              {data.title}
            </h2>
            <p className="mt-2 text-base text-slate-600">
              {data.subtitle}
            </p>
          </div>

          {/* Form */}
          <form
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              setErrorMessage(null);
              setStatus('submitting');

              const form = e.currentTarget;
              const fd = new FormData(form);

              const name = String(fd.get('name') ?? '').trim();
              const email = String(fd.get('email') ?? '').trim();
              const message = String(fd.get('message') ?? '').trim();
              const company = String(fd.get('company') ?? '').trim();
              const phone = String(fd.get('phone') ?? '').trim();

              if (!name || !email || !message) {
                setErrorMessage('Please fill in all required fields.');
                setStatus('error');
                return;
              }

              try {
                await createLead({
                  name,
                  email,
                  message,
                  company: company || undefined,
                  phone: phone || undefined,
                  source: 'web',
                });

                setStatus('success');
                form.reset();
              } catch (err: any) {
                setErrorMessage(err?.message ?? 'Something went wrong.');
                setStatus('error');
              }
            }}
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-900" htmlFor="name">
                {data.nameLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={data.namePlaceholder}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-900" htmlFor="email">
                {data.emailLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={data.emailPlaceholder}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                autoComplete="email"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-slate-900" htmlFor="company">
                {data.companyLabel}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder={data.companyPlaceholder}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                autoComplete="organization"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-900" htmlFor="phone">
                {data.phoneLabel}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder={data.phonePlaceholder}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                autoComplete="tel"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-900" htmlFor="message">
                {data.messageLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder={data.messagePlaceholder}
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>

            {/* Success Message */}
            {status === 'success' ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="text-sm font-semibold text-emerald-900">{data.successTitle}</h3>
                <p className="mt-1 text-sm text-emerald-800">{data.successMessage}</p>
              </div>
            ) : null}

            {/* Error Message */}
            {status === 'error' && errorMessage ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <h3 className="text-sm font-semibold text-rose-900">{data.errorTitle}</h3>
                <p className="mt-1 text-sm text-rose-800">{errorMessage}</p>
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? data.submittingLabel : data.submitLabel}
            </button>

            {/* Disclaimer */}
            <p className="text-center text-xs text-slate-500">
              {data.disclaimer}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
