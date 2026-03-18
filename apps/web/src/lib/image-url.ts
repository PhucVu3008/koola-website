/**
 * Resolve image URLs for Next.js Image component.
 *
 * Upload paths like `/uploads/media/...` are relative — Next.js Image
 * Optimization rejects them with 400 unless they match remotePatterns
 * as absolute URLs. This helper prepends the site URL so they become
 * `https://koola.vn/uploads/media/...` which matches remotePatterns.
 *
 * Local static paths (e.g. `/services/iot.jpg`) are left unchanged.
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('/uploads/')) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return `${siteUrl}${path}`;
  }
  return path;
}
