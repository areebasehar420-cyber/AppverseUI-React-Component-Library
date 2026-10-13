import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from './Select';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte (coming soon)', disabled: true },
  { value: 'angular', label: 'Angular' },
];
const meta: Meta<typeof Select> = { title: 'Components/Select', component: Select, tags: ['autodocs'], args: { label: 'Framework', options } };
export default meta;
type Story = StoryObj<typeof Select>;

export const Uncontrolled: Story = { args: { defaultValue: 'react' } };
export const Placeholder: Story = { args: { placeholder: 'Choose one' } };
export const Disabled: Story = { args: { disabled: true } };
export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState('vue');
    return <div><Select {...args} value={v} onChange={setV} /><p>Selected: {v}</p></div>;
  },
};
