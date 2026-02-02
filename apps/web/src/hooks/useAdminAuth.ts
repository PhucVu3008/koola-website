'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated } from '../lib/admin-auth';

/**
 * Admin Auth Guard Hook
 * 
 * Protects admin pages by checking authentication status.
 * Redirects to login page if not authenticated.
 * 
 * @returns {boolean} isLoading - true while checking auth status
 * 
 * @example
 * ```tsx
 * export default function AdminPage() {
 *   const isLoading = useAdminAuth();
 *   
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *   
 *   return <div>Admin Content</div>;
 * }
 * ```
 */
export function useAdminAuth(): boolean {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run auth check after component mounts (client-side only)
    if (!mounted) {
      return;
    }

    // Check authentication status
    const authenticated = isAuthenticated();
    
    if (!authenticated) {
      // Not authenticated, redirect to login
      const loginUrl = `/admin/${locale}/login`;
      router.replace(loginUrl);
      return;
    }
    
    // Authenticated, allow access
    setIsLoading(false);
  }, [mounted, router, locale]);

  return isLoading;
}
