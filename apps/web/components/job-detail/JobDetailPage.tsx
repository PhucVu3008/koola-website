import { JobDetailBreadcrumbs, type JobDetailBreadcrumbsData } from './JobDetailBreadcrumbs';
import { JobApplicationForm, type JobApplicationFormData } from './JobApplicationForm';

export type JobDetailData = {
  id: number;
  title: string;
  slug: string;
  location: string;
  level: string;
  employment_type: string;
  summary: string;
  responsibilities_md: string;
  requirements_md: string;
};

export type JobDetailPageProps = {
  job: JobDetailData;
  dict: {
    breadcrumbs: {
      home: string;
      careers: string;
    };
    overview: string;
    responsibilities: string;
    qualifications: string;
    locationLabel: string;
    levelLabel: string;
    applySection: {
      title: string;
      subtitle: string;
    };
    form: {
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
  };
  locale: string;
};

/**
 * Parse markdown-style bullet list
 */
function parseBullets(md: string): string[] {
  if (!md) return [];
  return md
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- ') || line.startsWith('* '))
    .map((line) => line.replace(/^[-*]\s+/, ''));
}

/**
 * Job Detail Page Component
 * 
 * Layout:
 * - Breadcrumbs
 * - Job header (title, location, level)
 * - Overview section
 * - Responsibilities section
 * - Qualifications section
 * - Apply form section
 */
export function JobDetailPage({ job, dict, locale }: JobDetailPageProps) {
  const responsibilities = parseBullets(job.responsibilities_md);
  const qualifications = parseBullets(job.requirements_md);

  const breadcrumbsData: JobDetailBreadcrumbsData = {
    labels: {
      home: dict.breadcrumbs.home,
      careers: dict.breadcrumbs.careers,
    },
    locale,
    jobTitle: job.title,
  };

  const formData: JobApplicationFormData = {
    labels: dict.form,
    jobSlug: job.slug,
    jobTitle: job.title,
    locale,
  };

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Breadcrumbs */}
        <JobDetailBreadcrumbs data={breadcrumbsData} />

        {/* Job Header - Responsive */}
        <div className="mb-6 sm:mb-8 border-b border-slate-200 pb-6 sm:pb-8">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">{dict.locationLabel}:</span>
              <span>{job.location}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{dict.levelLabel}:</span>
              <span>{job.level}</span>
            </div>
            {job.employment_type && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{job.employment_type}</span>
              </>
            )}
          </div>
        </div>

        {/* Overview Section - Responsive */}
        {job.summary && (
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-slate-900">{dict.overview}</h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">{job.summary}</p>
          </section>
        )}

        {/* Responsibilities Section - Responsive */}
        {responsibilities.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-slate-900">{dict.responsibilities}</h2>
            <ul className="ml-5 sm:ml-6 space-y-2 sm:space-y-3 list-disc text-base sm:text-lg text-slate-700">
              {responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Qualifications Section - Responsive */}
        {qualifications.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-slate-900">{dict.qualifications}</h2>
            <ul className="ml-5 sm:ml-6 space-y-2 sm:space-y-3 list-disc text-base sm:text-lg text-slate-700">
              {qualifications.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Apply Section - Responsive */}
        <section className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="mb-2 text-xl sm:text-2xl font-semibold text-slate-900">
              {dict.applySection.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">{dict.applySection.subtitle}</p>
          </div>

          <div className="rounded-lg sm:rounded-xl bg-white p-4 sm:p-6 shadow-sm">
            <JobApplicationForm data={formData} />
          </div>
        </section>
      </div>
    </div>
  );
}
