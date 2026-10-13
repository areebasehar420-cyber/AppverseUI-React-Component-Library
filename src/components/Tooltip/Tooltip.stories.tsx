import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: { placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  args: { content: 'Saves your changes', children: <Button>Hover or focus me</Button> },
  decorators: [(Story) => <div style={{ padding: 60 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };
export const Right: Story = { args: { placement: 'right' } };
export const WithDelay: Story = { args: { delay: 500, content: 'Appears after 500ms' } };
export const AlwaysOpen: Story = { args: { open: true } };
