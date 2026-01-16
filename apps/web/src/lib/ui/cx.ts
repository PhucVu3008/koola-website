/**
 * Tiny className merge helper.
 */
export function cx(
  ...parts: Array<string | undefined | null | false>
): string {
  return parts.filter(Boolean).join(' ');
}
