import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion } from './Accordion';

const items = [
  { value: 'shipping', title: 'Shipping', content: 'Orders ship within 2 business days.' },
  { value: 'returns', title: 'Returns', content: 'Return any item within 30 days.' },
  { value: 'support', title: 'Support', content: 'Chat with us 24/7.' },
  { value: 'legacy', title: 'Legacy plan (disabled)', content: 'Not available.', disabled: true },
];
const meta: Meta<typeof Accordion> = { title: 'Components/Accordion', component: Accordion, tags: ['autodocs'], args: { items }, argTypes: { type: { control: 'inline-radio', options: ['single', 'multiple'] } } };
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = { args: { defaultValue: ['shipping'] } };
export const Multiple: Story = { args: { type: 'multiple', defaultValue: ['shipping', 'returns'] } };
export const NotCollapsible: Story = { args: { collapsible: false, defaultValue: ['returns'] } };
export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState<string[]>(['support']);
    return <div><Accordion {...args} value={v} onValueChange={setV} /><p>Open: {v.join(', ') || 'none'}</p></div>;
  },
};
