import { clsx } from 'clsx';
import Card from './Card';

const defaultIcons = {
  default: (
    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  search: (
    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  error: (
    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function EmptyState({
  icon,
  iconType = 'default',
  title,
  description,
  action,
  className,
}) {
  const iconElement = icon || defaultIcons[iconType] || defaultIcons.default;

  return (
    <Card className={clsx('p-8 text-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          {iconElement}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </Card>
  );
}

export default EmptyState;
