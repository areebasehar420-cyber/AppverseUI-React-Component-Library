import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
  it('works uncontrolled with defaultValue', async () => {
    render(<Input label="Name" defaultValue="Ali" />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveValue('Ali');
    await userEvent.type(input, 'ce');
    expect(input).toHaveValue('Alice');
  });
  it('works controlled', async () => {
    function C() {
      const [v, setV] = useState('');
      return <Input label="Q" value={v} onChange={(e) => setV(e.target.value.toUpperCase())} />;
    }
    render(<C />);
    await userEvent.type(screen.getByLabelText('Q'), 'ab');
    expect(screen.getByLabelText('Q')).toHaveValue('AB');
  });
  it('shows an error with aria-invalid and describedby', () => {
    render(<Input label="Age" error="Required" />);
    const input = screen.getByLabelText('Age');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Required');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
  it('shows helper text', () => {
    render(<Input label="Pw" helperText="Min 8 chars" />);
    expect(screen.getByLabelText('Pw')).toHaveAccessibleDescription('Min 8 chars');
  });
  it('calls onChange', async () => {
    const onChange = vi.fn();
    render(<Input label="X" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('X'), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});
