import { KeyboardEvent, ReactNode, createContext, useContext, useId, useMemo, useRef } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

interface TabsCtx { value: string; setValue: (v: string) => void; baseId: string; orientation: 'horizontal' | 'vertical' }
const Ctx = createContext<TabsCtx | null>(null);
const useTabs = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Tabs parts must be used inside <Tabs>');
  return c;
};

export interface TabsProps {
  /** Controlled selected tab value. */
  value?: string;
  /** Initial tab (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}

/**
 * Tabs (compound component): `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`.
 * Keyboard: Arrow keys move and activate, Home/End jump to first/last. Uses roving tabindex.
 */
function TabsRoot({ value, defaultValue = '', onValueChange, orientation = 'horizontal', children }: TabsProps) {
  const baseId = useId();
  const [current, setValue] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const ctx = useMemo(() => ({ value: current, setValue, baseId, orientation }), [current, setValue, baseId, orientation]);
  return (
    <Ctx.Provider value={ctx}>
      <div className="av-tabs" data-orientation={orientation}>{children}</div>
    </Ctx.Provider>
  );
}

function TabsList({ children, 'aria-label': ariaLabel }: { children: ReactNode; 'aria-label'?: string }) {
  const { orientation } = useTabs();
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    const keys = orientation === 'horizontal' ? { next: 'ArrowRight', prev: 'ArrowLeft' } : { next: 'ArrowDown', prev: 'ArrowUp' };
    const tabs = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role=tab]:not(:disabled)') ?? []);
    const i = tabs.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    let n: number;
    if (e.key === keys.next) n = (i + 1) % tabs.length;
    else if (e.key === keys.prev) n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    else return;
    e.preventDefault();
    tabs[n].focus();
    tabs[n].click();
  };
  return (
    <div ref={ref} role="tablist" aria-orientation={orientation} aria-label={ariaLabel} className="av-tablist" onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}

function Tab({ value, disabled, children }: { value: string; disabled?: boolean; children: ReactNode }) {
  const { value: current, setValue, baseId } = useTabs();
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className="av-tab"
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { value: current, baseId } = useTabs();
  const selected = current === value;
  return (
    <div role="tabpanel" id={`${baseId}-panel-${value}`} aria-labelledby={`${baseId}-tab-${value}`} hidden={!selected} tabIndex={0} className="av-tabpanel">
      {selected && children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab, Panel: TabPanel });
