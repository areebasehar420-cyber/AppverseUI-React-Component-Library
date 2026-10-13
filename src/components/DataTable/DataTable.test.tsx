import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Column, DataTable } from './DataTable';

interface P { id: number; name: string; age: number }
const data: P[] = [
  { id: 1, name: 'Zara', age: 30 },
  { id: 2, name: 'Ali', age: 25 },
  { id: 3, name: 'Mina', age: 41 },
];
const columns: Column<P>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
];
const names = () => screen.getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell')[0].textContent);

describe('DataTable', () => {
  it('renders headers and rows', () => {
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} caption="People" />);
    expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument();
    expect(names()).toEqual(['Zara', 'Ali', 'Mina']);
  });
  it('sorts asc, desc, then clears (uncontrolled)', async () => {
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} />);
    const header = screen.getByRole('columnheader', { name: /Name/ });
    await userEvent.click(within(header).getByRole('button'));
    expect(names()).toEqual(['Ali', 'Mina', 'Zara']);
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(within(header).getByRole('button'));
    expect(names()).toEqual(['Zara', 'Mina', 'Ali']);
    await userEvent.click(within(header).getByRole('button'));
    expect(names()).toEqual(['Zara', 'Ali', 'Mina']);
  });
  it('sorts with the keyboard', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(names()).toEqual(['Ali', 'Mina', 'Zara']);
  });
  it('supports controlled sort', async () => {
    const onSortChange = vi.fn();
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} sort={{ key: 'age', direction: 'desc' }} onSortChange={onSortChange} />);
    expect(names()).toEqual(['Mina', 'Zara', 'Ali']);
    await userEvent.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    expect(names()).toEqual(['Mina', 'Zara', 'Ali']);
  });
  it('paginates', async () => {
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} pageSize={2} />);
    expect(names()).toHaveLength(2);
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(names()).toEqual(['Mina']);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
  it('activates rows by click and keyboard', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataTable columns={[{ key: 'name', header: 'Name' }]} data={data} getRowId={(r) => r.id} onRowClick={onRowClick} />);
    await user.click(screen.getByText('Ali'));
    expect(onRowClick).toHaveBeenCalledWith(data[1]);
    const rows = screen.getAllByRole('row');
    rows[1].focus();
    await user.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });
  it('shows the empty message', () => {
    render(<DataTable columns={columns} data={[]} getRowId={(r) => r.id} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
