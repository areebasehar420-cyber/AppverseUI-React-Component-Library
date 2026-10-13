import { KeyboardEvent, MouseEvent, ReactElement, ReactNode, cloneElement, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useControllableState } from '../../hooks/useControllableState';

export interface ModalProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the modal wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Dialog title, used as the accessible name. */
  title: string;
  /** Optional element that opens the modal when clicked (useful in uncontrolled mode). */
  trigger?: ReactElement;
  /** Close when the dark overlay is clicked. @default true */
  closeOnOverlayClick?: boolean;
  children?: ReactNode;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog rendered in a portal.
 * Traps focus, closes on Escape, and returns focus to the previously focused element.
 */
export function Modal({ open, defaultOpen = false, onOpenChange, title, trigger, closeOnOverlayClick = true, children }: ModalProps) {
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previous?.focus?.();
  }, [isOpen]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!items.length) return e.preventDefault();
    const first = items[0];
    const last = items[items.length - 1];
    const a = document.activeElement;
    if (e.shiftKey && (a === first || a === dialogRef.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  };
  const onOverlayDown = (e: MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) setOpen(false);
  };

  return (
    <>
      {trigger && cloneElement(trigger as ReactElement<any>, {
        onClick: (e: MouseEvent) => { (trigger.props as any).onClick?.(e); setOpen(true); },
      })}
      {isOpen && createPortal(
        <div className="av-overlay" onMouseDown={onOverlayDown} onKeyDown={onKeyDown}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="av-modal">
            <h2 id={titleId} className="av-modal__title">{title}</h2>
            <button type="button" className="av-modal__close" aria-label="Close dialog" onClick={() => setOpen(false)}>×</button>
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
