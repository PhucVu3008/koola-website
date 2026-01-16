import type { ReactNode } from 'react';

import { cx } from '../../src/lib/ui/cx';

export type SectionTone = 'white' | 'muted' | 'brand';

/**
 * Section wrapper to keep vertical rhythm and backgrounds consistent.
 */
export function Section({
  id,
  tone = 'white',
  className,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === 'muted'
      ? 'bg-slate-50'
      : tone === 'brand'
        ? 'bg-brand-500'
        : 'bg-white';

  return (
    <section id={id} className={cx(toneClass, className)}>
      {children}
    </section>
  );
}
