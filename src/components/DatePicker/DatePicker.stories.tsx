import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker, formatDate } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { label: 'Appointment date' },
  decorators: [(Story) => <div style={{ minHeight: 380 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Uncontrolled: Story = {};
export const WithDefault: Story = { args: { defaultValue: new Date(2026, 9, 11) } };
export const MinMax: Story = { args: { defaultValue: new Date(2026, 9, 11), minDate: new Date(2026, 9, 5), maxDate: new Date(2026, 9, 25) } };
export const Disabled: Story = { args: { disabled: true } };
export const Controlled: Story = {
  render: (args) => {
    const [d, setD] = useState<Date | null>(null);
    return <div><DatePicker {...args} value={d} onChange={setD} /><p>{d ? `Chosen: ${formatDate(d)}` : 'No date chosen'}</p></div>;
  },
};
