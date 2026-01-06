/**
 * Utility functions for formatting data
 */

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as XXX XXX XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

// Mask phone number (show last 2 digits)
export const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `******${cleaned.slice(-2)}`;
  }
  return phone;
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-IN', { ...defaultOptions, ...options });
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format time only
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '';
  return `${Number(value).toFixed(decimals)}%`;
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(date);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default {
  formatPhoneNumber,
  maskPhoneNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  formatPercentage,
  getRelativeTime,
  truncateText,
  getInitials,
  formatFileSize,
};
