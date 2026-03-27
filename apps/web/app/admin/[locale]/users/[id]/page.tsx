'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/components/admin/UserForm';
import { getStoredUser } from '@/lib/admin-auth';
import { hasPermission } from '@/lib/permissions';

/**
 * Edit User Page.
 * - Admin: full edit access
 * - Manager: view-only (all fields disabled, no Save button)
 * - Editor: redirected away (no user:view permission)
 */
export default function EditUserPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const { locale, id } = params;
  const [canView, setCanView] = useState<boolean | null>(null);
  const [viewOnly, setViewOnly] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!hasPermission(user, 'users:view')) {
      // Editor — no access at all
      router.replace(`/admin/${locale}`);
      return;
    }
    setCanView(true);
    setViewOnly(!hasPermission(user, 'users:edit'));
  }, [locale, router]);

  if (canView === null) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <UserForm userId={parseInt(id)} locale={locale} mode="edit" viewOnly={viewOnly} />;
}
