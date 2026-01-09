import api from './api';

/**
 * Get available term types
 * GET /reportCard/getTermType
 */
export const getTermTypes = async () => {
  try {
    const response = await api.get('/reportCard/getTermType');
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching term types:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get exam names for a class
 * POST /reportCard/selectExamName
 */
export const getExamNames = async (classId) => {
  try {
    const response = await api.post('/reportCard/selectExamName', {
      class_Id: classId
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching exam names:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get term report card
 * POST /reportCard/getTermReportcardAdno
 */
export const getTermReportCard = async (adno, classId, exgrpId, yearId, termType) => {
  try {
    const response = await api.post('/reportCard/getTermReportcardAdno', {
      ADNO: adno,
      CLASSID: classId,
      EXGRPID: exgrpId,
      YEARID: yearId,
      TERMTYPE: termType
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching term report card:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get marks by admission number
 * POST /reportcard/getMarksOnAdno
 */
export const getMarks = async (adno) => {
  try {
    const response = await api.post('/reportcard/getMarksOnAdno', {
      ADNO: adno
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching marks:', error);
    return { success: false, error: error.message };
  }
};
