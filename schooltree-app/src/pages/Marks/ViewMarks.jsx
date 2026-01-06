import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Badge, Tabs } from '../../components/common';

// Subject Score Row
function SubjectScore({ subject, icon, score, maxScore }) {
  const percentage = (score / maxScore) * 100;

  return (
    <>
      <li className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
          <span className="font-medium text-lg">{subject}</span>
        </div>
        <span className="text-2xl font-bold">
          {score}<span className="text-sm opacity-60 font-normal">/{maxScore}</span>
        </span>
      </li>
      <li className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
        <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
      </li>
    </>
  );
}

// Performance Bar
function PerformanceBar({ label, percentage, isActive, isPending }) {
  return (
    <div className="flex flex-col items-center gap-2 group w-full">
      <div className="relative w-full flex justify-center items-end h-full">
        <div
          className={`w-full md:w-12 rounded-t-md transition-all duration-500 ${
            isPending
              ? 'bg-slate-100 border-t border-x border-slate-200 border-dashed'
              : isActive
                ? 'bg-primary-500 shadow-lg shadow-primary-500/30'
                : 'bg-blue-200 group-hover:bg-blue-300'
          }`}
          style={{ height: `${isPending ? 90 : percentage}%` }}
        >
          {!isPending && (
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold ${
              isActive ? 'text-primary-600 opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'
            } transition-opacity`}>
              {percentage}%
            </div>
          )}
        </div>
      </div>
      <span className={`text-xs font-medium ${isActive ? 'text-primary-600 font-bold' : 'text-slate-500'}`}>{label}</span>
    </div>
  );
}

function ViewMarks() {
  const { students, selectedStudent } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [selectedExam, setSelectedExam] = useState('Term-I');

  // Mock data - will be replaced with API calls
  const reportCard = {
    term: 'Term-I',
    year: '2025-2026',
    status: 'Passed',
    subjects: [
      { name: 'English', score: 87, maxScore: 100, grade: 'A2', remarks: 'Excellent progress' },
      { name: 'Mathematics', score: 80, maxScore: 100, grade: 'B1', remarks: 'Good, needs practice' },
      { name: 'Science', score: 92, maxScore: 100, grade: 'A1', remarks: 'Outstanding' },
    ],
  };

  const performanceData = [
    { label: 'Unit 1', percentage: 65, isActive: false, isPending: false },
    { label: 'Unit 2', percentage: 72, isActive: false, isPending: false },
    { label: 'Mid-Term', percentage: 78, isActive: false, isPending: false },
    { label: 'Term 1', percentage: 86.3, isActive: true, isPending: false },
    { label: 'Unit 3', percentage: 0, isActive: false, isPending: true },
  ];

  const totalScore = reportCard.subjects.reduce((sum, s) => sum + s.score, 0);
  const totalMaxScore = reportCard.subjects.reduce((sum, s) => sum + s.maxScore, 0);
  const percentage = ((totalScore / totalMaxScore) * 100).toFixed(1);

  // Student tabs
  const studentTabs = students.map((s, index) => ({
    label: s.student_name || s.name || `Student ${index + 1}`,
    value: index,
  }));

  // Subject icons mapping
  const subjectIcons = {
    English: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    ),
    Mathematics: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
      </svg>
    ),
    Science: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.344c2.672 0 4.011-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Student Tabs */}
      {students.length > 1 && (
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {studentTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === index
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {tab.label.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border-slate-300 bg-slate-50 focus:border-primary-500 focus:ring-primary-500 p-3"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full rounded-lg border-slate-300 bg-slate-50 focus:border-primary-500 focus:ring-primary-500 p-3"
            >
              <option value="Term-I">Term-I</option>
              <option value="Term-II">Term-II</option>
              <option value="Mid-Term">Mid-Term</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition-colors flex justify-center items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Submit
            </button>
          </div>
        </div>
      </Card>

      {/* Report Card & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Card */}
        <Card className="overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-lg text-slate-900">Report Card</h3>
            <Badge variant="success" size="sm">{reportCard.status}</Badge>
          </div>
          <div className="p-6">
            {/* Results Card */}
            <div className="bg-primary-600 rounded-xl text-white p-6 shadow-lg mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-4 border-b border-white/20 pb-2">
                  <h4 className="text-xl font-bold">{reportCard.term} Results</h4>
                  <span className="text-sm opacity-80">{reportCard.year}</span>
                </div>
                <ul className="space-y-4">
                  {reportCard.subjects.map((subject, index) => (
                    <SubjectScore
                      key={index}
                      subject={subject.name}
                      icon={subjectIcons[subject.name]}
                      score={subject.score}
                      maxScore={subject.maxScore}
                    />
                  ))}
                </ul>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Total Marks</span>
                <span className="text-2xl font-bold text-slate-900">{totalScore}</span>
                <span className="text-xs text-slate-400">/ {totalMaxScore}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Percentage</span>
                <span className="text-2xl font-bold text-primary-600">{percentage}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Overview */}
        <Card className="flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-lg text-slate-900">Performance Overview</h3>
            <select className="bg-transparent text-xs text-slate-500 border-none focus:ring-0 cursor-pointer">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-end">
            <div className="flex items-end justify-between h-64 w-full gap-2 md:gap-4 px-2">
              {performanceData.map((data, index) => (
                <PerformanceBar
                  key={index}
                  label={data.label}
                  percentage={data.percentage}
                  isActive={data.isActive}
                  isPending={data.isPending}
                />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Analysis:</span> Consistent improvement shown across terms. Term 1 performance is <span className="text-green-600 font-medium">+8.3%</span> higher than Mid-Term.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-lg text-slate-900">Detailed Subject Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Max Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Obtained</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reportCard.subjects.map((subject, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{subject.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{subject.maxScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">{subject.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 font-bold">{subject.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{subject.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default ViewMarks;
