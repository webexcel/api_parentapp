/**
 * localStorage utility functions for authentication data
 */

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  INSTALL_ID: 'install_id',
  USER: 'user',
  STUDENTS: 'students',
  SELECTED_STUDENT: 'selected_student',
};

// Token
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Install ID
export const setInstallId = (id) => {
  localStorage.setItem(STORAGE_KEYS.INSTALL_ID, id);
};

export const getInstallId = () => {
  return localStorage.getItem(STORAGE_KEYS.INSTALL_ID);
};

export const removeInstallId = () => {
  localStorage.removeItem(STORAGE_KEYS.INSTALL_ID);
};

// User
export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Students
export const setStudents = (students) => {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const getStudents = () => {
  const students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return students ? JSON.parse(students) : [];
};

export const removeStudents = () => {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
};

// Selected Student
export const setSelectedStudent = (student) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_STUDENT, JSON.stringify(student));
};

export const getSelectedStudent = () => {
  const student = localStorage.getItem(STORAGE_KEYS.SELECTED_STUDENT);
  return student ? JSON.parse(student) : null;
};

export const removeSelectedStudent = () => {
  localStorage.removeItem(STORAGE_KEYS.SELECTED_STUDENT);
};

// Clear all auth data
export const clearAuth = () => {
  removeToken();
  removeInstallId();
  removeUser();
  removeStudents();
  removeSelectedStudent();
};

export default {
  setToken,
  getToken,
  removeToken,
  setInstallId,
  getInstallId,
  removeInstallId,
  setUser,
  getUser,
  removeUser,
  setStudents,
  getStudents,
  removeStudents,
  setSelectedStudent,
  getSelectedStudent,
  removeSelectedStudent,
  clearAuth,
};
