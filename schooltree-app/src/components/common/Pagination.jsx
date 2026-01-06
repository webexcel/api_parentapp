import { clsx } from 'clsx';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  className,
}) {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <nav className={clsx('flex items-center justify-center gap-1', className)}>
      {/* First Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="First page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              'px-3 py-2 rounded-lg font-medium transition-colors duration-200',
              currentPage === page
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Last Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Last page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

export default Pagination;
