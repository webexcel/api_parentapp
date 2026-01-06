import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, ErrorBoundary } from './components/common';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
