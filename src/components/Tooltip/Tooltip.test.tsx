import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows on hover and hides on unhover', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Help text"><button>Info</button></Tooltip>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Help text');
    await user.unhover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('shows on keyboard focus and describes the trigger', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Help text"><button>Info</button></Tooltip>);
    await user.tab();
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Help text');
  });
  it('hides with Escape', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Help"><button>Info</button></Tooltip>);
    await user.tab();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  it('supports controlled open', () => {
    render(<Tooltip content="Always" open><button>Info</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
  it('supports defaultOpen (uncontrolled)', () => {
    render(<Tooltip content="Start open" defaultOpen><button>Info</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
  it('respects the delay', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Late" delay={50}><button>Info</button></Tooltip>);
    await user.hover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });
});
