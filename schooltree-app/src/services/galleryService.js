import api from './api';

// Get gallery categories/albums
// classIds should be an array of CLASS_IDs from students
export const getGalleryCategories = async (classIds = ['0']) => {
  try {
    // Ensure classIds is always an array
    const classIdArray = Array.isArray(classIds) ? classIds : [classIds];

    const response = await api.post('/gallery/getParentCategory', {
      class_id: classIdArray
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getGalleryCategories,
};
