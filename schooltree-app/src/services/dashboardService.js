import api from './api';

// Get latest messages/notifications
export const getLatestMessage = async (mobile_number) => {
  try {
    const response = await api.post('/dashboard/getLatestMessage', { mobile_number });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get flash message (announcements)
export const getFlashMessage = async () => {
  try {
    const response = await api.get('/dashboard/getFlashMessage');
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check fees balance for student(s)
export const checkFeesBalance = async (adno) => {
  try {
    // adno can be a single string or array of adnos
    const response = await api.post('/dashboard/checkFeesBalance', { adno });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get fees flash notification
export const getFeesFlash = async (adno) => {
  try {
    const response = await api.post('/dashboard/feesFlash', { adno });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get batch/circular count
export const getBatchCount = async (mobile_number) => {
  try {
    const response = await api.post('/dashboard/batchCount', { mobile_number });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get student ID card
export const getIdCard = async (adno) => {
  try {
    const response = await api.post('/dashboard/getIdCard', { adno });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get attendance data
export const getAttendance = async (adno, month, year) => {
  try {
    const response = await api.post('/attendance/getAttendance', {
      adno,
      month: month || new Date().toLocaleString('en-US', { month: '2-digit' }),
      year: year || new Date().getFullYear().toString()
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get homework for student
export const getHomework = async (classid, adno) => {
  try {
    const response = await api.post('/homework/getSaveHomeworkByClass', { classid, adno });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all circulars/messages
export const getCirculars = async (mobile_number, page_size = 10, current_size = 0) => {
  try {
    const response = await api.post('/circular/getAllMessagesByMobileNumber', {
      mobile_number,
      page_size,
      current_size
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Fetch all dashboard data in parallel
export const fetchDashboardData = async (student, mobileNumber) => {
  const adno = student?.ADNO || student?.ADMISSION_ID || student?.adno;
  const classId = student?.CLASS_ID || student?.classid;

  const results = await Promise.allSettled([
    getAttendance(adno),
    checkFeesBalance(adno),
    getHomework(classId, adno),
    getLatestMessage(mobileNumber),
    getBatchCount(mobileNumber),
  ]);

  return {
    attendance: results[0].status === 'fulfilled' ? results[0].value : null,
    feesBalance: results[1].status === 'fulfilled' ? results[1].value : null,
    homework: results[2].status === 'fulfilled' ? results[2].value : null,
    latestMessages: results[3].status === 'fulfilled' ? results[3].value : null,
    batchCount: results[4].status === 'fulfilled' ? results[4].value : null,
  };
};

export default {
  getLatestMessage,
  getFlashMessage,
  checkFeesBalance,
  getFeesFlash,
  getBatchCount,
  getIdCard,
  getAttendance,
  getHomework,
  getCirculars,
  fetchDashboardData,
};
