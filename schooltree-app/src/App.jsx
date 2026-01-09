import { useState, useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, ErrorBoundary, ScrollToTop } from './components/common';
import AppRoutes from './routes/AppRoutes';
import FlashMessageQueue from './components/FlashMessageQueue';
import { getFlashMessage } from './services/dashboardService';
import { useAuth } from './hooks/useAuth';

// Flash message handler - only loads when authenticated
function FlashMessageHandler() {
  const { isAuthenticated, loading } = useAuth();
  const [flashMessages, setFlashMessages] = useState([]);
  const [flashShown, setFlashShown] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Wait for auth to finish loading
    // Only fetch if authenticated and haven't fetched yet
    if (loading || !isAuthenticated || hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    const loadFlashMessages = async () => {
      try {
        const result = await getFlashMessage();
        if (result.success && result.data) {
          const responseData = result.data?.data || result.data;
          if (Array.isArray(responseData) && responseData.length > 0) {
            setFlashMessages(responseData);
          }
        }
      } catch (error) {
        console.error('Error fetching flash messages:', error);
      }
    };

    loadFlashMessages();
  }, [isAuthenticated, loading]);

  const handleFlashComplete = () => {
    setFlashMessages([]);
    setFlashShown(true);
  };

  if (!isAuthenticated || flashShown || flashMessages.length === 0) {
    return null;
  }

  return (
    <FlashMessageQueue
      messages={flashMessages}
      onComplete={handleFlashComplete}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
            {/* Global Flash Message Queue - shows only once after login */}
            <FlashMessageHandler />
            {/* Global Scroll to Top Button */}
            <ScrollToTop />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
