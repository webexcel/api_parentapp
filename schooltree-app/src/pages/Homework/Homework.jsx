import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Badge, Avatar, SearchBar } from '../../components/common';
import { HOMEWORK_STATUS, getSubjectIcon } from '../../utils/constants';

// Subject Icon Component
function SubjectIcon({ subject, className = '' }) {
  const subjectColors = {
    math: 'bg-indigo-100 text-indigo-600',
    mathematics: 'bg-indigo-100 text-indigo-600',
    science: 'bg-emerald-100 text-emerald-600',
    english: 'bg-orange-100 text-orange-600',
    art: 'bg-purple-100 text-purple-600',
    social: 'bg-amber-100 text-amber-600',
    'social studies': 'bg-amber-100 text-amber-600',
    hindi: 'bg-pink-100 text-pink-600',
    tamil: 'bg-pink-100 text-pink-600',
    computer: 'bg-cyan-100 text-cyan-600',
    default: 'bg-slate-100 text-slate-600',
  };

  const color = subjectColors[subject?.toLowerCase()] || subjectColors.default;
  const icon = getSubjectIcon(subject);

  return (
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color} ${className}`}>
      {icon}
    </div>
  );
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
      label: `Overdue: ${dueDate}`,
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
  const isOverdue = homework.status === HOMEWORK_STATUS.OVERDUE;

  return (
    <Card
      className={`p-5 flex flex-col md:flex-row items-start md:items-center gap-5 hover:shadow-md transition-all ${
        isOverdue ? 'border-l-4 border-l-red-500' : ''
      }`}
    >
      {/* Subject Icon */}
      <div className="flex-shrink-0">
        <SubjectIcon subject={homework.subject} />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
            {homework.subject}
          </span>
          <span className="text-xs text-slate-500">
            {homework.teacher}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 truncate">
          {homework.title}
        </h3>
        <p className="text-sm text-slate-500 truncate">
          {homework.description}
        </p>
      </div>

      {/* Status & Action */}
      <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
        <StatusBadge status={homework.status} dueDate={homework.dueDate} />
        <button className={`text-sm font-semibold transition-colors ${
          homework.status === HOMEWORK_STATUS.SUBMITTED
            ? 'text-slate-500 hover:text-slate-700'
            : 'text-primary-600 hover:text-primary-700'
        }`}>
          {homework.status === HOMEWORK_STATUS.SUBMITTED
            ? 'Review'
            : homework.status === HOMEWORK_STATUS.OVERDUE
              ? 'Submit Late'
              : 'View Details'}
        </button>
      </div>
    </Card>
  );
}

// Student Filter Button
function StudentFilter({ student, isSelected, onClick }) {
  const name = student.student_name || student.name;

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
  const { students, selectedStudent } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudentId, setActiveStudentId] = useState(selectedStudent?.adno || null);

  // Mock data - will be replaced with API calls
  const homeworkList = [
    {
      id: 1,
      subject: 'Math',
      title: 'Algebra Basics - Worksheet 4',
      description: 'Complete problems 1-20 on page 42.',
      teacher: 'Mr. Anderson',
      dueDate: 'Tomorrow',
      status: HOMEWORK_STATUS.DUE_TOMORROW,
    },
    {
      id: 2,
      subject: 'Science',
      title: 'Volcano Project',
      description: 'Build a working model volcano and submit video.',
      teacher: 'Mrs. Frizzle',
      dueDate: 'Oct 15',
      status: HOMEWORK_STATUS.PENDING,
    },
    {
      id: 3,
      subject: 'English',
      title: "Reading Log - Chapter 3",
      description: "Submit summary of Chapter 3 from 'The Giver'.",
      teacher: 'Mr. Keating',
      dueDate: 'Yesterday',
      status: HOMEWORK_STATUS.OVERDUE,
    },
    {
      id: 4,
      subject: 'Art',
      title: 'Color Theory Quiz',
      description: 'Online quiz about primary and secondary colors.',
      teacher: 'Ms. Kahlo',
      dueDate: 'Oct 10',
      status: HOMEWORK_STATUS.SUBMITTED,
    },
    {
      id: 5,
      subject: 'Social Studies',
      title: 'Indus Valley Map Work',
      description: 'Mark the major sites of the Indus Valley Civilization.',
      teacher: 'Mrs. Thompson',
      dueDate: 'Oct 28',
      status: HOMEWORK_STATUS.PENDING,
    },
  ];

  // Filter homework based on search query
  const filteredHomework = homeworkList.filter((hw) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      hw.subject.toLowerCase().includes(query) ||
      hw.title.toLowerCase().includes(query) ||
      hw.description.toLowerCase().includes(query)
    );
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
            {students.map((student) => (
              <StudentFilter
                key={student.adno || student.id}
                student={student}
                isSelected={activeStudentId === (student.adno || student.id)}
                onClick={() => setActiveStudentId(student.adno || student.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Homework List */}
      <div className="flex flex-col gap-4">
        {filteredHomework.length > 0 ? (
          filteredHomework.map((homework) => (
            <HomeworkCard key={homework.id} homework={homework} />
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

      {/* Pagination Info */}
      {filteredHomework.length > 0 && (
        <div className="flex justify-center py-4">
          <p className="text-sm text-slate-500">
            Showing {filteredHomework.length} of {homeworkList.length} assignments
          </p>
        </div>
      )}
    </div>
  );
}

export default Homework;
