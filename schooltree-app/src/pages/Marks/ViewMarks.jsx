import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Loader } from '../../components/common';
import { getTermTypes, getExamNames, getTermReportCard, getMarks } from '../../services/reportCardService';

// Grade Badge Component
function GradeBadge({ grade }) {
  const gradeColors = {
    'A1': 'bg-green-100 text-green-700',
    'A2': 'bg-green-100 text-green-700',
    'A': 'bg-green-100 text-green-700',
    'B1': 'bg-blue-100 text-blue-700',
    'B2': 'bg-blue-100 text-blue-700',
    'B': 'bg-blue-100 text-blue-700',
    'C1': 'bg-yellow-100 text-yellow-700',
    'C2': 'bg-yellow-100 text-yellow-700',
    'C': 'bg-yellow-100 text-yellow-700',
    'D': 'bg-orange-100 text-orange-700',
    'E': 'bg-red-100 text-red-700',
    'F': 'bg-red-100 text-red-700',
  };

  const colorClass = gradeColors[grade] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold ${colorClass}`}>
      {grade || '-'}
    </span>
  );
}

function ViewMarks() {
  const { students, selectedStudent } = useAuth();
  const [activeStudent, setActiveStudent] = useState(selectedStudent);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  // Filter states
  const [termTypes, setTermTypes] = useState([]);
  const [examNames, setExamNames] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');

  // Report data
  const [reportData, setReportData] = useState(null);
  const [subjects, setSubjects] = useState([]);

  // Get student info
  const getStudentInfo = (student) => {
    return {
      adno: student?.ADNO || student?.adno || student?.ADMISSION_ID,
      classId: student?.CLASS_ID || student?.classid || student?.CLASSID,
      yearId: student?.YEARID || student?.yearid || student?.YEAR_ID || '5',
      name: student?.NAME || student?.SNAME || student?.student_name || student?.name || 'Student'
    };
  };

  // Fetch term types and exam names on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!activeStudent) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { classId } = getStudentInfo(activeStudent);

      try {
        // Fetch term types and exam names in parallel
        const [termResult, examResult] = await Promise.all([
          getTermTypes(),
          getExamNames(classId)
        ]);

        if (termResult.success) {
          const terms = termResult.data?.data || termResult.data || [];
          setTermTypes(Array.isArray(terms) ? terms : []);
          // Set default term if available - API returns { type: "term1" }
          if (terms.length > 0) {
            setSelectedTerm(terms[0].type || terms[0].TERMTYPE || terms[0].termtype || terms[0].value || '');
          }
        }

        if (examResult.success) {
          const exams = examResult.data?.data || examResult.data || [];
          setExamNames(Array.isArray(exams) ? exams : []);
          // Set default exam if available
          if (exams.length > 0) {
            setSelectedExam(exams[0].EXGRPID || exams[0].exgrpid || exams[0].id || '');
          }
        }

        // Also fetch initial marks
        await fetchMarks();
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [activeStudent]);

  // Fetch marks data
  const fetchMarks = async () => {
    if (!activeStudent) return;

    const { adno } = getStudentInfo(activeStudent);
    if (!adno) return;

    try {
      const result = await getMarks(adno);
      if (result.success) {
        const data = result.data?.data || result.data || [];
        setSubjects(Array.isArray(data) ? data : []);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error('Error fetching marks:', err);
      setSubjects([]);
    }
  };

  // Fetch term report card
  const handleFetchReport = async () => {
    if (!activeStudent || !selectedExam || !selectedTerm) return;

    const { adno, classId, yearId } = getStudentInfo(activeStudent);
    if (!adno) return;

    setLoadingReport(true);

    try {
      const result = await getTermReportCard(adno, classId, selectedExam, yearId, selectedTerm);
      if (result.success) {
        const data = result.data?.data || result.data;
        setReportData(data);
        // If report has subjects, update subjects list
        if (data?.subjects || data?.SUBJECTS) {
          const subjectList = data.subjects || data.SUBJECTS || [];
          setSubjects(Array.isArray(subjectList) ? subjectList : []);
        }
      } else {
        setReportData(null);
      }
    } catch (err) {
      console.error('Error fetching report card:', err);
      setReportData(null);
    } finally {
      setLoadingReport(false);
    }
  };

  // Update active student when selectedStudent changes
  useEffect(() => {
    if (selectedStudent) {
      setActiveStudent(selectedStudent);
    }
  }, [selectedStudent]);

  // Calculate totals - API returns { exam_name, sub_id, maxMarks, Grade }
  // Note: API only returns Grade, not obtained marks
  const calculateTotals = () => {
    if (!subjects || subjects.length === 0) return { total: 0, max: 0, percentage: 0, hasMarks: false };

    let totalMax = 0;
    let hasMarks = false;

    subjects.forEach(subject => {
      const max = parseFloat(subject.maxMarks || subject.MAX_MARKS || subject.max_marks || subject.maxScore || 0);
      totalMax += max;
      // Check if we have actual marks or just grades
      if (subject.MARKS || subject.marks || subject.obtained || subject.score) {
        hasMarks = true;
      }
    });

    return { total: 0, max: totalMax, percentage: 0, hasMarks };
  };

  const { total, max, percentage, hasMarks } = calculateTotals();
  const { name: studentName } = activeStudent ? getStudentInfo(activeStudent) : { name: 'Student' };

  // Get display values for term and exam
  const getTermLabel = (termValue) => {
    const term = termTypes.find(t => (t.type || t.TERMTYPE || t.termtype || t.value) === termValue);
    // Format term1 -> Term 1, term2 -> Term 2, etc.
    const termType = term?.type || termValue;
    if (termType && termType.startsWith('term')) {
      return `Term ${termType.replace('term', '')}`;
    }
    return term?.TERM_NAME || term?.termName || term?.label || termValue || 'Term';
  };

  const getExamLabel = (examId) => {
    const exam = examNames.find(e => (e.EXGRPID || e.exgrpid || e.id) === examId);
    return exam?.EXAM_NAME || exam?.examName || exam?.name || 'Exam';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Student Tabs */}
      {students && students.length > 1 && (
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {students.map((student, index) => {
              const { name, adno } = getStudentInfo(student);
              const activeAdno = activeStudent ? getStudentInfo(activeStudent).adno : null;
              const isActive = adno === activeAdno;

              return (
                <button
                  key={adno || index}
                  onClick={() => setActiveStudent(student)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {name.toUpperCase()}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* Filters */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Term</label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full rounded-lg border-slate-300 bg-slate-50 focus:border-primary-500 focus:ring-primary-500 p-3"
                >
                  {termTypes.length === 0 && <option value="">No terms available</option>}
                  {termTypes.map((term, index) => {
                    // API returns { type: "term1" }
                    const value = term.type || term.TERMTYPE || term.termtype || term.value || '';
                    // Format term1 -> Term 1
                    let label = term.TERM_NAME || term.termName || term.label || value;
                    if (value && value.startsWith('term')) {
                      label = `Term ${value.replace('term', '')}`;
                    }
                    return (
                      <option key={index} value={value}>{label}</option>
                    );
                  })}
                </select>
              </div>
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Exam</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full rounded-lg border-slate-300 bg-slate-50 focus:border-primary-500 focus:ring-primary-500 p-3"
                >
                  {examNames.length === 0 && <option value="">No exams available</option>}
                  {examNames.map((exam, index) => {
                    const value = exam.EXGRPID || exam.exgrpid || exam.id || '';
                    const label = exam.EXAM_NAME || exam.examName || exam.name || value;
                    return (
                      <option key={index} value={value}>{label}</option>
                    );
                  })}
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={handleFetchReport}
                  disabled={loadingReport || !selectedTerm || !selectedExam}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-lg shadow transition-colors flex justify-center items-center gap-2"
                >
                  {loadingReport ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      View
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          {subjects.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Results Summary Card */}
                <Card className="lg:col-span-2 overflow-hidden">
                  <div className="bg-primary-600 text-white p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/20">
                        <div>
                          <h3 className="text-xl font-bold">{studentName}</h3>
                          <p className="text-white/70 text-sm">{getTermLabel(selectedTerm)} - {getExamLabel(selectedExam)}</p>
                        </div>
                      </div>

                      {/* Subject Grades Preview */}
                      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                        {subjects.slice(0, 6).map((subject, index) => {
                          // API returns: exam_name, sub_id, maxMarks, Grade
                          const name = subject.exam_name || subject.sub_id || subject.SUBJECT || subject.subject || 'Subject';
                          const grade = subject.Grade || subject.GRADE || subject.grade || '-';
                          const maxMarks = subject.maxMarks || subject.MAX_MARKS || 0;
                          return (
                            <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                              <span className="font-medium text-white text-sm truncate mr-2">{name}</span>
                              <span className="bg-white/20 px-2 py-1 rounded text-white font-bold text-sm">{grade}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Stats Card */}
                <Card className="p-6 flex flex-col justify-center">
                  <h3 className="font-semibold text-lg text-slate-900 mb-4">Summary</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg text-center">
                      <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Total Subjects</span>
                      <span className="text-3xl font-bold text-slate-900">{subjects.length}</span>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-lg text-center">
                      <span className="text-primary-600 text-xs uppercase tracking-wider block mb-1">Max Marks</span>
                      <span className="text-2xl font-bold text-primary-600">{max}</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <span className="text-green-600 text-xs uppercase tracking-wider block mb-1">Exam</span>
                      <span className="text-lg font-bold text-green-600">{getExamLabel(selectedExam)}</span>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Exam / Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Max Marks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {subjects.map((subject, index) => {
                        // API returns: exam_name, sub_id, maxMarks, Grade
                        const examName = subject.exam_name || subject.SUBJECT || subject.subject || '-';
                        const subId = subject.sub_id || subject.SUBJECT_ID || '-';
                        const maxMarks = subject.maxMarks || subject.MAX_MARKS || subject.max_marks || 0;
                        const grade = subject.Grade || subject.GRADE || subject.grade || '-';

                        return (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{examName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{subId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{maxMarks}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <GradeBadge grade={grade} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-100">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">Total</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{subjects.length} subjects</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{max}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            </>
          ) : (
            /* Empty State */
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">No Results Found</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Select a term and exam, then click View to see the report card
                  </p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default ViewMarks;
