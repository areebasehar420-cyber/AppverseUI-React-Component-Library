import { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label. */
  label?: string;
  /** Error message. Marks the field invalid and is announced to screen readers. */
  error?: string;
  /** Helper text shown under the field. */
  helperText?: string;
}

/**
 * Text input with label, helper text and error state.
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = error || helperText ? `${inputId}-desc` : undefined;
  return (
    <div className="av-field">
      {label && <label htmlFor={inputId} className="av-label">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        className={['av-input__field', className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={descId}
        {...rest}
      />
      {error ? (
        <span id={descId} role="alert" className="av-error">{error}</span>
      ) : helperText ? (
        <span id={descId} className="av-help">{helperText}</span>
      ) : null}
    </div>
  );
});
