'use client';

import { useState, type FormEvent } from 'react';

import { createLead } from '../src/lib/api/leads';

/**
 * Contact form that submits to `POST /v1/leads`.
 *
 * Behavior:
 * - Client component (form state)
 * - Server handles page rendering; only the form is client-side.
 */
export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
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
        <label className="text-sm font-medium text-slate-900" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          autoComplete="name"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-900" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-900" htmlFor="company">
          Company (optional)
        </label>
        <input
          id="company"
          name="company"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          autoComplete="organization"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-900" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="mt-1 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          required
        />
      </div>

      {status === 'success' ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Thanks — we received your message.
        </div>
      ) : null}

      {status === 'error' && errorMessage ? (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorMessage}</div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send'}
      </button>

      <p className="text-xs text-slate-500">By submitting, you agree to be contacted about your request.</p>
    </form>
  );
}
