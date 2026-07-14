import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#9090b0]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full px-3 py-2 rounded-lg bg-[#13131a] border text-sm text-[#e8e8f0] placeholder-[#606080] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/50 focus:border-[#6c5ce7]',
          error ? 'border-[#ff1744]' : 'border-[#2a2a3d] hover:border-[#3b3b5c]',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#ff1744]">{error}</p>}
    </div>
  );
}
