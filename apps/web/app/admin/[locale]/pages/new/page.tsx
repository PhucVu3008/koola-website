'use client';

import { useParams } from 'next/navigation';
import PageForm from '@/components/admin/PageForm';

/**
 * New Page Creation Page
 */
export default function NewPagePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return (
    <div className="max-w-4xl mx-auto">
      <PageForm mode="create" locale={locale} />
    </div>
  );
}
