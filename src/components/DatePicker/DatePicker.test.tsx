import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker, formatDate } from './DatePicker';

const day = (name: string) => screen.getByRole('button', { name });

describe('DatePicker', () => {
  it('shows placeholder, then opens a calendar dialog', async () => {
    render(<DatePicker label="Date" />);
    expect(screen.getByRole('button', { name: /Date/ })).toHaveTextContent('Select date');
    await userEvent.click(screen.getByRole('button', { name: /Date/ }));
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
  it('selects a date (uncontrolled) and shows it formatted', async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" defaultValue={new Date(2026, 9, 11)} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Date/ })).toHaveTextContent('2026-10-11');
    await userEvent.click(screen.getByRole('button', { name: /Date/ }));
    await userEvent.click(day('October 20, 2026'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(formatDate(onChange.mock.calls[0][0])).toBe('2026-10-20');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Date/ })).toHaveTextContent('2026-10-20');
  });
  it('is controlled', async () => {
    function C() {
      const [d, setD] = useState<Date | null>(new Date(2026, 9, 11));
      return <DatePicker label="Date" value={d} onChange={setD} />;
    }
    render(<C />);
    await userEvent.click(screen.getByRole('button', { name: /Date/ }));
    await userEvent.click(day('October 5, 2026'));
    expect(screen.getByRole('button', { name: /Date/ })).toHaveTextContent('2026-10-05');
  });
  it('navigates days with arrow keys and selects with Enter', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Date" defaultValue={new Date(2026, 9, 11)} />);
    await user.click(screen.getByRole('button', { name: /Date/ }));
    expect(day('October 11, 2026')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(day('October 12, 2026')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(day('October 19, 2026')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /Date/ })).toHaveTextContent('2026-10-19');
  });
  it('changes month with PageDown and the nav buttons', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Date" defaultValue={new Date(2026, 9, 11)} />);
    await user.click(screen.getByRole('button', { name: /Date/ }));
    await user.keyboard('{PageDown}');
    expect(screen.getByText('November 2026')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('October 2026')).toBeInTheDocument();
  });
  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Date" />);
    await user.click(screen.getByRole('button', { name: /Date/ }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Date/ })).toHaveFocus();
  });
  it('disables dates outside min/max', async () => {
    render(<DatePicker label="Date" defaultValue={new Date(2026, 9, 11)} minDate={new Date(2026, 9, 10)} maxDate={new Date(2026, 9, 20)} />);
    await userEvent.click(screen.getByRole('button', { name: /Date/ }));
    expect(day('October 9, 2026')).toBeDisabled();
    expect(day('October 21, 2026')).toBeDisabled();
    expect(day('October 15, 2026')).toBeEnabled();
  });
});
