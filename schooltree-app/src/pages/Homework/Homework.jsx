import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Badge, Avatar, SearchBar, Loader, MediaSlider } from '../../components/common';
import { HOMEWORK_STATUS, getSubjectIcon } from '../../utils/constants';
import { getHomework } from '../../services/homeworkService';

// Subject Icon Component
function SubjectIcon({ subject, className = '' }) {
  const subjectColors = {
    math: 'bg-indigo-100 text-indigo-600',
    mathematics: 'bg-indigo-100 text-indigo-600',
    maths: 'bg-indigo-100 text-indigo-600',
    science: 'bg-emerald-100 text-emerald-600',
    biology: 'bg-emerald-100 text-emerald-600',
    physics: 'bg-blue-100 text-blue-600',
    chemistry: 'bg-purple-100 text-purple-600',
    english: 'bg-orange-100 text-orange-600',
    art: 'bg-purple-100 text-purple-600',
    social: 'bg-amber-100 text-amber-600',
    'social studies': 'bg-amber-100 text-amber-600',
    hindi: 'bg-pink-100 text-pink-600',
    tamil: 'bg-pink-100 text-pink-600',
    french: 'bg-rose-100 text-rose-600',
    computer: 'bg-cyan-100 text-cyan-600',
    comp_sci: 'bg-cyan-100 text-cyan-600',
    default: 'bg-slate-100 text-slate-600',
  };

  const normalizedSubject = subject?.toLowerCase()?.replace(/[_-]/g, '') || '';
  const color = Object.entries(subjectColors).find(([key]) =>
    normalizedSubject.includes(key.replace(/[_-\s]/g, ''))
  )?.[1] || subjectColors.default;

  const icon = getSubjectIcon(subject);

  return (
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color} ${className}`}>
      {icon}
    </div>
  );
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) return 'Today';
    if (dateOnly.getTime() === tomorrowOnly.getTime()) return 'Tomorrow';
    if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'Yesterday';

    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}

// Determine homework status
function getHomeworkStatus(dateString) {
  if (!dateString) return HOMEWORK_STATUS.PENDING;

  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly < todayOnly) return HOMEWORK_STATUS.OVERDUE;
    if (dateOnly.getTime() === tomorrowOnly.getTime()) return HOMEWORK_STATUS.DUE_TOMORROW;
    return HOMEWORK_STATUS.PENDING;
  } catch {
    return HOMEWORK_STATUS.PENDING;
  }
}

// Status Badge Component
function StatusBadge({ status, dueDate }) {
  const statusConfig = {
    [HOMEWORK_STATUS.OVERDUE]: {
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      label: `Overdue`,
    },
    [HOMEWORK_STATUS.DUE_TOMORROW]: {
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      dot: true,
      label: 'Due Tomorrow',
    },
    [HOMEWORK_STATUS.PENDING]: {
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      dot: true,
      label: `Due ${dueDate}`,
    },
    [HOMEWORK_STATUS.SUBMITTED]: {
      className: 'bg-green-100 text-green-700 border-green-200',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Submitted',
    },
  };

  const config = statusConfig[status] || statusConfig[HOMEWORK_STATUS.PENDING];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${config.className}`}>
      {config.icon}
      {config.dot && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
      {config.label}
    </span>
  );
}

// Homework Card Component
function HomeworkCard({ homework }) {
  const status = homework.status || getHomeworkStatus(homework.MSG_DATE);
  const isOverdue = status === HOMEWORK_STATUS.OVERDUE;
  const dueDate = formatDate(homework.MSG_DATE);
  const subject = homework.subject || homework.SUBJECT || 'General';
  const message = homework.MESSAGE || homework.message || homework.description || '';
  const className = homework.CLASS || homework.class || '';

  return (
    <Card
      className={`p-5 flex flex-col gap-4 hover:shadow-md transition-all ${
        isOverdue ? 'border-l-4 border-l-red-500' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Subject Icon */}
        <div className="flex-shrink-0">
          <SubjectIcon subject={subject} />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
              {subject}
            </span>
            {className && (
              <span className="text-xs text-slate-500">
                Class: {className}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {subject} Homework
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {message}
          </p>
        </div>

        {/* Status & Action */}
        <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
          <StatusBadge status={status} dueDate={dueDate} />
          <span className="text-xs text-slate-400">{dueDate}</span>
        </div>
      </div>

      {/* Media Attachments */}
      {homework.event_image && (
        <MediaSlider media={homework.event_image} />
      )}
    </Card>
  );
}

// Student Filter Button
function StudentFilter({ student, isSelected, onClick }) {
  const name = student.NAME || student.SNAME || student.name || 'Student';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-lg whitespace-nowrap transition-all ${
        isSelected
          ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
          : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50'
      }`}
    >
      <Avatar src={student.photo} name={name} size="xs" />
      <span>{name}</span>
    </button>
  );
}

function Homework() {
  const { students, selectedStudent, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudent, setActiveStudent] = useState(selectedStudent);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 10;

  // Fetch homework data when student changes
  useEffect(() => {
    const fetchHomework = async () => {
      if (!activeStudent) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setCurrentPage(0);

      try {
        const classId = activeStudent.CLASS_ID || activeStudent.classid || activeStudent.CLASSID;
        const adno = activeStudent.ADNO || activeStudent.adno || activeStudent.ADMISSION_ID;

        const result = await getHomework(classId, adno, pageSize, 0);

        if (result.success) {
          const data = result.data?.data || result.data || [];
          setHomeworkList(Array.isArray(data) ? data : []);
          setTotalSize(result.data?.total_size || data.length);
        } else {
          setHomeworkList([]);
        }
      } catch (err) {
        console.error('Error fetching homework:', err);
        setHomeworkList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [activeStudent]);

  // Load more homework
  const handleLoadMore = async () => {
    if (loadingMore || !activeStudent) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const classId = activeStudent.CLASS_ID || activeStudent.classid || activeStudent.CLASSID;
      const adno = activeStudent.ADNO || activeStudent.adno || activeStudent.ADMISSION_ID;

      const result = await getHomework(classId, adno, pageSize, nextPage * pageSize);

      if (result.success) {
        const data = result.data?.data || result.data || [];
        if (Array.isArray(data)) {
          setHomeworkList(prev => [...prev, ...data]);
          setCurrentPage(nextPage);
        }
      }
    } catch (err) {
      console.error('Error loading more homework:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = homeworkList.length < totalSize;

  // Update active student when selectedStudent changes
  useEffect(() => {
    if (selectedStudent) {
      setActiveStudent(selectedStudent);
    }
  }, [selectedStudent]);

  // Filter homework based on search query
  const filteredHomework = homeworkList.filter((hw) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const subject = (hw.subject || hw.SUBJECT || '').toLowerCase();
    const message = (hw.MESSAGE || hw.message || '').toLowerCase();
    const className = (hw.CLASS || hw.class || '').toLowerCase();
    return subject.includes(query) || message.includes(query) || className.includes(query);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full md:w-96">
          <SearchBar
            placeholder="Search subject or topic..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Student Filters */}
        {students.length > 1 && (
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {students.map((student) => {
              const studentId = student.ADNO || student.adno || student.id;
              const activeId = activeStudent?.ADNO || activeStudent?.adno || activeStudent?.id;
              return (
                <StudentFilter
                  key={studentId}
                  student={student}
                  isSelected={activeId === studentId}
                  onClick={() => setActiveStudent(student)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      )}


      {/* Homework List */}
      {!loading && (
        <div className="flex flex-col gap-4">
          {filteredHomework.length > 0 ? (
            filteredHomework.map((homework) => (
              <HomeworkCard key={homework.MSG_ID || homework.id} homework={homework} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">No homework found</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {searchQuery
                      ? 'Try adjusting your search query'
                      : 'No assignments available at the moment'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Load More / Pagination Info */}
      {!loading && filteredHomework.length > 0 && (
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm text-slate-500">
            Showing {filteredHomework.length} of {totalSize} assignments
          </p>
          {hasMore && !searchQuery && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Homework;
