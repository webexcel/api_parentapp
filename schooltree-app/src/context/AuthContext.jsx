import { createContext, useState, useEffect, useCallback } from 'react';
import {
  getToken,
  setToken,
  getInstallId,
  setInstallId,
  getUser,
  setUser,
  getStudents,
  setStudents,
  getSelectedStudent,
  setSelectedStudent as saveSelectedStudent,
  clearAuth,
} from '../utils/storage';
import { sendOtp, verifyOtp, getStudentDetails } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    token: null,
    installId: null,
    students: [],
    selectedStudent: null,
    isAuthenticated: false,
    loading: true,
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated from localStorage
  const checkAuth = useCallback(() => {
    const token = getToken();
    const user = getUser();
    const installId = getInstallId();
    const students = getStudents();
    const selectedStudent = getSelectedStudent();

    if (token && user) {
      setState({
        user,
        token,
        installId,
        students,
        selectedStudent,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // Send OTP to mobile number
  const handleSendOtp = useCallback(async (mobile_no) => {
    const result = await sendOtp(mobile_no);

    // API returns { status, message, data: { id, sname } }
    const installId = result.data?.data?.id || result.data?.id;
    if (result.success && installId) {
      // Store install ID temporarily
      setInstallId(installId);
      setState((prev) => ({ ...prev, installId }));
    }

    return result;
  }, []);

  // Verify OTP and login
  const handleVerifyOtp = useCallback(async (otp) => {
    const installId = getInstallId();

    if (!installId) {
      return { success: false, error: 'Please request OTP first' };
    }

    const result = await verifyOtp(installId, otp);

    // API returns { status, message, data: { token, ... } } or { status, token, ... }
    const responseData = result.data?.data || result.data;
    const token = responseData?.token;

    if (result.success && (token || responseData?.status === true)) {
      // Store token and user
      if (token) {
        setToken(token);
      }
      setUser(responseData?.user || { mobile_no: responseData?.mobile_no });

      // Fetch student details
      const studentResult = await getStudentDetails(installId);

      let students = [];
      let selectedStudent = null;

      if (studentResult.success && studentResult.data) {
        // Handle different response structures
        const studentData = studentResult.data?.data || studentResult.data;
        students = studentData?.students || studentData || [];
        if (Array.isArray(students) && students.length > 0) {
          selectedStudent = students[0];
          setStudents(students);
          saveSelectedStudent(selectedStudent);
        }
      }

      setState({
        user: responseData?.user || { mobile_no: responseData?.mobile_no },
        token: token || 'authenticated',
        installId,
        students,
        selectedStudent,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    }

    return result;
  }, []);

  // Logout
  const handleLogout = useCallback(() => {
    clearAuth();
    setState({
      user: null,
      token: null,
      installId: null,
      students: [],
      selectedStudent: null,
      isAuthenticated: false,
      loading: false,
    });
  }, []);

  // Switch selected student
  const handleSwitchStudent = useCallback((student) => {
    saveSelectedStudent(student);
    setState((prev) => ({ ...prev, selectedStudent: student }));
  }, []);

  const value = {
    ...state,
    sendOtp: handleSendOtp,
    verifyOtp: handleVerifyOtp,
    logout: handleLogout,
    switchStudent: handleSwitchStudent,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
