import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = { title: 'Components/Tabs', component: Tabs, tags: ['autodocs'], parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj<typeof Tabs>;

const content = (
  <>
    <Tabs.List aria-label="Account sections">
      <Tabs.Tab value="profile">Profile</Tabs.Tab>
      <Tabs.Tab value="security">Security</Tabs.Tab>
      <Tabs.Tab value="billing" disabled>Billing</Tabs.Tab>
      <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="profile">Update your name and photo.</Tabs.Panel>
    <Tabs.Panel value="security">Change your password and enable 2FA.</Tabs.Panel>
    <Tabs.Panel value="billing">Billing details.</Tabs.Panel>
    <Tabs.Panel value="notifications">Choose which emails you receive.</Tabs.Panel>
  </>
);

export const Uncontrolled: Story = { render: (args) => <Tabs {...args} defaultValue="profile">{content}</Tabs> };
export const Vertical: Story = { render: (args) => <Tabs {...args} defaultValue="profile" orientation="vertical">{content}</Tabs> };
export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState('security');
    return <><Tabs {...args} value={v} onValueChange={setV}>{content}</Tabs><p>Active tab: {v}</p></>;
  },
};
