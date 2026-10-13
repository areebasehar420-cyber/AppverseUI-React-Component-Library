import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  message: ReactNode;
  /** @default 'info' */
  type?: ToastType;
  /** Auto-dismiss time in ms. Use `0` to keep it until dismissed. */
  duration?: number;
}

interface ToastItem extends ToastOptions { id: string }

interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  /** Dismisses a toast by id. */
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** @default 'top-right' */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Default auto-dismiss time in ms. @default 5000 */
  duration?: number;
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const { id, duration } = item;
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);
  return (
    <div role={item.type === 'error' ? 'alert' : 'status'} className={`av-toast av-toast--${item.type ?? 'info'}`}>
      <span>{item.message}</span>
      <button type="button" className="av-toast__close" aria-label="Dismiss notification" onClick={() => onDismiss(id)}>×</button>
    </div>
  );
}

/**
 * Provides toast notifications. Toasts are announced by screen readers
 * (`role="status"`, or `role="alert"` for errors) and have a keyboard-reachable dismiss button.
 * State lives in the provider (use `useToast` to control it).
 */
export function ToastProvider({ children, position = 'top-right', duration = 5000 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const dismiss = useCallback((id: string) => setItems((list) => list.filter((t) => t.id !== id)), []);
  const toast = useCallback((o: ToastOptions) => {
    const id = `toast-${++counter.current}`;
    setItems((list) => [...list, { duration, ...o, id }]);
    return id;
  }, [duration]);
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className={`av-toast-viewport av-toast-viewport--${position}`} role="region" aria-label="Notifications">
          {items.map((t) => <ToastView key={t.id} item={t} onDismiss={dismiss} />)}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

/** Returns `{ toast, dismiss }`. Must be used inside `ToastProvider`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
