import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type JobDetailBreadcrumbsData = {
  labels: {
    home: string;
    careers: string;
  };
  locale: string;
  jobTitle: string;
};

/**
 * Breadcrumbs for Job Detail Page
 */
export function JobDetailBreadcrumbs({ data }: { data: JobDetailBreadcrumbsData }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-slate-600">
        <li>
          <Link
            href={`/${data.locale}`}
            className="hover:text-brand-600 transition-colors"
          >
            {data.labels.home}
          </Link>
        </li>
        <li>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </li>
        <li>
          <Link
            href={`/${data.locale}/careers`}
            className="hover:text-brand-600 transition-colors"
          >
            {data.labels.careers}
          </Link>
        </li>
        <li>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </li>
        <li className="font-medium text-slate-900">{data.jobTitle}</li>
      </ol>
    </nav>
  );
}
