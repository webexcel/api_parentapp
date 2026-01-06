import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/common';
import { ROUTES, NAV_ITEMS } from '../utils/constants';

// Icon components for navigation
const NavIcon = ({ name, isActive }) => {
  const icons = {
    dashboard: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    homework: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    circulars: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    academics: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    fees: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    exams: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gallery: (
      <svg className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  return icons[name] || icons.dashboard;
};

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { students, selectedStudent, switchStudent, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleStudentSwitch = (student) => {
    switchStudent(student);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-slate-200
          flex flex-col shrink-0 transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Student Details Section */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col gap-3">
            {students.length > 0 ? (
              students.map((student) => (
                <button
                  key={student.adno || student.id}
                  onClick={() => handleStudentSwitch(student)}
                  className={`
                    flex gap-3 items-center p-2 rounded-lg transition-colors text-left w-full
                    ${selectedStudent?.adno === student.adno
                      ? 'bg-primary-50 ring-2 ring-primary-500'
                      : 'hover:bg-slate-50'}
                  `}
                >
                  <Avatar
                    src={student.photo}
                    name={student.student_name || student.name}
                    size="md"
                  />
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-slate-900 text-sm font-semibold leading-tight truncate">
                      {student.student_name || student.name}
                    </h1>
                    <p className="text-slate-500 text-xs font-normal leading-tight">
                      Class {student.class_name || student.class}-{student.section_name || student.section}
                    </p>
                  </div>
                  {selectedStudent?.adno === student.adno && (
                    <svg className="w-4 h-4 text-primary-600 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="flex gap-3 items-center">
                <Avatar name="Student" size="md" />
                <div className="flex flex-col">
                  <h1 className="text-slate-900 text-sm font-semibold leading-tight">No Student</h1>
                  <p className="text-slate-500 text-xs font-normal leading-tight">Not linked</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`${isActive ? 'text-primary-600' : 'text-slate-500 group-hover:text-primary-600'} transition-colors`}>
                    <NavIcon name={item.icon} isActive={isActive} />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-bold tracking-wide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
