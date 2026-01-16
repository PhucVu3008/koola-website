import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../src/lib/ui/cx';

/**
 * Reusable Card component.
 *
 * Standardizes surface styling across the site.
 */
export function Card({
  className,
  children,
  ...rest
}: {
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>) {
  return (
    <div
      className={cx(
        'rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
