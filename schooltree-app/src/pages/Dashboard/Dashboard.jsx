import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, Loader } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import { fetchDashboardData, getLatestMessageWebsite } from '../../services/dashboardService';

// Stat Card Component
function StatCard({ title, value, subtitle, icon, iconBg, loading }) {
  return (
    <Card className="p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <span className={`p-1.5 rounded-lg ${iconBg}`}>
          {icon}
        </span>
      </div>
      {loading ? (
        <div className="h-8 w-20 bg-slate-200 animate-pulse rounded"></div>
      ) : (
        <p className="text-slate-900 text-2xl font-bold">{value}</p>
      )}
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      )}
    </Card>
  );
}

// News Card Component - Clickable card that opens link
function NewsCard({ title, link, isLast }) {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 ${!isLast ? 'border-b border-slate-100' : ''} hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-3`}
    >
      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-primary-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 line-clamp-2">{title}</p>
      </div>
      {link && (
        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <span className="text-white mb-1 block">{icon}</span>
        <p className="text-white text-sm font-bold leading-tight">{label}</p>
      </div>
    </Link>
  );
}

function Dashboard() {
  const { user, selectedStudent, students } = useAuth();
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [latestNews, setLatestNews] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    attendance: null,
    feesBalance: null,
    homework: null,
    latestMessages: null,
    batchCount: null,
  });

  // Fetch dashboard data when component mounts or student changes
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!selectedStudent) return;

      setLoading(true);
      try {
        const mobileNumber = user?.mobile_no || user?.contact;
        const data = await fetchDashboardData(selectedStudent, mobileNumber);
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedStudent, user]);

  // Fetch latest news from getLatestMessageWebsite
  useEffect(() => {
    const loadLatestNews = async () => {
      setNewsLoading(true);
      try {
        const result = await getLatestMessageWebsite();
        if (result.success && result.data) {
          const data = result.data?.data || result.data || [];
          setLatestNews(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching latest news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    loadLatestNews();
  }, []);

  // Get student name and class from selectedStudent
  const studentName = selectedStudent?.NAME || selectedStudent?.SNAME || selectedStudent?.name || 'Student';
  const studentClass = selectedStudent?.CLASSSEC || selectedStudent?.class || '';

  // Helper to get batch count data by label
  const getBatchDataByLabel = (label) => {
    const batchData = dashboardData.batchCount?.data?.data || dashboardData.batchCount?.data;
    if (Array.isArray(batchData)) {
      return batchData.find(item => item.label === label);
    }
    return null;
  };

  // Calculate attendance percentage from batchCount
  const getAttendanceValue = () => {
    const attendanceItem = getBatchDataByLabel('attendance');
    if (attendanceItem) {
      const count = parseFloat(attendanceItem.count);
      if (!isNaN(count)) {
        return `${count}%`;
      }
      if (attendanceItem.status === 'No Data') {
        return 'No Data';
      }
    }
    // Fallback to old API response
    const attendanceData = dashboardData.attendance?.data?.data || dashboardData.attendance?.data;
    if (attendanceData?.percentage) return `${attendanceData.percentage}%`;
    return '--';
  };

  // Get pending homework count from batchCount
  const getHomeworkValue = () => {
    const homeworkItem = getBatchDataByLabel('homework');
    if (homeworkItem) {
      const count = parseInt(homeworkItem.count);
      if (!isNaN(count)) {
        return count > 0 ? `${count} Pending` : 'All Done';
      }
    }
    // Fallback to old API response
    const homeworkData = dashboardData.homework?.data?.data || dashboardData.homework?.data;
    if (Array.isArray(homeworkData)) {
      return homeworkData.length > 0 ? `${homeworkData.length} Pending` : 'All Done';
    }
    return '--';
  };

  // Get fees balance from batchCount
  const getFeesValue = () => {
    const paymentItem = getBatchDataByLabel('payment_due');
    if (paymentItem) {
      const count = parseFloat(paymentItem.count);
      if (!isNaN(count) && count > 0) {
        return `₹${count.toLocaleString()}`;
      }
      if (paymentItem.payment_status === 'No Due') {
        return 'Paid';
      }
    }
    // Fallback to old API response
    const feesData = dashboardData.feesBalance?.data?.data || dashboardData.feesBalance?.data;
    if (feesData?.balance || feesData?.total_balance) {
      const balance = feesData.balance || feesData.total_balance;
      return balance > 0 ? `₹${balance.toLocaleString()}` : 'Paid';
    }
    return '--';
  };

  // Get fees subtitle
  const getFeesSubtitle = () => {
    const paymentItem = getBatchDataByLabel('payment_due');
    if (paymentItem?.payment_status) {
      return paymentItem.payment_status;
    }
    return 'Outstanding balance';
  };

  // Get circular count from batchCount
  const getCircularValue = () => {
    const circularItem = getBatchDataByLabel('circulars');
    if (circularItem) {
      const count = parseInt(circularItem.count);
      if (!isNaN(count)) {
        return count > 0 ? `${count} New` : 'None';
      }
    }
    // Fallback to old API response
    const batchData = dashboardData.batchCount?.data?.data || dashboardData.batchCount?.data;
    if (batchData?.count !== undefined) return `${batchData.count} New`;
    return '--';
  };

  const stats = [
    {
      title: 'Attendance',
      value: getAttendanceValue(),
      subtitle: 'This month',
      icon: (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: 'bg-green-50',
    },
    {
      title: 'Homework',
      value: getHomeworkValue(),
      subtitle: studentName,
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: 'bg-orange-50',
    },
    {
      title: 'Fees Due',
      value: getFeesValue(),
      subtitle: getFeesSubtitle(),
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: 'bg-red-50',
    },
    {
      title: 'New Circulars',
      value: getCircularValue(),
      subtitle: 'Unread messages',
      icon: (
        <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
      iconBg: 'bg-primary-50',
    },
  ];

  const quickActions = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      label: 'Report Card',
      to: ROUTES.MARKS,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      label: 'Pay Fees',
      to: ROUTES.FEES,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Exam Schedule',
      to: ROUTES.EXAMS,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Gallery',
      to: ROUTES.GALLERY,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          Welcome back, Parent
        </h3>
        <p className="text-slate-500 text-sm">
          Here is what's happening with your {students.length > 1 ? 'children' : 'child'} today.
        </p>
      </div>

      {/* Student Info Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
            {studentName.charAt(0)}
          </div>
          <div>
            <h4 className="text-xl font-bold">{studentName}</h4>
            <p className="text-white/80 text-sm">Class: {studentClass}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconBg={stat.iconBg}
            loading={loading}
          />
        ))}
      </div>

      {/* Main Layout Columns */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Latest News */}
        <div className="flex-1 flex flex-col gap-6">
          <h4 className="text-lg font-bold text-slate-900">Latest News</h4>
          <Card className="overflow-hidden">
            {newsLoading ? (
              <div className="p-8 flex justify-center">
                <Loader size="md" />
              </div>
            ) : latestNews.length > 0 ? (
              latestNews.map((news, index) => (
                <NewsCard
                  key={news.nid || index}
                  title={news.Discription || news.description || 'News Update'}
                  link={news.links || news.link || ''}
                  isLast={index === latestNews.length - 1}
                />
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-sm">No news available</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Quick Links & Timetable */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Quick Actions Grid */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-slate-900">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  to={action.to}
                />
              ))}
            </div>
          </div>

          {/* Today's Classes Snippet */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-slate-900">Up Next</h4>
            <Card className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-lg shrink-0">
                  <span className="text-xs font-bold text-slate-500 uppercase">Now</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Mathematics</p>
                  <p className="text-xs text-slate-500">11:00 AM - 12:00 PM</p>
                </div>
              </div>
              <div className="w-0.5 h-4 bg-slate-200 ml-6 my-1"></div>
              <div className="flex gap-4 items-center opacity-60">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-lg shrink-0">
                  <span className="text-xs font-bold text-slate-400">Next</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Science Lab</p>
                  <p className="text-xs text-slate-500">12:15 PM - 01:15 PM</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
