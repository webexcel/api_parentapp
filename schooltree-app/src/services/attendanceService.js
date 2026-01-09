import api from './api';

/**
 * Get attendance (absent list) for a student
 * POST /attendance/getAttendance
 *
 * @param {string} adno - Student admission number
 * @param {string} month - Month (01-12) - optional
 * @param {string} year - Year (e.g., 2026) - optional
 */
export const getAttendance = async (adno, month = null, year = null) => {
  try {
    const payload = { ADNO: adno };

    // Add month and year if provided
    if (month) payload.month = month;
    if (year) payload.year = year;

    const response = await api.post('/attendance/getAttendance', payload);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return { success: false, error: error.message };
  }
};
