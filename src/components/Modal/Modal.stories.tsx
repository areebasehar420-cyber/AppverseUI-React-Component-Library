import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = { title: 'Components/Modal', component: Modal, tags: ['autodocs'], args: { title: 'Confirm action' } };
export default meta;
type Story = StoryObj<typeof Modal>;

export const UncontrolledWithTrigger: Story = {
  args: { trigger: <Button>Open modal</Button>, children: <p>Press Escape or the close button to dismiss. Focus is trapped inside.</p> },
};
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit profile</Button>
        <Modal {...args} title="Edit profile" open={open} onOpenChange={setOpen}>
          <Input label="Name" />
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Save</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </Modal>
      </>
    );
  },
};
