import { useState } from 'react';
import { Card, SearchBar } from '../../components/common';

// Exam Card Component
function ExamCard({ exam }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Left Border Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-primary-600 font-bold text-lg">{exam.term}</span>
        <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {exam.date}
        </div>
      </div>

      {/* Subject & Time */}
      <div className="mb-4">
        <h3 className="text-emerald-600 text-xl font-bold uppercase mb-1">{exam.subject}</h3>
        <div className="flex items-center text-amber-600 font-semibold text-lg">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {exam.time}
        </div>
      </div>

      {/* Notes */}
      {exam.notes && (
        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 border border-slate-100">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {exam.notes}
          </p>
        </div>
      )}
    </Card>
  );
}

function ExamSchedule() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with API calls
  const upcomingExams = [
    { id: 1, term: 'Term-I', subject: 'Chemistry', date: '15 Nov', time: '3:10 PM', notes: 'Full syllabus' },
    { id: 2, term: 'Term-I', subject: 'English', date: '13 Nov', time: '4:57 PM', notes: 'All portions' },
    { id: 3, term: 'Term-I', subject: 'Commerce', date: '03 Nov', time: '9:00 - 12:00', notes: 'Prepare Chapter 1-5' },
  ];

  const examTimetable = [
    { date: '02.07.2025', day: 'Wednesday', class1: 'MATHS', class2: 'EVS', class3: 'MATHS', class4: 'SCIENCE', class5: 'SOCIAL SCIENCE' },
    { date: '03.07.2025', day: 'Thursday', class1: 'TAMIL', class2: 'ENGLISH', class3: 'SOCIAL SCIENCE', class4: 'MATHS', class5: 'SCIENCE' },
    { date: '04.07.2025', day: 'Friday', class1: 'EVS', class2: 'TAMIL', class3: 'TAMIL', class4: 'ENGLISH', class5: 'TAMIL' },
    { date: '07.07.2025', day: 'Monday', class1: 'ENGLISH', class2: 'MATHS', class3: 'SCIENCE', class4: 'SOCIAL SCIENCE', class5: 'MATHS' },
    { date: '08.07.2025', day: 'Tuesday', class1: '---', class2: '---', class3: 'ENGLISH', class4: 'TAMIL', class5: 'ENGLISH' },
  ];

  // Filter exams based on search
  const filteredExams = upcomingExams.filter((exam) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return exam.subject.toLowerCase().includes(query) || exam.term.toLowerCase().includes(query);
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Exam Schedule</h2>
          <p className="text-sm text-slate-500 mt-1">Upcoming examinations and timetables for Term-I</p>
        </div>
        <div className="w-full md:w-64">
          <SearchBar
            placeholder="Search exams..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Upcoming Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))
        ) : (
          <Card className="col-span-full p-8 text-center">
            <p className="text-slate-500">No exams found matching your search.</p>
          </Card>
        )}
      </div>

      {/* Detailed Timetable */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
            Detailed Timetable
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-6">Sample exam schedule for July Unit Test - 2025</p>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th className="px-6 py-3 border-r border-slate-200">Day / Date</th>
                  <th className="px-6 py-3 border-r border-slate-200 text-center">Class I</th>
                  <th className="px-6 py-3 border-r border-slate-200 text-center">Class II</th>
                  <th className="px-6 py-3 border-r border-slate-200 text-center">Class III</th>
                  <th className="px-6 py-3 border-r border-slate-200 text-center">Class IV</th>
                  <th className="px-6 py-3 text-center">Class V</th>
                </tr>
              </thead>
              <tbody>
                {examTimetable.map((row, index) => (
                  <tr key={index} className="bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap border-r border-slate-200">
                      {row.date}<br />
                      <span className="text-xs text-slate-400 uppercase">{row.day}</span>
                    </td>
                    <td className={`px-6 py-4 text-center border-r border-slate-200 ${row.class1 === '---' ? 'text-slate-300' : ''}`}>{row.class1}</td>
                    <td className={`px-6 py-4 text-center border-r border-slate-200 ${row.class2 === '---' ? 'text-slate-300' : ''}`}>{row.class2}</td>
                    <td className={`px-6 py-4 text-center border-r border-slate-200 ${row.class3 === '---' ? 'text-slate-300' : ''}`}>{row.class3}</td>
                    <td className={`px-6 py-4 text-center border-r border-slate-200 ${row.class4 === '---' ? 'text-slate-300' : ''}`}>{row.class4}</td>
                    <td className={`px-6 py-4 text-center ${row.class5 === '---' ? 'text-slate-300' : ''}`}>{row.class5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-end">
            <div className="text-center">
              <div className="w-32 h-10 border-b border-slate-400 mb-2"></div>
              <p className="text-xs font-bold text-slate-600 uppercase">Principal</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ExamSchedule;
