import clsx from 'clsx';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ enabled, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => { if (!disabled) onChange(!enabled); }}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/50',
        enabled ? 'bg-[#6c5ce7]' : 'bg-[#2a2a3d]',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      role="switch"
      aria-checked={enabled}
      aria-label={label || (enabled ? 'Disable' : 'Enable')}
      disabled={disabled}
    >
      <span
        className={clsx(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
          enabled ? 'translate-x-6' : 'translate-x-1',
        )}
      />
      {label && <span className="ml-3 text-sm text-[#9090b0]">{label}</span>}
    </button>
  );
}
