import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DropdownMenu } from './DropdownMenu';

const items = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive', disabled: true },
  { id: 'delete', label: 'Delete' },
];
const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  args: { label: 'Actions', items },
  decorators: [(Story) => <div style={{ minHeight: 220 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {};
export const OpenByDefault: Story = { args: { defaultOpen: true } };
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return <div><DropdownMenu {...args} open={open} onOpenChange={setOpen} /><p>Menu is {open ? 'open' : 'closed'}</p></div>;
  },
};
