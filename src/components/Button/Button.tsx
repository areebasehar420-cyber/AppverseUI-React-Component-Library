import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Size of the button. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leftIcon?: ReactNode;
}

/**
 * Accessible button. Uses a native `<button>`, so Enter and Space work out of the box.
 * @example <Button variant="primary" onClick={save}>Save</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, leftIcon, disabled, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={['av-btn', `av-btn--${variant}`, `av-btn--${size}`, className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="av-spinner" aria-hidden="true" /> : leftIcon}
      {children}
    </button>
  );
});
