import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common';
import { ROUTES, OTP_LENGTH, OTP_RESEND_TIMER } from '../../utils/constants';
import { maskPhoneNumber } from '../../utils/formatters';
import AuthLayout from '../../layouts/AuthLayout';

function Login() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();

  // Form state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  // UI state
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputRef = useRef(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus OTP input when OTP is sent
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent]);

  // Handle phone input
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    setError('');
  };

  // Handle OTP input
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(value);
    setError('');
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSendingOtp(true);
    setError('');

    const result = await sendOtp(phone);

    setSendingOtp(false);

    if (result.success) {
      setOtpSent(true);
      setResendTimer(OTP_RESEND_TIMER);
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setOtp('');
    await handleSendOtp();
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter a ${OTP_LENGTH}-digit OTP`);
      return;
    }

    setVerifying(true);
    setError('');

    const result = await verifyOtp(otp);

    setVerifying(false);

    if (result.success) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      setError(result.error || 'Invalid OTP');
    }
  };

  // Change phone number (go back to step 1)
  const handleChangePhone = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
    setResendTimer(0);
  };

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-10 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-600 mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">
            Please verify your identity to access the school dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerifyOtp} className="px-8 pb-10 space-y-6">
          {/* Mobile Number Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="mobile">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="mobile"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                disabled={otpSent}
                placeholder="Enter 10-digit mobile number"
                className="block w-full pl-11 pr-24 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || phone.length !== 10}
                    className="px-3 py-1.5 bg-white text-primary-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary-600 disabled:hover:border-gray-200"
                  >
                    {sendingOtp ? 'Sending...' : 'Get OTP'}
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-lg flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sent
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-gray-100"></div>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="otp">
                Enter Verification Code
              </label>
              {otpSent && (
                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatTimer(resendTimer)}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <input
                ref={otpInputRef}
                id="otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={handleOtpChange}
                disabled={!otpSent}
                placeholder="------"
                maxLength={OTP_LENGTH}
                className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-all font-mono tracking-[0.5em] text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            {otpSent && (
              <div className="flex justify-between items-center px-1">
                <p className="text-xs text-gray-500">
                  Code sent to mobile ending in {maskPhoneNumber(phone)}
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="text-xs font-bold text-primary-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  Resend Code
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              loading={verifying}
              disabled={!otpSent || otp.length !== OTP_LENGTH}
              className="h-12 text-base shadow-lg shadow-primary-500/25"
            >
              Secure Login
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>
          </div>

          {/* Change Number Link */}
          {otpSent && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleChangePhone}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Change mobile number
              </button>
            </div>
          )}
        </form>

        {/* Footer Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-300 via-primary-600 to-blue-600"></div>
      </div>

      {/* Terms text below the card */}
      <p className="text-center text-sm text-gray-500 mt-6">
        By logging in, you agree to Alpha Portal's{' '}
        <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
      </p>
    </AuthLayout>
  );
}

export default Login;
