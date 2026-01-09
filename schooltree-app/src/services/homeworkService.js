import api from './api';

// Get homework for student by class and admission number with pagination
export const getHomework = async (classid, adno, limit = 10, start = 0) => {
  try {
    const response = await api.post('/homework/getSaveHomeworkByClass', {
      classid,
      adno,
      limit,
      start
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getHomework,
};
