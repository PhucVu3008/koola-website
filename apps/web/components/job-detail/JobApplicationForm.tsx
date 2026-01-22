'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export type JobApplicationFormData = {
  labels: {
    fullName: string;
    email: string;
    phone: string;
    linkedIn: string;
    portfolio: string;
    resume: string;
    resumeHint: string;
    coverLetter: string;
    coverLetterPlaceholder: string;
    submit: string;
    submitting: string;
  };
  jobSlug: string;
  jobTitle: string;
  locale: string;
};

/**
 * Job Application Form Component
 * 
 * Features:
 * - File upload for resume (PDF, DOC, DOCX max 5MB)
 * - Form validation
 * - Submit to backend API
 */
export function JobApplicationForm({ data }: { data: JobApplicationFormData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      setError('Only PDF, DOC, DOCX files are allowed');
      return;
    }

    setFileName(file.name);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/api/jobs/${data.jobSlug}/apply?locale=${data.locale}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to submit application');
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setFileName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-slate-900">Application Submitted!</h3>
        <p className="text-slate-600">
          Thank you for applying. We'll review your application and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
          {data.labels.fullName} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
          {data.labels.email} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
          {data.labels.phone} <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label htmlFor="linkedIn" className="mb-2 block text-sm font-medium text-slate-700">
          {data.labels.linkedIn}
        </label>
        <input
          type="url"
          id="linkedIn"
          name="linkedIn"
          placeholder="https://linkedin.com/in/your-profile"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Portfolio */}
      <div>
        <label htmlFor="portfolio" className="mb-2 block text-sm font-medium text-slate-700">
          {data.labels.portfolio}
        </label>
        <input
          type="url"
          id="portfolio"
          name="portfolio"
          placeholder="https://yourportfolio.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label htmlFor="resume" className="mb-2 block text-sm font-medium text-slate-700">
          {data.labels.resume} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="file"
            id="resume"
            name="resume"
            required
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="resume"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600 transition-colors hover:border-brand-500 hover:bg-brand-50"
          >
            <Upload className="h-5 w-5" />
            <span>{fileName || data.labels.resume}</span>
          </label>
        </div>
        <p className="mt-1 text-xs text-slate-500">{data.labels.resumeHint}</p>
      </div>

      {/* Cover Letter */}
      <div>
        <label htmlFor="coverLetter" className="mb-2 block text-sm font-medium text-slate-700">
          {data.labels.coverLetter}
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={6}
          placeholder={data.labels.coverLetterPlaceholder}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-brand-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? data.labels.submitting : data.labels.submit}
      </button>
    </form>
  );
}
