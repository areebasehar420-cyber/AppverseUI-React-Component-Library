import { KeyboardEvent, ReactNode, memo, useMemo } from 'react';
import { useControllableState } from '../../hooks/useControllableState';

export interface Column<T> {
  /** Unique key. Also the default property read from each row. */
  key: string;
  header: ReactNode;
  /** Custom value used for sorting and default rendering. */
  accessor?: (row: T) => string | number;
  /** Custom cell renderer. */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Returns a stable unique id for each row. */
  getRowId: (row: T) => string | number;
  caption?: string;
  /** Controlled sort state (`null` = unsorted). */
  sort?: SortState | null;
  /** Initial sort (uncontrolled). */
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** Rows per page. Omit to disable pagination. */
  pageSize?: number;
  /** Controlled page (1-based). */
  page?: number;
  /** Initial page (uncontrolled). @default 1 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Makes rows clickable and keyboard-activatable (Enter/Space). */
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

interface RowProps<T> {
  row: T;
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

function RowInner<T>({ row, columns, onRowClick }: RowProps<T>) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick?.(row); }
  };
  return (
    <tr
      className={onRowClick ? 'av-row--click' : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      onKeyDown={onRowClick ? onKey : undefined}
    >
      {columns.map((c) => (
        <td key={c.key}>{c.render ? c.render(row) : String(c.accessor ? c.accessor(row) : (row as any)[c.key] ?? '')}</td>
      ))}
    </tr>
  );
}
/** Memoised so rows only re-render when their own props change. */
const Row = memo(RowInner) as typeof RowInner;

/**
 * Data table with keyboard-operable sorting, pagination and optional row activation.
 */
export function DataTable<T>({
  columns, data, getRowId, caption, sort, defaultSort = null, onSortChange,
  pageSize, page, defaultPage = 1, onPageChange, onRowClick, emptyMessage = 'No data',
}: DataTableProps<T>) {
  const [sortState, setSort] = useControllableState<SortState | null>({ value: sort, defaultValue: defaultSort, onChange: onSortChange });
  const [pageNo, setPage] = useControllableState<number>({ value: page, defaultValue: defaultPage, onChange: onPageChange });

  const sorted = useMemo(() => {
    if (!sortState) return data;
    const col = columns.find((c) => c.key === sortState.key);
    if (!col) return data;
    const val = (r: T) => (col.accessor ? col.accessor(r) : (r as any)[col.key]);
    const dir = sortState.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => (val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : 0) * dir);
  }, [data, columns, sortState]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(Math.max(pageNo, 1), totalPages);
  const rows = useMemo(
    () => (pageSize ? sorted.slice((safePage - 1) * pageSize, safePage * pageSize) : sorted),
    [sorted, pageSize, safePage],
  );

  const toggleSort = (key: string) => {
    if (!sortState || sortState.key !== key) setSort({ key, direction: 'asc' });
    else if (sortState.direction === 'asc') setSort({ key, direction: 'desc' });
    else setSort(null);
  };

  return (
    <div>
      <table className="av-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => {
              const dir = sortState?.key === c.key ? sortState.direction : undefined;
              return (
                <th key={c.key} scope="col" aria-sort={c.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined}>
                  {c.sortable ? (
                    <button type="button" className="av-th-btn" onClick={() => toggleSort(c.key)}>
                      {c.header} <span aria-hidden="true">{dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '↕'}</span>
                    </button>
                  ) : c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length}>{emptyMessage}</td></tr>
          ) : rows.map((r) => <Row key={getRowId(r)} row={r} columns={columns} onRowClick={onRowClick} />)}
        </tbody>
      </table>
      {pageSize && (
        <nav className="av-pager" aria-label="Pagination">
          <button type="button" className="av-btn av-btn--secondary av-btn--sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>Previous</button>
          <span aria-live="polite">Page {safePage} of {totalPages}</span>
          <button type="button" className="av-btn av-btn--secondary av-btn--sm" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>Next</button>
        </nav>
      )}
    </div>
  );
}
