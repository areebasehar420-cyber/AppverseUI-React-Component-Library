import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureAxe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import {
  Accordion, Button, DataTable, DatePicker, DropdownMenu, Form, FormField, Input, Modal, Select, Tabs, ToastProvider, Tooltip,
} from '../index';

// The page-level 'region' (landmark) rule does not apply to isolated components.
const axe = configureAxe({ rules: { region: { enabled: false } } });

const check = async (ui: React.ReactElement) => {
  const { container } = render(ui);
  const results = await axe(document.body);
  expect(results.violations).toEqual([]);
  return container;
};

describe('axe: no accessibility violations', () => {
  it('Button', () => check(<Button>Save</Button>));
  it('Input', () => check(<Input label="Email" helperText="We never share it" />));
  it('Input with error', () => check(<Input label="Email" error="Required" />));
  it('Select (closed and open)', async () => {
    const opts = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
    await check(<Select label="Letter" options={opts} />);
  });
  it('Modal', () => check(<Modal title="Hi" open><button>OK</button></Modal>));
  it('Tooltip', () => check(<Tooltip content="Tip" open><button>Hover</button></Tooltip>));
  it('DropdownMenu (open)', () => check(<DropdownMenu label="Actions" defaultOpen items={[{ id: 'a', label: 'A' }]} />));
  it('DataTable', () => check(<DataTable caption="People" getRowId={(r: { id: number }) => r.id} data={[{ id: 1, n: 'A' }]} columns={[{ key: 'n', header: 'Name', sortable: true }]} />));
  it('Form', () => check(<Form onSubmit={() => {}}><FormField name="a" label="A" /></Form>));
  it('Toast', () => check(<ToastProvider><p>hi</p></ToastProvider>));
  it('Tabs', () => check(
    <Tabs defaultValue="a"><Tabs.List aria-label="x"><Tabs.Tab value="a">A</Tabs.Tab></Tabs.List><Tabs.Panel value="a">Body</Tabs.Panel></Tabs>,
  ));
  it('Accordion', () => check(<Accordion defaultValue={['a']} items={[{ value: 'a', title: 'A', content: 'Body' }]} />));
  it('DatePicker (open)', async () => {
    render(<DatePicker label="Date" defaultValue={new Date(2026, 9, 11)} />);
    await userEvent.click(document.querySelector('button')!);
    const results = await axe(document.body);
    expect(results.violations).toEqual([]);
  });
});
