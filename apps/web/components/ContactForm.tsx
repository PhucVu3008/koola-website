'use client';

import { useState, type FormEvent } from 'react';

import { createLead } from '../src/lib/api/leads';

/**
 * Contact form that submits to `POST /v1/leads`.
 *
 * Behavior:
 * - Client component (form state)
 * - Server handles page rendering; only the form is client-side.
 * 
 * Mobile Optimizations:
 * - Minimum 48px touch targets (inputs/buttons)
 * - 16px font size prevents iOS zoom on focus
 * - Proper input types for mobile keyboards
 * - Full-width layout for easy mobile interaction
 */
export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
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

        if (!name || !email || !message) {
          setErrorMessage('Please fill name, email and message.');
          setStatus('error');
          return;
        }

        try {
          await createLead({
            name,
            email,
            message,
            company: company || undefined,
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
      <div>
        <label className="block fluid-text-sm font-medium text-slate-900 mb-2" htmlFor="name">
          Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded-xl border border-slate-300 px-4 transition-colors outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 fluid-text-base"
          style={{ minHeight: '48px' }}
          autoComplete="name"
          placeholder="Your full name"
          required
        />
      </div>

      <div>
        <label className="block fluid-text-sm font-medium text-slate-900 mb-2" htmlFor="email">
          Email <span className="text-rose-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          className="w-full rounded-xl border border-slate-300 px-4 transition-colors outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 fluid-text-base"
          style={{ minHeight: '48px' }}
          autoComplete="email"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label className="block fluid-text-sm font-medium text-slate-900 mb-2" htmlFor="company">
          Company <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="w-full rounded-xl border border-slate-300 px-4 transition-colors outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 fluid-text-base"
          style={{ minHeight: '48px' }}
          autoComplete="organization"
          placeholder="Your company name"
        />
      </div>

      <div>
        <label className="block fluid-text-sm font-medium text-slate-900 mb-2" htmlFor="message">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 transition-colors outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 fluid-text-base"
          style={{ minHeight: '120px' }}
          placeholder="Tell us about your project..."
          required
        />
      </div>

      {status === 'success' ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 fluid-text-sm text-emerald-800 flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Thanks — we received your message and will get back to you soon!</span>
        </div>
      ) : null}

      {status === 'error' && errorMessage ? (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 fluid-text-sm text-rose-800 flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-6 font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed fluid-text-base"
        style={{ minHeight: '52px' }}
      >
        {status === 'submitting' ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>

      <p className="fluid-text-xs text-slate-500 text-center">
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your information is secure and will never be shared.
        </span>
      </p>
    </form>
  );
}
