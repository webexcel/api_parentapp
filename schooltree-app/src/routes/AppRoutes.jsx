import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layouts
import { DashboardLayout } from '../layouts';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Homework from '../pages/Homework';
import Circulars from '../pages/Circulars';
import Attendance from '../pages/Attendance';
import { FeePayment, PaymentSuccess } from '../pages/Fees';
import ExamSchedule from '../pages/Exams';
import ViewMarks from '../pages/Marks';
import { Gallery, AlbumView } from '../pages/Gallery';
import NotFound from '../pages/NotFound/NotFound';

// Wrapper component for protected routes with dashboard layout
function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to dashboard (will redirect to login if not authenticated) */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* Public Routes - Redirect to dashboard if already logged in */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Dashboard Layout */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedPage>
            <Dashboard />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.HOMEWORK}
        element={
          <ProtectedPage>
            <Homework />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.CIRCULARS}
        element={
          <ProtectedPage>
            <Circulars />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.ATTENDANCE}
        element={
          <ProtectedPage>
            <Attendance />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.FEES}
        element={
          <ProtectedPage>
            <FeePayment />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.FEES_SUCCESS}
        element={
          <ProtectedPage>
            <PaymentSuccess />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.EXAMS}
        element={
          <ProtectedPage>
            <ExamSchedule />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.MARKS}
        element={
          <ProtectedPage>
            <ViewMarks />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.GALLERY}
        element={
          <ProtectedPage>
            <Gallery />
          </ProtectedPage>
        }
      />
      <Route
        path={ROUTES.ALBUM}
        element={
          <ProtectedPage>
            <AlbumView />
          </ProtectedPage>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
