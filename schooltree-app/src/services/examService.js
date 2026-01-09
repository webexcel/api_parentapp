import api from './api';

// Get exam schedule for student by class ID
export const getExamSchedule = async (classId) => {
  try {
    const response = await api.post('/examschedule/getParentExamSchedule', {
      CLASS_ID: classId
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getExamSchedule,
};
