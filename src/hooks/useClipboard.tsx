import { useState, useCallback } from 'react';
import { toast } from '../components/UI/Toast';

export function useClipboard({ timeout = 2000 }: { timeout?: number } = {}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast('Copied to clipboard', 'success');
        setTimeout(() => setCopied(false), timeout);
      } catch {
        toast('Failed to copy', 'error');
      }
    },
    [timeout],
  );

  return { copy, copied };
}

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { copy, copied } = useClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className="inline-flex items-center gap-1 text-xs text-[#606080] hover:text-[#6c5ce7] transition-colors"
      aria-label={label ?? 'Copy to clipboard'}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-[#00c853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
