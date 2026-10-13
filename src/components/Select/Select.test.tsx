import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana', disabled: true },
  { value: 'c', label: 'Cherry' },
];

describe('Select', () => {
  it('shows the placeholder and opens on click', async () => {
    render(<Select label="Fruit" options={options} placeholder="Pick" />);
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Pick');
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
  it('selects with the mouse (uncontrolled)', async () => {
    const onChange = vi.fn();
    render(<Select label="Fruit" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onChange).toHaveBeenCalledWith('c');
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });
  it('supports keyboard navigation and skips disabled options', async () => {
    const user = userEvent.setup();
    render(<Select label="Fruit" options={options} />);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });
  it('closes with Escape', async () => {
    const user = userEvent.setup();
    render(<Select label="Fruit" options={options} />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  it('is controlled by the value prop', async () => {
    function C() {
      const [v, setV] = useState('a');
      return <Select label="F" options={options} value={v} onChange={setV} />;
    }
    render(<C />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });
  it('does not open when disabled', async () => {
    render(<Select label="F" options={options} disabled />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
