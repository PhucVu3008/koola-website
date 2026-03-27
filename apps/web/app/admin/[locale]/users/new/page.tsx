'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/components/admin/UserForm';
import { getStoredUser } from '@/lib/admin-auth';
import { hasPermission } from '@/lib/permissions';

/**
 * Create User Page — Admin only.
 * Redirects non-admin users back to the users list immediately.
 */
export default function CreateUserPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { locale } = params;

  useEffect(() => {
    const user = getStoredUser();
    if (!hasPermission(user, 'users:create')) {
      router.replace(`/admin/${locale}/users`);
    }
  }, [locale, router]);

  return <UserForm locale={locale} mode="create" />;
}
