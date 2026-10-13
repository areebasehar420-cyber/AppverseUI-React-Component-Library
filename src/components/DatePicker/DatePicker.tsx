import { KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useControllableState } from '../../hooks/useControllableState';

export interface DatePickerProps {
  /** Controlled date (`null` = empty). */
  value?: Date | null;
  /** Initial date (uncontrolled). */
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  /** @default 'Select date' */
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
};
const same = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
/** Formats a date as YYYY-MM-DD in local time. */
export const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Date picker with an accessible calendar grid.
 * Keyboard: Arrow keys move by day/week, PageUp/PageDown change month, Home/End jump to week start/end, Escape closes.
 */
export function DatePicker({ value, defaultValue = null, onChange, label, placeholder = 'Select date', minDate, maxDate, disabled }: DatePickerProps) {
  const id = useId();
  const [date, setDate] = useControllableState<Date | null>({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState<Date>(() => date ?? startOfDay(new Date()));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(rootRef, close, open);

  const isDisabled = (d: Date) =>
    (minDate !== undefined && d < startOfDay(minDate)) || (maxDate !== undefined && d > startOfDay(maxDate));

  useEffect(() => {
    if (open) popupRef.current?.querySelector<HTMLElement>('[data-focused="true"]')?.focus();
  }, [open, focused]);

  const openPopup = () => {
    setFocused(date ?? startOfDay(new Date()));
    setOpen(true);
  };
  const pick = (d: Date) => {
    if (isDisabled(d)) return;
    setDate(startOfDay(d));
    setOpen(false);
    triggerRef.current?.focus();
  };
  const moveTo = (d: Date) => { if (!isDisabled(d)) setFocused(d); };

  const onGridKey = (e: KeyboardEvent) => {
    const map: Record<string, Date> = {
      ArrowLeft: addDays(focused, -1), ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7), ArrowDown: addDays(focused, 7),
      PageUp: addMonths(focused, -1), PageDown: addMonths(focused, 1),
      Home: addDays(focused, -focused.getDay()), End: addDays(focused, 6 - focused.getDay()),
    };
    if (e.key === 'Escape') { e.preventDefault(); close(); triggerRef.current?.focus(); }
    else if (map[e.key]) { e.preventDefault(); moveTo(map[e.key]); }
  };

  const y = focused.getFullYear();
  const m = focused.getMonth();
  const first = new Date(y, m, 1);
  const gridStart = addDays(first, -first.getDay());
  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)));
  const heading = first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="av-dp av-field" ref={rootRef}>
      {label && <span id={`${id}-label`} className="av-label">{label}</span>}
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className="av-dp__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={label ? `${id}-label ${id}-trigger` : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openPopup())}
      >
        {date ? formatDate(date) : <span className="av-placeholder">{placeholder}</span>}
      </button>
      {open && (
        <div ref={popupRef} role="dialog" aria-label="Choose date" className="av-dp__popup" onKeyDown={onGridKey}>
          <div className="av-dp__head">
            <button type="button" className="av-dp__nav" aria-label="Previous month" onClick={() => setFocused(addMonths(focused, -1))}>‹</button>
            <strong id={`${id}-heading`} aria-live="polite">{heading}</strong>
            <button type="button" className="av-dp__nav" aria-label="Next month" onClick={() => setFocused(addMonths(focused, 1))}>›</button>
          </div>
          <table role="grid" aria-labelledby={`${id}-heading`} className="av-dp__grid">
            <thead>
              <tr>{WEEKDAYS.map((w) => <th key={w} scope="col">{w}</th>)}</tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={formatDate(week[0])}>
                  {week.map((d) => {
                    const selected = !!date && same(d, date);
                    const isFocus = same(d, focused);
                    return (
                      <td key={formatDate(d)} role="gridcell" aria-selected={selected}>
                        <button
                          type="button"
                          className={`av-dp__day${d.getMonth() !== m ? ' av-dp__day--out' : ''}`}
                          tabIndex={isFocus ? 0 : -1}
                          data-focused={isFocus}
                          disabled={isDisabled(d)}
                          aria-label={d.toLocaleDateString('en-US', { dateStyle: 'long' })}
                          onClick={() => pick(d)}
                        >
                          {d.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
