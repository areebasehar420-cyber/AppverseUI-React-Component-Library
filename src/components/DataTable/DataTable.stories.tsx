import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Column, DataTable, SortState } from './DataTable';

interface Person { id: number; name: string; role: string; age: number }
const people: Person[] = [
  { id: 1, name: 'Areeba', role: 'Frontend', age: 22 }, { id: 2, name: 'Hamza', role: 'Backend', age: 27 },
  { id: 3, name: 'Sara', role: 'Designer', age: 25 }, { id: 4, name: 'Bilal', role: 'QA', age: 30 },
  { id: 5, name: 'Noor', role: 'DevOps', age: 28 }, { id: 6, name: 'Zain', role: 'Frontend', age: 24 },
  { id: 7, name: 'Hira', role: 'PM', age: 31 },
];
const columns: Column<Person>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
];
const meta: Meta<typeof DataTable<Person>> = {
  title: 'Components/DataTable',
  component: DataTable<Person>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { columns, data: people, getRowId: (p) => p.id, caption: 'Team members' },
};
export default meta;
type Story = StoryObj<typeof DataTable<Person>>;

export const Default: Story = {};
export const Paginated: Story = { args: { pageSize: 3 } };
export const DefaultSorted: Story = { args: { defaultSort: { key: 'age', direction: 'desc' } } };
export const ClickableRows: Story = { args: { onRowClick: (p) => alert(`Selected ${p.name}`) } };
export const ControlledSort: Story = {
  render: (args) => {
    const [sort, setSort] = useState<SortState | null>({ key: 'name', direction: 'asc' });
    return <DataTable {...args} sort={sort} onSortChange={setSort} />;
  },
};
export const Empty: Story = { args: { data: [] } };
