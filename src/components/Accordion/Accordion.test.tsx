import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from './Accordion';

const items = [
  { value: 'a', title: 'First', content: 'Content A' },
  { value: 'b', title: 'Second', content: 'Content B' },
  { value: 'c', title: 'Third', content: 'Content C', disabled: true },
];

describe('Accordion', () => {
  it('starts collapsed and expands on click', async () => {
    render(<Accordion items={items} />);
    const btn = screen.getByRole('button', { name: /First/ });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content A')).toBeVisible();
  });
  it('single mode closes the other item', async () => {
    render(<Accordion items={items} defaultValue={['a']} />);
    await userEvent.click(screen.getByRole('button', { name: /Second/ }));
    expect(screen.getByRole('button', { name: /First/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Second/ })).toHaveAttribute('aria-expanded', 'true');
  });
  it('multiple mode keeps several open', async () => {
    render(<Accordion items={items} type="multiple" />);
    await userEvent.click(screen.getByRole('button', { name: /First/ }));
    await userEvent.click(screen.getByRole('button', { name: /Second/ }));
    expect(screen.getByText('Content A')).toBeVisible();
    expect(screen.getByText('Content B')).toBeVisible();
  });
  it('can prevent collapsing in single mode', async () => {
    render(<Accordion items={items} defaultValue={['a']} collapsible={false} />);
    await userEvent.click(screen.getByRole('button', { name: /First/ }));
    expect(screen.getByRole('button', { name: /First/ })).toHaveAttribute('aria-expanded', 'true');
  });
  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} type="multiple" />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Content A')).toBeVisible();
    await user.keyboard(' ');
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });
  it('moves between headers with arrows and skips disabled', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /Second/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /First/ })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: /Second/ })).toHaveFocus();
  });
  it('is controlled', async () => {
    const onValueChange = vi.fn();
    render(<Accordion items={items} value={[]} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /First/ }));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
    expect(screen.getByRole('button', { name: /First/ })).toHaveAttribute('aria-expanded', 'false');
  });
});
