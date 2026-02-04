/**
 * Edit Job Page
 */

'use client';

import { useParams } from 'next/navigation';
import { JobForm } from '@/components/admin/JobForm';

export default function EditJobPage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';
  const jobId = parseInt(params?.id as string);

  if (isNaN(jobId)) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">
          {locale === 'vi' ? 'ID công việc không hợp lệ' : 'Invalid Job ID'}
        </h1>
        <p className="mt-2 text-gray-600">
          {locale === 'vi' ? 'ID công việc phải là một số.' : 'The job ID must be a number.'}
        </p>
      </div>
    );
  }

  return (
    <JobForm
      mode="edit"
      locale={locale}
      jobId={jobId}
    />
  );
}
