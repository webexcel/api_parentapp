import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/common';

function Header({ title, onMenuClick }) {
  const { user, selectedStudent } = useAuth();

  // Get initials for avatar
  const getInitials = () => {
    if (selectedStudent?.student_name) {
      return selectedStudent.student_name.charAt(0).toUpperCase();
    }
    if (user?.mobile_no) {
      return 'P'; // Parent
    }
    return 'U';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page title */}
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Notification badge */}
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* User avatar */}
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
          {getInitials()}
        </div>
      </div>
    </header>
  );
}

export default Header;
