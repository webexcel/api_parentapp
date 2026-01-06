import { clsx } from 'clsx';

function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={clsx('border-b border-gray-200', className)}>
      <nav className="flex gap-4 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Pill-style tabs
function TabsPill({ tabs, activeTab, onChange, className }) {
  return (
    <div className={clsx('flex gap-2 p-1 bg-gray-100 rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

Tabs.Pill = TabsPill;

export default Tabs;
