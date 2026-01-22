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
    <div className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Breadcrumbs */}
        <JobDetailBreadcrumbs data={breadcrumbsData} />

        {/* Job Header */}
        <div className="mb-8 border-b border-slate-200 pb-8">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">{dict.locationLabel}:</span>
              <span>{job.location}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{dict.levelLabel}:</span>
              <span>{job.level}</span>
            </div>
            {job.employment_type && (
              <>
                <span>•</span>
                <span>{job.employment_type}</span>
              </>
            )}
          </div>
        </div>

        {/* Overview Section */}
        {job.summary && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">{dict.overview}</h2>
            <p className="text-slate-700 leading-relaxed">{job.summary}</p>
          </section>
        )}

        {/* Responsibilities Section */}
        {responsibilities.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">{dict.responsibilities}</h2>
            <ul className="ml-6 space-y-3 list-disc text-slate-700">
              {responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Qualifications Section */}
        {qualifications.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">{dict.qualifications}</h2>
            <ul className="ml-6 space-y-3 list-disc text-slate-700">
              {qualifications.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Apply Section */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">
              {dict.applySection.title}
            </h2>
            <p className="text-slate-600">{dict.applySection.subtitle}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <JobApplicationForm data={formData} />
          </div>
        </section>
      </div>
    </div>
  );
}
