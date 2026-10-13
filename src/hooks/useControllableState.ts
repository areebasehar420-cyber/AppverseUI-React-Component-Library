import { useCallback, useRef, useState } from 'react';

export interface UseControllableStateOptions<T> {
  /** Controlled value. When not `undefined`, the hook is controlled. */
  value?: T;
  /** Initial value used in uncontrolled mode. */
  defaultValue: T;
  /** Called whenever the value is requested to change. */
  onChange?: (value: T) => void;
}

/**
 * Lets a component work in both controlled (`value`) and uncontrolled (`defaultValue`) mode.
 * @returns `[currentValue, setValue]`
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      if (!Object.is(next, currentRef.current)) onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, setValue];
}
