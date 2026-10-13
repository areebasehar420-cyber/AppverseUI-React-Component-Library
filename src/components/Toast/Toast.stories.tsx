import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { ToastProvider, ToastProviderProps, useToast } from './Toast';

function Demo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ message: 'Profile saved', type: 'success' })}>Success</Button>
      <Button variant="secondary" onClick={() => toast({ message: 'New update available', type: 'info' })}>Info</Button>
      <Button variant="secondary" onClick={() => toast({ message: 'Low disk space', type: 'warning' })}>Warning</Button>
      <Button variant="danger" onClick={() => toast({ message: 'Upload failed', type: 'error' })}>Error</Button>
      <Button variant="ghost" onClick={() => toast({ message: 'Sticky: dismiss me manually', duration: 0 })}>Sticky</Button>
    </div>
  );
}

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: { position: { control: 'select', options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'] } },
};
export default meta;
type Story = StoryObj<ToastProviderProps>;

export const Default: Story = { render: (args) => <ToastProvider {...args}><Demo /></ToastProvider> };
export const BottomLeft: Story = { args: { position: 'bottom-left' }, render: (args) => <ToastProvider {...args}><Demo /></ToastProvider> };
