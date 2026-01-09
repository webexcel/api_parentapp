import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Loader } from '../../components/common';
import { getAttendance } from '../../services/attendanceService';

// Month names
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

// Get current year and generate year options
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

// Get days in a month
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

// Parse date from API format "MM-DD-YYYY" to Date object
function parseAbsentDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  // Format: MM-DD-YYYY
  const [month, day, year] = parts;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

// Format date for display
function formatDateDisplay(dateStr) {
  const date = parseAbsentDate(dateStr);
  if (!date) return dateStr;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} (${days[date.getDay()]})`;
}

// Stats Card Component
function StatCard({ icon, label, value, subValue, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    danger: 'bg-red-50 text-red-600',
    warning: 'bg-amber-50 text-amber-600',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">
            {value}
            {subValue && <span className="text-sm font-normal text-slate-400 ml-1">{subValue}</span>}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Calendar Day Component
function CalendarDay({ day, isAbsent, isToday, isWeekend }) {
  if (!day) {
    return <div className="aspect-square"></div>;
  }

  let bgClass = 'bg-green-50 text-green-700';
  if (isAbsent) {
    bgClass = 'bg-red-100 text-red-700 font-semibold';
  } else if (isWeekend) {
    bgClass = 'bg-slate-50 text-slate-400';
  }

  return (
    <div
      className={`aspect-square flex items-center justify-center rounded-lg text-sm ${bgClass} ${
        isToday ? 'ring-2 ring-primary-500 ring-offset-1' : ''
      }`}
    >
      {day}
    </div>
  );
}

// Calendar Component
function AttendanceCalendar({ month, year, absentDates }) {
  const daysInMonth = getDaysInMonth(parseInt(month), parseInt(year));
  const firstDayOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1).getDay();

  // Create array of days
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Check if a day is absent
  const isAbsentDay = (day) => {
    return absentDates.some((dateStr) => {
      const date = parseAbsentDate(dateStr);
      if (!date) return false;
      return (
        date.getDate() === day &&
        date.getMonth() === parseInt(month) - 1 &&
        date.getFullYear() === parseInt(year)
      );
    });
  };

  // Check if a day is today
  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      parseInt(month) - 1 === today.getMonth() &&
      parseInt(year) === today.getFullYear()
    );
  };

  // Check if a day is weekend (Sunday = 0)
  const isWeekend = (day) => {
    const date = new Date(parseInt(year), parseInt(month) - 1, day);
    return date.getDay() === 0; // Only Sunday is holiday in most schools
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-900 mb-4">
        {MONTHS.find((m) => m.value === month)?.label} {year}
      </h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            isAbsent={day ? isAbsentDay(day) : false}
            isToday={day ? isToday(day) : false}
            isWeekend={day ? isWeekend(day) : false}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-50 border border-green-200"></div>
          <span className="text-slate-600">Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
          <span className="text-slate-600">Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-slate-50 border border-slate-200"></div>
          <span className="text-slate-600">Holiday</span>
        </div>
      </div>
    </Card>
  );
}

// Absent Day Card Component
function AbsentDayCard({ dateStr, studentName, classSec }) {
  return (
    <Card className="p-4 border-l-4 border-l-red-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900">{formatDateDisplay(dateStr)}</p>
            <p className="text-sm text-slate-500">{studentName} - {classSec}</p>
          </div>
        </div>
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Absent</span>
      </div>
    </Card>
  );
}

function Attendance() {
  const { students, selectedStudent } = useAuth();
  const [activeStudent, setActiveStudent] = useState(selectedStudent);
  const [loading, setLoading] = useState(true);
  const [absentList, setAbsentList] = useState([]);

  // Filter states - default to current month/year
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  // Get student info
  const getStudentInfo = (student) => {
    return {
      adno: student?.ADNO || student?.adno || student?.ADMISSION_ID,
      name: student?.NAME || student?.SNAME || student?.student_name || student?.name || 'Student',
      classSec: student?.CLASSSEC || student?.classsec || student?.CLASS || '',
    };
  };

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!activeStudent) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { adno } = getStudentInfo(activeStudent);

      if (!adno) {
        setLoading(false);
        return;
      }

      try {
        const result = await getAttendance(adno, selectedMonth, selectedYear);

        if (result.success) {
          const data = result.data?.data || result.data || [];
          setAbsentList(Array.isArray(data) ? data : []);
        } else {
          setAbsentList([]);
        }
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setAbsentList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [activeStudent, selectedMonth, selectedYear]);

  // Update active student when selectedStudent changes
  useEffect(() => {
    if (selectedStudent) {
      setActiveStudent(selectedStudent);
    }
  }, [selectedStudent]);

  // Calculate statistics
  const calculateStats = () => {
    const daysInMonth = getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear));

    // Filter absent dates for selected month/year
    const monthAbsences = absentList.filter((item) => {
      const date = parseAbsentDate(item.absent);
      if (!date) return false;
      return (
        date.getMonth() === parseInt(selectedMonth) - 1 &&
        date.getFullYear() === parseInt(selectedYear)
      );
    });

    const absentDays = monthAbsences.length;

    // Estimate working days (exclude Sundays)
    let workingDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, day);
      if (date.getDay() !== 0) {
        // Not Sunday
        workingDays++;
      }
    }

    const presentDays = Math.max(0, workingDays - absentDays);
    const percentage = workingDays > 0 ? ((presentDays / workingDays) * 100).toFixed(1) : 0;

    return { workingDays, presentDays, absentDays, percentage };
  };

  const stats = calculateStats();
  const { name: studentName, classSec } = activeStudent ? getStudentInfo(activeStudent) : { name: 'Student', classSec: '' };

  // Get absent dates array for calendar
  const absentDates = absentList.map((item) => item.absent);

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
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full rounded-lg border-slate-300 bg-slate-50 focus:border-primary-500 focus:ring-primary-500 p-2.5"
                >
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-lg border-slate-300 bg-slate-50 focus:border-primary-500 focus:ring-primary-500 p-2.5"
                >
                  {YEARS.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{studentName}</span>
                {classSec && <span className="text-slate-400">({classSec})</span>}
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              label="Working Days"
              value={stats.workingDays}
              color="primary"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              label="Present Days"
              value={stats.presentDays}
              color="success"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              label="Absent Days"
              value={stats.absentDays}
              color="danger"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              label="Attendance"
              value={`${stats.percentage}%`}
              color={parseFloat(stats.percentage) >= 75 ? 'success' : 'warning'}
            />
          </div> */}

          {/* Calendar & Absent List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar View */}
            <AttendanceCalendar month={selectedMonth} year={selectedYear} absentDates={absentDates} />

            {/* Absent Days List */}
            <Card className="p-4">
              <h3 className="font-semibold text-slate-900 mb-4">Absent Days</h3>

              {absentList.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {absentList.map((item, index) => (
                    <AbsentDayCard
                      key={index}
                      dateStr={item.absent}
                      studentName={item.NAME || studentName}
                      classSec={item.CLASSSEC || classSec}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">Perfect Attendance!</h4>
                  <p className="text-sm text-slate-500 mt-1">No absences recorded for this month</p>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default Attendance;
