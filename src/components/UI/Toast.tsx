import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let addToastFn: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

export function toast(message: string, type: ToastMessage['type'] = 'info') {
  addToastFn?.({ message, type });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (msg) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...msg, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => { addToastFn = null; };
  }, []);

  const variants = {
    success: 'border-[#00c853]/30 bg-[#00c853]/10',
    error: 'border-[#ff1744]/30 bg-[#ff1744]/10',
    info: 'border-[#448aff]/30 bg-[#448aff]/10',
    warning: 'border-[#ffd600]/30 bg-[#ffd600]/10',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="status" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-[#e8e8f0] shadow-lg animate-in slide-in-from-right',
            variants[t.type],
          )}
        >
          <span className="text-lg" aria-hidden="true">{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
