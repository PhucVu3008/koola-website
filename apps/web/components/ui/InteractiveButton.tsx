'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  } &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>;

/**
 * Interactive button with mouse-tracking gradient overlay.
 * 
 * Features:
 * - Dynamic gradient follows cursor position on hover
 * - Smooth transitions for hover/unhover states
 * - Supports both button and link rendering (via href prop)
 * - Maintains existing Button API for easy replacement
 */
export function InteractiveButton(props: ButtonAsButtonProps | ButtonAsLinkProps) {
  const { variant = 'primary', className, children } = props;
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 50, y: 50 }); // Reset to center
  };

  const base =
    'relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 overflow-hidden fluid-h-sm fluid-text-sm';

  const paddingStyle = {
    paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
    paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
  };

  // Variant classes - slightly adjusted for gradient overlay
  const variantClass =
    variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700'
      : variant === 'secondary'
        ? 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
        : 'bg-transparent text-slate-900 hover:bg-slate-100';

  const cls = cx(base, variantClass, className);

  // Gradient overlay styles - different for each variant
  const gradientStyle = variant === 'primary'
    ? {
        background: isHovered
          ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(255, 255, 255, 0.2) 0%, 
              rgba(255, 255, 255, 0.1) 30%,
              transparent 60%)`
          : 'transparent',
      }
    : variant === 'secondary'
      ? {
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(59, 130, 246, 0.15) 0%, 
                rgba(147, 51, 234, 0.1) 40%,
                transparent 70%)`
            : 'transparent',
        }
      : {
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(100, 100, 100, 0.1) 0%, 
                transparent 60%)`
            : 'transparent',
        };

  const content = (
    <>
      {/* Mouse-tracking gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-300"
        style={gradientStyle}
      />
      {/* Button content */}
      <span className="relative z-10">{children as React.ReactNode}</span>
    </>
  );

  if ('href' in props && typeof props.href === 'string') {
    const { href, ...rest } = props;
    return (
      <Link
        href={href}
        className={cls}
        style={paddingStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  const { type = 'button', ...rest } = props;
  return (
    <button
      type={type}
      className={cls}
      style={paddingStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {content}
    </button>
  );
}
