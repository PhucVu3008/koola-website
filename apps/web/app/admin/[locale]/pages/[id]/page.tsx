'use client';

import { useParams } from 'next/navigation';
import PageForm from '@/components/admin/PageForm';

/**
 * Edit Page
 */
export default function EditPagePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const id = parseInt(params?.id as string);

  return (
    <div className="max-w-4xl mx-auto">
      <PageForm mode="edit" pageId={id} locale={locale} />
    </div>
  );
}
