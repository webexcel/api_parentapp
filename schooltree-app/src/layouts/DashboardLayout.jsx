import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { NAV_ITEMS } from '../utils/constants';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get current page title from NAV_ITEMS
  const getPageTitle = () => {
    const currentItem = NAV_ITEMS.find((item) => {
      // Handle dynamic routes like /gallery/:albumId
      if (item.path.includes(':')) {
        const basePath = item.path.split(':')[0];
        return location.pathname.startsWith(basePath);
      }
      return item.path === location.pathname;
    });
    return currentItem?.label || 'Dashboard';
  };

  return (
    <div className="bg-slate-50 text-slate-900 h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
