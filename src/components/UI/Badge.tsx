import clsx from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const variants = {
    success: 'bg-[#00c853]/10 text-[#00c853] border-[#00c853]/20',
    warning: 'bg-[#ffd600]/10 text-[#ffd600] border-[#ffd600]/20',
    danger: 'bg-[#ff1744]/10 text-[#ff1744] border-[#ff1744]/20',
    info: 'bg-[#448aff]/10 text-[#448aff] border-[#448aff]/20',
    neutral: 'bg-[#2a2a3d]/50 text-[#9090b0] border-[#2a2a3d]',
    accent: 'bg-[#6c5ce7]/10 text-[#a855f7] border-[#6c5ce7]/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full border font-medium', variants[variant], sizes[size])}>
      {children}
    </span>
  );
}
