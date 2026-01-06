import api from './api';
import { APP_VERSION } from '../utils/constants';

/**
 * Send OTP to mobile number
 * @param {string} mobile_no - Mobile number
 * @returns {Promise<{success: boolean, data?: {id: string}, error?: string}>}
 */
export const sendOtp = async (mobile_no) => {
  try {
    const response = await api.post('/auth/mobileInstallsNew', {
      mobile_no,
      platform_type: 'Android',
      manufacturer_name: 'Google Inc.',
      manufacturer_model: 'Windows NT 10.0',
      os_version: 'Windows NT 10.0; Win64; x64',
      app_version_code: '100',
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to send OTP',
    };
  }
};

/**
 * Verify OTP
 * @param {string} id - Install ID from sendOtp response
 * @param {string} otp - OTP entered by user
 * @returns {Promise<{success: boolean, data?: {token: string, user: object}, error?: string}>}
 */
export const verifyOtp = async (id, otp) => {
  try {
    const response = await api.post('/auth/mobileInstallerVerify', {
      id,
      otp,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Invalid OTP',
    };
  }
};

/**
 * Get student details for the logged-in parent
 * @param {string} id - Install ID
 * @returns {Promise<{success: boolean, data?: {students: array}, error?: string}>}
 */
export const getStudentDetails = async (id) => {
  try {
    const response = await api.post('/auth/getMobStudentDetail', { id });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get student details',
    };
  }
};

/**
 * Get student photo
 * @param {string} adno - Admission number
 * @returns {Promise<{success: boolean, data?: {photo: string}, error?: string}>}
 */
export const getStudentPhoto = async (adno) => {
  try {
    const response = await api.post('/auth/getMobStudentPhoto', { adno });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get student photo',
    };
  }
};

export default {
  sendOtp,
  verifyOtp,
  getStudentDetails,
  getStudentPhoto,
};
