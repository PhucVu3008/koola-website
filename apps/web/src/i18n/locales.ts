import { LOCALES, type Locale } from './generated';

export { LOCALES };
export type { Locale };

/**
 * Returns true when the given string is a supported locale.
 */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
