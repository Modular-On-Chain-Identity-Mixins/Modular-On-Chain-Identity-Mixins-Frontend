import { useEffect } from 'react';

const BASE_TITLE = 'Compliance Kit';

export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} · ${BASE_TITLE}`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
