/**
 * Edit Service Page
 */

'use client';

import { useParams } from 'next/navigation';
import { ServiceForm } from '@/components/admin/ServiceForm';

export default function EditServicePage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';
  const serviceId = parseInt(params?.id as string);

  if (isNaN(serviceId)) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-600">Invalid Service ID</h1>
        <p className="mt-2 text-gray-600">The service ID must be a number.</p>
      </div>
    );
  }

  return (
    <ServiceForm
      mode="edit"
      locale={locale}
      serviceId={serviceId}
    />
  );
}
