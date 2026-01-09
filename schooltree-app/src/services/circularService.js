import api from './api';

// Get all circulars/messages by mobile number
export const getCirculars = async (mobile_number, page_size = 20, current_size = 0) => {
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

// Get base64 image
export const getBase64Image = async (url) => {
  try {
    const response = await api.post('/circular/getBase64', { url });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getCirculars,
  getBase64Image,
};
