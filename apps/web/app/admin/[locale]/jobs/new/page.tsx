/**
 * Create New Job Page
 */

'use client';

import { useParams } from 'next/navigation';
import { JobForm } from '@/components/admin/JobForm';

export default function CreateJobPage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';

  return (
    <JobForm
      mode="create"
      locale={locale}
    />
  );
}
