import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#13131a] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#6c5ce7] hover:bg-[#7f6ff0] text-white focus:ring-[#6c5ce7]',
    secondary: 'bg-[#1a1a26] border border-[#2a2a3d] hover:bg-[#222233] hover:border-[#3b3b5c] text-[#e8e8f0] focus:ring-[#2a2a3d]',
    danger: 'bg-[#ff1744] hover:bg-[#ff4569] text-white focus:ring-[#ff1744]',
    ghost: 'bg-transparent hover:bg-[#1a1a26] text-[#9090b0] hover:text-[#e8e8f0] focus:ring-[#2a2a3d]',
    success: 'bg-[#00c853] hover:bg-[#00e676] text-black focus:ring-[#00c853]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
