import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

const items = [
  { id: 'edit', label: 'Edit' },
  { id: 'copy', label: 'Copy', disabled: true },
  { id: 'delete', label: 'Delete' },
];

describe('DropdownMenu', () => {
  it('opens on click and focuses the first item', async () => {
    render(<DropdownMenu label="Actions" items={items} />);
    await userEvent.click(screen.getByRole('button', { name: /Actions/ }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });
  it('opens with ArrowDown from the trigger', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu label="Actions" items={items} />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
  it('navigates with arrows, skipping disabled items', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu label="Actions" items={items} defaultOpen />);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });
  it('selects with Enter, calls onSelect and closes', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DropdownMenu label="Actions" items={items} onSelect={onSelect} defaultOpen />);
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<DropdownMenu label="Actions" items={items} defaultOpen />);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Actions/ })).toHaveFocus();
  });
  it('closes on outside click', async () => {
    render(<div><DropdownMenu label="Actions" items={items} defaultOpen /><p>outside</p></div>);
    await userEvent.click(screen.getByText('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('supports controlled open', async () => {
    const onOpenChange = vi.fn();
    render(<DropdownMenu label="Actions" items={items} open={false} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Actions/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
