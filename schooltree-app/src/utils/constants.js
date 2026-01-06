/**
 * Application constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api';
export const DB_NAME = import.meta.env.VITE_DB_NAME || 'appdemoo';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// OTP Configuration
export const OTP_LENGTH = 4;
export const OTP_RESEND_TIMER = 30; // seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HOMEWORK: '/homework',
  CIRCULARS: '/circulars',
  FEES: '/fees',
  FEES_SUCCESS: '/fees/success',
  EXAMS: '/exams',
  MARKS: '/marks',
  GALLERY: '/gallery',
  ALBUM: '/gallery/:albumId',
};

// Sidebar Navigation Items
export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'dashboard' },
  { label: 'Homework', path: ROUTES.HOMEWORK, icon: 'homework' },
  { label: 'Circulars', path: ROUTES.CIRCULARS, icon: 'circulars' },
  { label: 'Academics', path: ROUTES.MARKS, icon: 'academics' },
  { label: 'Fee Payment', path: ROUTES.FEES, icon: 'fees' },
  { label: 'Exam Schedule', path: ROUTES.EXAMS, icon: 'exams' },
  { label: 'Gallery', path: ROUTES.GALLERY, icon: 'gallery' },
];

// Homework Status
export const HOMEWORK_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  OVERDUE: 'overdue',
  DUE_TOMORROW: 'due_tomorrow',
};

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  NET_BANKING: 'net_banking',
  UPI: 'upi',
};

// Grade Colors
export const GRADE_COLORS = {
  'A+': 'text-green-600 bg-green-50',
  'A': 'text-green-600 bg-green-50',
  'B+': 'text-blue-600 bg-blue-50',
  'B': 'text-blue-600 bg-blue-50',
  'C+': 'text-yellow-600 bg-yellow-50',
  'C': 'text-yellow-600 bg-yellow-50',
  'D': 'text-orange-600 bg-orange-50',
  'F': 'text-red-600 bg-red-50',
};

// Subject Icons (emoji mapping)
export const SUBJECT_ICONS = {
  math: '📐',
  mathematics: '📐',
  science: '🔬',
  english: '📖',
  hindi: '📝',
  tamil: '📝',
  social: '🌍',
  'social studies': '🌍',
  'social science': '🌍',
  art: '🎨',
  music: '🎵',
  physical: '⚽',
  'physical education': '⚽',
  computer: '💻',
  'computer science': '💻',
  evs: '🌿',
  commerce: '📊',
  chemistry: '⚗️',
  physics: '⚛️',
  biology: '🧬',
  default: '📚',
};

// Get subject icon
export const getSubjectIcon = (subject) => {
  if (!subject) return SUBJECT_ICONS.default;
  const key = subject.toLowerCase();
  return SUBJECT_ICONS[key] || SUBJECT_ICONS.default;
};

export default {
  API_BASE_URL,
  DB_NAME,
  APP_VERSION,
  OTP_LENGTH,
  OTP_RESEND_TIMER,
  DEFAULT_PAGE_SIZE,
  ROUTES,
  NAV_ITEMS,
  HOMEWORK_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  GRADE_COLORS,
  SUBJECT_ICONS,
  getSubjectIcon,
};
