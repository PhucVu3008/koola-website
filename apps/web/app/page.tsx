import { redirect } from 'next/navigation';

/**
 * Root entrypoint.
 *
 * We use locale-prefixed routes (`/en`, `/vi`) for SEO and clarity.
 */
export default function RootPage() {
  redirect('/en');
}
