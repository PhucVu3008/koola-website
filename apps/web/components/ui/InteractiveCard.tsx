'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../src/lib/ui/cx';

/**
 * Interactive card wrapper.
 *
 * Adds modern micro-interactions (hover lift + shadow)
 * without changing layout.
 *
 * Notes:
 * - No hover border/ring (to match the desired visual).
 * - Effects are applied via CSS transitions only (no runtime JS).
 * - Respects `prefers-reduced-motion`.
 */
export function InteractiveCard({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>) {
  return (
    <div
      className={cx(
        'group transition-all duration-300 ease-out',
        'motion-reduce:transition-none',
        // Hover lift + subtle scale.
        'hover:-translate-y-1 hover:scale-[1.01]',
        // Stronger shadow on hover (no border/ring).
        'hover:shadow-[0_18px_40px_-22px_rgba(15,23,42,0.35)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
