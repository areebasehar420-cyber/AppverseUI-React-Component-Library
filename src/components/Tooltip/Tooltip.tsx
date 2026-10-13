import { ReactElement, ReactNode, cloneElement, useEffect, useId, useRef } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

export interface TooltipProps {
  /** Tooltip text or content. */
  content: ReactNode;
  /** A single focusable element the tooltip describes. */
  children: ReactElement;
  /** Where the tooltip appears. @default 'top' */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay in ms before showing. @default 0 */
  delay?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Tooltip shown on hover and keyboard focus, dismissed with Escape.
 * Links to the trigger through `aria-describedby`.
 */
export function Tooltip({ content, children, placement = 'top', delay = 0, open, defaultOpen = false, onOpenChange }: TooltipProps) {
  const id = useId();
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const clear = () => { if (timer.current) clearTimeout(timer.current); };
  useEffect(() => () => clear(), []);

  const show = () => { clear(); delay > 0 ? (timer.current = setTimeout(() => setOpen(true), delay)) : setOpen(true); };
  const hide = () => { clear(); setOpen(false); };
  const p = children.props as any;

  const child = cloneElement(children as ReactElement<any>, {
    'aria-describedby': isOpen ? id : p['aria-describedby'],
    onMouseEnter: (e: unknown) => { p.onMouseEnter?.(e); show(); },
    onMouseLeave: (e: unknown) => { p.onMouseLeave?.(e); hide(); },
    onFocus: (e: unknown) => { p.onFocus?.(e); show(); },
    onBlur: (e: unknown) => { p.onBlur?.(e); hide(); },
    onKeyDown: (e: React.KeyboardEvent) => { p.onKeyDown?.(e); if (e.key === 'Escape') hide(); },
  });

  return (
    <span className="av-tooltip-wrap">
      {child}
      {isOpen && <span role="tooltip" id={id} className={`av-tooltip av-tooltip--${placement}`}>{content}</span>}
    </span>
  );
}
