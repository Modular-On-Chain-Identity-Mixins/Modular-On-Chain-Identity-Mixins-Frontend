import { useEffect } from 'react';

type KeyCombo = string;

export function useKeyboardShortcut(
  combo: KeyCombo,
  callback: () => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      const parts = combo.toLowerCase().split('+');
      const key = parts[parts.length - 1];
      const ctrl = parts.includes('ctrl');
      const shift = parts.includes('shift');
      const alt = parts.includes('alt');

      if (
        e.key.toLowerCase() === key &&
        e.ctrlKey === ctrl &&
        e.shiftKey === shift &&
        e.altKey === alt
      ) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [combo, callback, ...deps]);
}
