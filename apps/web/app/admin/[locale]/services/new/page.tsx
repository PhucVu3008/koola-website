/**
 * Create New Service Page
 */

'use client';

import { useParams } from 'next/navigation';
import { ServiceForm } from '@/components/admin/ServiceForm';

export default function NewServicePage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';

  return (
    <ServiceForm
      mode="create"
      locale={locale}
    />
  );
}
