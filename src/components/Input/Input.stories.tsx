import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = { title: 'Components/Input', component: Input, tags: ['autodocs'], args: { label: 'Email', placeholder: 'you@example.com' } };
export default meta;
type Story = StoryObj<typeof Input>;

export const Uncontrolled: Story = { args: { defaultValue: 'areeba@example.com' } };
export const WithHelper: Story = { args: { helperText: 'We will never share your email.' } };
export const WithError: Story = { args: { error: 'Please enter a valid email.' } };
export const Disabled: Story = { args: { disabled: true } };
export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState('');
    return <Input {...args} value={v} onChange={(e) => setV(e.target.value)} helperText={`${v.length} characters`} />;
  },
};
