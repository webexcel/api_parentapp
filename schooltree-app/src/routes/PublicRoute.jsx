import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/common';
import { ROUTES } from '../utils/constants';

/**
 * Public route wrapper - redirects to dashboard if already authenticated
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to the page they tried to visit or dashboard
    const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return children;
}

export default PublicRoute;
