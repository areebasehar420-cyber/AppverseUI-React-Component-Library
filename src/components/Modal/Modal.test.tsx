import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal title="Hello" open={false}>Body</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('is labelled by its title when open', () => {
    render(<Modal title="Hello" open>Body</Modal>);
    expect(screen.getByRole('dialog', { name: 'Hello' })).toBeInTheDocument();
  });
  it('opens from a trigger (uncontrolled) and closes with the close button', async () => {
    render(<Modal title="T" trigger={<button>Open</button>}>Body</Modal>);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Modal title="T" trigger={<button>Open</button>}>Body</Modal>);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it('calls onOpenChange in controlled mode', async () => {
    const onOpenChange = vi.fn();
    render(<Modal title="T" open onOpenChange={onOpenChange}>Body</Modal>);
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('traps focus with Tab', async () => {
    const user = userEvent.setup();
    function C() {
      const [o, setO] = useState(true);
      return <Modal title="T" open={o} onOpenChange={setO}><button>One</button><button>Two</button></Modal>;
    }
    render(<C />);
    await user.tab(); // close button
    await user.tab(); // One
    await user.tab(); // Two
    await user.tab(); // wraps to close
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
  });
  it('closes on overlay click', async () => {
    render(<Modal title="T" defaultOpen>Body</Modal>);
    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    await userEvent.click(overlay);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
