import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';

const Demo = (props: Partial<React.ComponentProps<typeof Tabs>>) => (
  <Tabs defaultValue="a" {...props}>
    <Tabs.List aria-label="Sections">
      <Tabs.Tab value="a">One</Tabs.Tab>
      <Tabs.Tab value="b" disabled>Two</Tabs.Tab>
      <Tabs.Tab value="c">Three</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="a">Panel A</Tabs.Panel>
    <Tabs.Panel value="b">Panel B</Tabs.Panel>
    <Tabs.Panel value="c">Panel C</Tabs.Panel>
  </Tabs>
);

describe('Tabs', () => {
  it('shows the default tab panel with correct ARIA', () => {
    render(<Demo />);
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('One');
  });
  it('switches on click', async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole('tab', { name: 'Three' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel C');
  });
  it('uses roving tabindex', () => {
    render(<Demo />);
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute('tabindex', '-1');
  });
  it('moves with arrows (skipping disabled), Home and End', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel C');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
  });
  it('is controlled via value', async () => {
    const onValueChange = vi.fn();
    render(<Demo value="a" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Three' }));
    expect(onValueChange).toHaveBeenCalledWith('c');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
  });
  it('works with state in the parent', async () => {
    function C() {
      const [v, setV] = useState('a');
      return <><Demo value={v} onValueChange={setV} /><span>current:{v}</span></>;
    }
    render(<C />);
    await userEvent.click(screen.getByRole('tab', { name: 'Three' }));
    expect(screen.getByText('current:c')).toBeInTheDocument();
  });
});
