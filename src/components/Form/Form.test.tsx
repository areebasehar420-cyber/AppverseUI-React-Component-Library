import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { Form, FormField } from './Form';

function setup(onSubmit = vi.fn()) {
  render(
    <Form<{ email: string; name: string }> onSubmit={onSubmit} defaultValues={{ email: '', name: 'Areeba' }}>
      <FormField name="email" label="Email" rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } }} />
      <FormField name="name" label="Name" />
      <Button type="submit">Send</Button>
    </Form>,
  );
  return onSubmit;
}

describe('Form', () => {
  it('shows a required error and does not submit', async () => {
    const onSubmit = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it('shows a pattern error', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Email'), 'nope');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });
  it('submits valid values including defaults', async () => {
    const onSubmit = setup();
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({ email: 'a@b.com', name: 'Areeba' });
  });
  it('submits with the Enter key', async () => {
    const onSubmit = setup();
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com{Enter}');
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
  it('supports a render-function child', () => {
    render(<Form onSubmit={() => {}}>{(m) => <span>{typeof m.register}</span>}</Form>);
    expect(screen.getByText('function')).toBeInTheDocument();
  });
});
