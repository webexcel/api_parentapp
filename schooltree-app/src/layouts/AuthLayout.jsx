import { Link } from 'react-router-dom';

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">Alpha Portal</span>
        </div>
        <Link
          to="#"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Help Center
        </Link>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500">
        By logging in, you agree to Alpha Portal's{' '}
        <Link to="#" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="#" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </footer>
    </div>
  );
}

export default AuthLayout;
