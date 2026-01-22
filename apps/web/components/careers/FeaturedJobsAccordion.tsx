'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../../src/hooks/useScrollAnimation';

export type FeaturedJobData = {
  id: number;
  title: string;
  location: string;
  level: string;
  responsibilities_md: string;
  requirements_md: string;
  slug: string;
};

export type FeaturedJobsAccordionData = {
  title: string;
  exploreMoreLabel: string;
  exploreMoreHref: string;
  locationLabel: string;
  levelLabel: string;
  responsibilitiesTitle: string;
  qualificationsTitle: string;
  applyButtonLabel: string;
  locale: string;
  jobs: FeaturedJobData[];
};

/**
 * Parse markdown-style bullet list (lines starting with "- " or "* ")
 * Returns array of strings without the prefix
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
 * Featured Jobs Accordion Section
 * Only one job expanded at a time, smooth transitions
 */
export function FeaturedJobsAccordion({ data }: { data: FeaturedJobsAccordionData }) {
  const [expandedId, setExpandedId] = useState<number | null>(
    data.jobs.length > 0 ? data.jobs[0].id : null
  );
  const [sectionRef, isSectionVisible] = useScrollAnimation<HTMLElement>();

  const toggleJob = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section 
      ref={sectionRef}
      className={`mx-auto max-w-5xl py-12 transition-all duration-700 ${
        isSectionVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
    >
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">{data.title}</h2>
        <a
          href={data.exploreMoreHref}
          className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          {data.exploreMoreLabel}
          <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {data.jobs.map((job, index) => {
          const isExpanded = expandedId === job.id;
          const responsibilities = parseBullets(job.responsibilities_md);
          const qualifications = parseBullets(job.requirements_md);
          
          // Staggered animation hook
          const [jobRef, isJobVisible, delay] = useStaggeredAnimation<HTMLDivElement>(index, 0.2, 0.1);

          return (
            <div
              key={job.id}
              ref={jobRef}
              className={`overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-700 hover:shadow-md ${
                isJobVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: isJobVisible ? `${delay}s` : undefined,
                animationFillMode: 'both'
              }}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleJob(job.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-50"
                aria-expanded={isExpanded}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                  {!isExpanded && (
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                      <span>{data.locationLabel}: {job.location}</span>
                      <span>•</span>
                      <span>{data.levelLabel}: {job.level}</span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="border-t border-slate-100 px-6 py-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Location & Level */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="font-medium">{data.locationLabel}:</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="font-medium">{data.levelLabel}:</span>
                    <span>{job.level}</span>
                  </div>

                  {/* Responsibilities */}
                  {responsibilities.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-slate-900">
                        {data.responsibilitiesTitle}
                      </h4>
                      <ul className="ml-5 space-y-2 list-disc text-sm text-slate-600">
                        {responsibilities.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Qualifications */}
                  {qualifications.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-slate-900">
                        {data.qualificationsTitle}
                      </h4>
                      <ul className="ml-5 space-y-2 list-disc text-sm text-slate-600">
                        {qualifications.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Apply Button */}
                  <div className="pt-2">
                    <a
                      href={`/${data.locale}/careers/${job.slug}`}
                      className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      {data.applyButtonLabel}
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
