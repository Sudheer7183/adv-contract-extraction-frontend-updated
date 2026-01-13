import React from 'react';
import './ModernTable.scss';

interface ModernTableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

export const ModernTable: React.FC<ModernTableProps> = ({
  children,
  className = '',
  striped = true,
  hoverable = true,
  bordered = false
}) => {
  const tableClass = [
    'modern-table',
    striped ? 'modern-table-striped' : '',
    hoverable ? 'modern-table-hoverable' : '',
    bordered ? 'modern-table-bordered' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="modern-table-wrapper">
      <table className={tableClass}>
        {children}
      </table>
    </div>
  );
};

interface ModernTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernTableHeader: React.FC<ModernTableHeaderProps> = ({
  children,
  className = ''
}) => {
  return (
    <thead className={`modern-table-thead ${className}`}>
      {children}
    </thead>
  );
};

interface ModernTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernTableBody: React.FC<ModernTableBodyProps> = ({
  children,
  className = ''
}) => {
  return (
    <tbody className={`modern-table-tbody ${className}`}>
      {children}
    </tbody>
  );
};

interface ModernTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const ModernTableRow: React.FC<ModernTableRowProps> = ({
  children,
  className = '',
  onClick,
  selected = false
}) => {
  const rowClass = [
    'modern-table-row',
    selected ? 'modern-table-row-selected' : '',
    onClick ? 'modern-table-row-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <tr className={rowClass} onClick={onClick}>
      {children}
    </tr>
  );
};

interface ModernTableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  align?: 'left' | 'center' | 'right';
}

export const ModernTableCell: React.FC<ModernTableCellProps> = ({
  children,
  className = '',
  colSpan,
  align = 'left'
}) => {
  return (
    <td
      className={`modern-table-cell modern-table-cell-${align} ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

interface ModernTableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
  align?: 'left' | 'center' | 'right';
}

export const ModernTableHeaderCell: React.FC<ModernTableHeaderCellProps> = ({
  children,
  className = '',
  sortable = false,
  onSort,
  sortDirection = null,
  align = 'left'
}) => {
  const headerClass = [
    'modern-table-header-cell',
    `modern-table-cell-${align}`,
    sortable ? 'modern-table-header-sortable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <th className={headerClass} onClick={sortable ? onSort : undefined}>
      <div className="modern-table-header-content">
        <span>{children}</span>
        {sortable && (
          <span className="modern-table-sort-icon">
            {sortDirection === 'asc' && '↑'}
            {sortDirection === 'desc' && '↓'}
            {!sortDirection && '⇅'}
          </span>
        )}
      </div>
    </th>
  );
};
