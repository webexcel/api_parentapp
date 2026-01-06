import { clsx } from 'clsx';

function Table({ children, className, ...props }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx('min-w-full divide-y divide-gray-200', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

function TableHead({ children, className }) {
  return (
    <thead className={clsx('bg-gray-50', className)}>
      {children}
    </thead>
  );
}

function TableBody({ children, className }) {
  return (
    <tbody className={clsx('bg-white divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
}

function TableRow({ children, className, onClick, hoverable = true }) {
  return (
    <tr
      className={clsx(
        hoverable && 'hover:bg-gray-50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

function TableHeader({ children, className, align = 'left' }) {
  return (
    <th
      className={clsx(
        'px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </th>
  );
}

function TableCell({ children, className, align = 'left' }) {
  return (
    <td
      className={clsx(
        'px-4 py-4 whitespace-nowrap text-sm text-gray-900',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </td>
  );
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;

export default Table;
