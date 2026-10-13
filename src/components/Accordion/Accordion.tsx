import { KeyboardEvent, ReactNode, useId, useRef } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** `single` keeps one panel open, `multiple` allows many. @default 'single' */
  type?: 'single' | 'multiple';
  /** Controlled list of open item values. */
  value?: string[];
  /** Initially open items (uncontrolled). */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** In `single` mode, allow closing the open item. @default true */
  collapsible?: boolean;
}

/**
 * Accordion. Keyboard: Enter/Space toggle, ArrowUp/ArrowDown/Home/End move between headers.
 */
export function Accordion({ items, type = 'single', value, defaultValue = [], onValueChange, collapsible = true }: AccordionProps) {
  const id = useId();
  const [open, setOpen] = useControllableState<string[]>({ value, defaultValue, onChange: onValueChange });
  const rootRef = useRef<HTMLDivElement>(null);

  const toggle = (v: string) => {
    const isOpen = open.includes(v);
    if (type === 'multiple') setOpen(isOpen ? open.filter((x) => x !== v) : [...open, v]);
    else setOpen(isOpen ? (collapsible ? [] : open) : [v]);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const list = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-av-trigger]:not(:disabled)') ?? []);
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const go = (n: number) => { e.preventDefault(); list[(n + list.length) % list.length].focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(list.length - 1);
  };

  return (
    <div ref={rootRef} className="av-accordion" onKeyDown={onKeyDown}>
      {items.map((item) => {
        const isOpen = open.includes(item.value);
        return (
          <div key={item.value} className="av-accordion__item">
            <h3 className="av-accordion__heading">
              <button
                type="button"
                data-av-trigger=""
                id={`${id}-trigger-${item.value}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel-${item.value}`}
                disabled={item.disabled}
                className="av-accordion__trigger"
                onClick={() => toggle(item.value)}
              >
                {item.title} <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div role="region" id={`${id}-panel-${item.value}`} aria-labelledby={`${id}-trigger-${item.value}`} hidden={!isOpen} className="av-accordion__panel">
              {isOpen && item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
