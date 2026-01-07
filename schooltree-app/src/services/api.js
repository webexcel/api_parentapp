import axios from 'axios';
import { API_BASE_URL, DB_NAME } from '../utils/constants';
import { getToken, clearAuth } from '../utils/storage';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Auto-inject dbname for POST requests
    if (config.method === 'post' && config.data) {
      config.data = {
        ...config.data,
        dbname: DB_NAME,
      };
    }

    // Note: dbname is included in the token, no need to add to GET params

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
      return Promise.reject({ message: 'Session expired. Please login again.' });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }

    // Handle other errors
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
