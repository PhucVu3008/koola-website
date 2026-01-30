import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cx } from '../../src/lib/ui/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButtonProps = CommonProps &
  {
    href?: undefined;
  } &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

type ButtonAsLinkProps = CommonProps &
  {
    href: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  } &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href' | 'onMouseEnter' | 'onMouseLeave'>;

/**
 * Reusable button component.
 *
 * Supports rendering either as a `<button>` (default) or a Next.js `<Link>` when `href` is provided.
 */
export function Button(props: ButtonAsButtonProps | ButtonAsLinkProps) {
  const { variant = 'primary', className, children } = props;

  const base =
    'inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300';

  const variantClass =
    variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700'
      : variant === 'secondary'
        ? 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
        : 'bg-transparent text-slate-900 hover:bg-slate-100';

  const cls = cx(base, variantClass, className);

  if ('href' in props && typeof props.href === 'string') {
    const { href, onMouseEnter, onMouseLeave, ...rest } = props;
    return (
      <Link 
        href={href} 
        className={cls} 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const { type = 'button', ...rest } = props;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
