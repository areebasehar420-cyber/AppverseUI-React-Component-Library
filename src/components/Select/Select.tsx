import { KeyboardEvent, useId, useState } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** List of options. */
  options: SelectOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value when the user picks an option. */
  onChange?: (value: string) => void;
  /** Visible label. */
  label?: string;
  /** Accessible name when no visible `label` is given. */
  'aria-label'?: string;
  /** Text shown when nothing is selected. @default 'Select...' */
  placeholder?: string;
  disabled?: boolean;
  /** Name for a hidden input so the value is submitted with native forms. */
  name?: string;
}

/**
 * Custom select (ARIA combobox + listbox).
 * Keyboard: ArrowUp/ArrowDown, Home, End, Enter/Space to choose, Escape to close.
 */
export function Select({
  options, value, defaultValue = '', onChange, label, placeholder = 'Select...', disabled, name, ...aria
}: SelectProps) {
  const id = useId();
  const [current, setCurrent] = useControllableState<string>({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const selected = options.find((o) => o.value === current);

  const move = (from: number, dir: 1 | -1) => {
    let i = from + dir;
    while (i >= 0 && i < options.length && options[i].disabled) i += dir;
    return i >= 0 && i < options.length ? i : from;
  };
  const openList = () => {
    const sel = options.findIndex((o) => o.value === current);
    setActive(sel >= 0 ? sel : move(-1, 1));
    setOpen(true);
  };
  const choose = (i: number) => {
    if (options[i] && !options[i].disabled) {
      setCurrent(options[i].value);
      setOpen(false);
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); open ? setActive(move(active, 1)) : openList(); break;
      case 'ArrowUp': e.preventDefault(); open ? setActive(move(active, -1)) : openList(); break;
      case 'Home': if (open) { e.preventDefault(); setActive(move(-1, 1)); } break;
      case 'End': if (open) { e.preventDefault(); setActive(move(options.length, -1)); } break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) openList();
        else if (active >= 0) choose(active);
        else setOpen(false);
        break;
      case 'Escape': if (open) { e.preventDefault(); setOpen(false); } break;
      case 'Tab': setOpen(false); break;
    }
  };

  return (
    <div className="av-select av-field">
      {label && <span id={`${id}-label`} className="av-label">{label}</span>}
      <div
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={label ? undefined : aria['aria-label']}
        aria-disabled={disabled || undefined}
        className="av-select__control"
        onClick={() => !disabled && (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
      >
        <span className={selected ? undefined : 'av-placeholder'}>{selected ? selected.label : placeholder}</span>
        <span aria-hidden="true">▾</span>
      </div>
      {name && <input type="hidden" name={name} value={current} />}
      {open && (
        <ul id={`${id}-list`} role="listbox" aria-labelledby={label ? `${id}-label` : undefined} aria-label={label ? undefined : aria['aria-label']} className="av-listbox">
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={o.value === current}
              aria-disabled={o.disabled || undefined}
              className={`av-option${i === active ? ' av-option--active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => !o.disabled && setActive(i)}
              onClick={() => choose(i)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
