import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToastProvider, useToast } from './Toast';

function Demo({ duration, type }: { duration?: number; type?: 'error' | 'success' }) {
  const { toast } = useToast();
  return <button onClick={() => toast({ message: 'Saved!', duration, type })}>Show</button>;
}

describe('Toast', () => {
  it('shows a toast with role=status', async () => {
    render(<ToastProvider><Demo /></ToastProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved!');
  });
  it('uses role=alert for errors', async () => {
    render(<ToastProvider><Demo type="error" /></ToastProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
  it('dismisses with the close button (keyboard accessible)', async () => {
    const user = userEvent.setup();
    render(<ToastProvider><Demo duration={0} /></ToastProvider>);
    await user.click(screen.getByRole('button', { name: 'Show' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('auto-dismisses after the duration', async () => {
    render(<ToastProvider><Demo duration={50} /></ToastProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });
  it('stacks multiple toasts', async () => {
    render(<ToastProvider><Demo duration={0} /></ToastProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Show' }));
    await userEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });
  it('throws outside the provider', () => {
    expect(() => render(<Demo />)).toThrow(/ToastProvider/);
  });
});
