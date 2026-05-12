import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
  rowKey: keyof T;
  dense?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  loading = false,
  onRowClick,
  onSelectionChange,
  rowKey,
  dense = true,
  striped = true,
  hoverable = true,
  selectable = false,
  className = '',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<T[keyof T]>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(new Set(columns.map((column) => column.key)));

  const visibleColsArray = columns.filter((column) => visibleColumns.has(column.key));

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const comparison = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortOrder]);

  const publishSelection = (next: Set<T[keyof T]>) => {
    setSelectedRows(next);
    onSelectionChange?.(data.filter((row) => next.has(row[rowKey])));
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortOrder('asc');
  };

  const handleRowSelect = (key: T[keyof T]) => {
    const next = new Set(selectedRows);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    publishSelection(next);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      publishSelection(new Set());
      return;
    }
    publishSelection(new Set(data.map((row) => row[rowKey])));
  };

  if (loading) {
    return (
      <div className="erp-table-shell table-state">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="skeleton" style={{ height: 36 }} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="erp-table-shell table-empty">
        <strong>No records found</strong>
        <span>Try a different search, filter, or workspace.</span>
      </div>
    );
  }

  return (
    <div className={`erp-table-shell ${className}`}>
      <div className="table-column-bar">
        <span className="label-overline">Columns</span>
        <div>
          {columns.map((column) => {
            const isVisible = visibleColumns.has(column.key);
            return (
              <button
                key={String(column.key)}
                type="button"
                className={isVisible ? 'table-column-toggle active' : 'table-column-toggle'}
                onClick={() => {
                  const next = new Set(visibleColumns);
                  if (next.has(column.key)) next.delete(column.key);
                  else next.add(column.key);
                  setVisibleColumns(next);
                }}
              >
                {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                {column.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 44 }}>
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {visibleColsArray.map((column) => (
                <th key={String(column.key)} style={{ width: column.width, textAlign: column.align || 'left' }}>
                  {column.sortable ? (
                    <button type="button" className="table-sort-button" onClick={() => handleSort(column.key)}>
                      {column.label}
                      {sortKey === column.key ? (
                        sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      ) : null}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                className={`${striped && index % 2 === 0 ? 'is-striped' : ''} ${hoverable ? 'is-hoverable' : ''}`}
              >
                {selectable && (
                  <td>
                    <input
                      type="checkbox"
                      aria-label="Select row"
                      checked={selectedRows.has(row[rowKey])}
                      onChange={() => handleRowSelect(row[rowKey])}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </td>
                )}
                {visibleColsArray.map((column) => (
                  <td
                    key={String(column.key)}
                    className={dense ? 'is-dense' : ''}
                    style={{
                      textAlign: column.align || 'left',
                      width: column.width,
                    }}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] === null || row[column.key] === undefined || row[column.key] === ''
                        ? '-'
                        : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
