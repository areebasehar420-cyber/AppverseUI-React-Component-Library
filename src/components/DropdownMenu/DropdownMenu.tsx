import { KeyboardEvent, ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useControllableState } from '../../hooks/useControllableState';

export interface MenuItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  /** Called when this item is chosen. */
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  /** Label of the trigger button. */
  label: ReactNode;
  items: MenuItem[];
  /** Called with the id of the chosen item. */
  onSelect?: (id: string) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Dropdown menu (ARIA menu button pattern).
 * Keyboard: ArrowDown/ArrowUp open and move, Home/End, Enter/Space choose, Escape closes and returns focus.
 */
export function DropdownMenu({ label, items, onSelect, open, defaultOpen = false, onOpenChange }: DropdownMenuProps) {
  const id = useId();
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);
  useClickOutside(rootRef, close, isOpen);

  const enabled = () => Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role=menuitem]:not(:disabled)') ?? []);
  useEffect(() => {
    if (isOpen) enabled()[0]?.focus();
  }, [isOpen]);

  const onTriggerKey = (e: KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setOpen(true); }
  };
  const onMenuKey = (e: KeyboardEvent) => {
    const list = enabled();
    const i = list.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => { e.preventDefault(); list[(n + list.length) % list.length]?.focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(list.length - 1);
    else if (e.key === 'Escape') { e.preventDefault(); close(); triggerRef.current?.focus(); }
    else if (e.key === 'Tab') close();
  };
  const choose = (item: MenuItem) => {
    item.onSelect?.();
    onSelect?.(item.id);
    close();
    triggerRef.current?.focus();
  };

  return (
    <div className="av-menu" ref={rootRef}>
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className="av-btn av-btn--secondary av-btn--md"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${id}-menu` : undefined}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={onTriggerKey}
      >
        {label} <span aria-hidden="true">▾</span>
      </button>
      {isOpen && (
        <div ref={listRef} id={`${id}-menu`} role="menu" aria-labelledby={`${id}-trigger`} className="av-menu__list" onKeyDown={onMenuKey}>
          {items.map((item) => (
            <button key={item.id} type="button" role="menuitem" tabIndex={-1} disabled={item.disabled} className="av-menu__item" onClick={() => choose(item)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
