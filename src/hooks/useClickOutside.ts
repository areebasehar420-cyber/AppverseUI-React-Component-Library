import { RefObject, useEffect } from 'react';

/** Calls `handler` when a mousedown happens outside `ref` while `enabled` is true. */
export function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler, enabled]);
}
