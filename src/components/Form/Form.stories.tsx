import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Form, FormField } from './Form';

type Values = { name: string; email: string; password: string };
const meta: Meta<typeof Form<Values>> = { title: 'Components/Form', component: Form<Values>, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Form<Values>>;

export const SignUp: Story = {
  render: () => {
    const [result, setResult] = useState<Values | null>(null);
    return (
      <div style={{ display: 'grid', gap: 12, width: 320 }}>
        <Form<Values> defaultValues={{ name: '', email: '', password: '' }} onSubmit={setResult}>
          <div style={{ display: 'grid', gap: 12 }}>
            <FormField name="name" label="Full name" rules={{ required: 'Name is required' }} />
            <FormField name="email" label="Email" type="email" rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } }} />
            <FormField name="password" label="Password" type="password" helperText="At least 8 characters" rules={{ required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } }} />
            <Button type="submit">Create account</Button>
          </div>
        </Form>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    );
  },
};
