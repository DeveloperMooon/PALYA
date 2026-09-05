import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { authService } from '../../services/authService';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
  onNavigateToOverview: () => void;
}

type Step = 'phone' | 'otp' | 'new_password' | 'success';

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBackToLogin,
  onNavigateToOverview
}) => {
  const [step, setStep] = useState<Step>('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // OTP step
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password reset step
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const cleanMobile = mobileNumber.replace(/\D/g, '');

  // OTP Countdown
  useEffect(() => {
    if (step !== 'otp') return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, countdown]);

  // Focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  // 1. Send OTP for Mobile
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneTouched(true);

    if (cleanMobile.length !== 10 || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authService.initiateForgotPassword(cleanMobile);
      setMaskedPhone(res.maskedPhone);
      setDebugOtp(res.otpCode);
      setCountdown(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setStep('otp');
    } catch (err: any) {
      setErrorMessage(err.message || 'No account found with this mobile number.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authService.initiateForgotPassword(cleanMobile);
      setDebugOtp(res.otpCode);
      setCountdown(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Digit handlers
  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage(null);
    const char = val.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (char && index === 5 && newDigits.every((d) => d !== '')) {
      handleVerifyOtp(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    const digitsOnly = pasteData.replace(/\D/g, '').slice(0, 6);

    if (digitsOnly.length > 0) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < digitsOnly.length; i++) {
        newDigits[i] = digitsOnly[i];
      }
      setOtpDigits(newDigits);
      inputRefs.current[Math.min(digitsOnly.length, 5)]?.focus();
      if (digitsOnly.length === 6) {
        handleVerifyOtp(digitsOnly);
      }
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (codeOverride?: string) => {
    const code = codeOverride || otpDigits.join('');
    if (code.length !== 6 || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await authService.verifyForgotPasswordOtp(code);
      setStep('new_password');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Submit New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (newPassword.length < 6 || newPassword !== confirmPassword || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await authService.completePasswordReset(newPassword);
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between px-4 sm:px-6 py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Navigation & Branding */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={step === 'phone' ? onBackToLogin : () => setStep('phone')}
            className="text-xs font-semibold text-slate-500 hover:text-[#1A2B4C] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60"
            id="btn-back-from-forgot-password"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'phone' ? 'Back to Sign In' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBalydRg2eY901DQK2BcFn0HHpPgj8oC_5_PwT4aicpLUc9fWMGzxQC1hlsTalrf3WDIr_KTdjwRrwHhq4bWUwc9TkkAR4BXck3D5lBKgU_aDdkHiLcZ3pBdWQ9TwFBGJ3u0VUBpynag1XIcOROJjPXrzhdffA3XPuDihVLnBlh9NHNTMWRKpq2Cf2zJ9jUcccRHbF6_vj1zEf8f9bV-vtEdPINyErirs4wpgY6II3UIKTjQVt2fHRiRg"
                alt="PALYA Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-black text-[#1A2B4C] tracking-wide font-display">
              PALYA
            </span>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
        >
          {/* STEP 1: Enter Mobile */}
          {step === 'phone' && (
            <div>
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3 text-[#16A34A]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-[#1A2B4C] tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                  Enter your registered mobile number to receive a verification code
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="forgot-mobile"
                    className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex items-center rounded-2xl border transition-all overflow-hidden bg-white ${
                      phoneTouched && cleanMobile.length !== 10
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-slate-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20'
                    }`}
                  >
                    <div className="px-3.5 py-3 bg-slate-50 text-xs font-bold text-[#26364A] border-r border-slate-200 select-none shrink-0 flex items-center gap-1">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      id="forgot-mobile"
                      name="mobileNumber"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={mobileNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobileNumber(digits);
                        setErrorMessage(null);
                      }}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-3.5 py-3 text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none bg-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  {phoneTouched && cleanMobile.length !== 10 && (
                    <p className="text-xs font-medium text-red-600 mt-1.5">
                      Please enter a valid 10-digit mobile number.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={cleanMobile.length !== 10 || isLoading}
                  className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    cleanMobile.length === 10 && !isLoading
                      ? 'bg-[#16A34A] hover:bg-[#15803D] text-white active:scale-[0.99] shadow-md shadow-emerald-700/10'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 'otp' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-[#16A34A]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#1A2B4C] tracking-tight">
                  Enter Verification Code
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                  We&apos;ve sent a 6-digit code to
                  <br />
                  <span className="font-bold text-[#1A2B4C]">{maskedPhone}</span>
                </p>
              </div>

              {debugOtp && (
                <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      Demo Code: <strong className="font-mono tracking-widest text-sm">{debugOtp}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = debugOtp.split('');
                      setOtpDigits(digits);
                      handleVerifyOtp(debugOtp);
                    }}
                    className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-between gap-1.5 sm:gap-2.5 mb-6" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl border transition-all focus:outline-none bg-slate-50/50 ${
                      errorMessage
                        ? 'border-red-400 text-red-700 ring-2 ring-red-100 bg-red-50/30'
                        : digit
                        ? 'border-[#16A34A] text-[#1A2B4C] ring-2 ring-[#16A34A]/15 bg-white shadow-xs'
                        : 'border-slate-300 text-[#1A2B4C] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:bg-white'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center mb-6">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-xs font-bold text-[#16A34A] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">
                    Resend OTP in <span className="font-bold text-[#1A2B4C]">{countdown}s</span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={!otpDigits.every((d) => d !== '') || isLoading}
                className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  otpDigits.every((d) => d !== '') && !isLoading
                    ? 'bg-[#16A34A] hover:bg-[#15803D] text-white active:scale-[0.99] shadow-md shadow-emerald-700/10'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify Code</span>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: Create New Password */}
          {step === 'new_password' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-[#1A2B4C] tracking-tight">
                  Create New Password
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                  Your new password must be at least 6 characters long
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="reset-new-password"
                    className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
                  >
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative flex items-center rounded-2xl border transition-all bg-white ${
                      passwordTouched && newPassword.length < 6
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-slate-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20'
                    }`}
                  >
                    <input
                      id="reset-new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-3 text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none bg-transparent pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordTouched && newPassword.length < 6 && (
                    <p className="text-xs font-medium text-red-600 mt-1.5">
                      Password must contain at least 6 characters.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reset-confirm-password"
                    className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative flex items-center rounded-2xl border transition-all bg-white ${
                      confirmTouched && confirmPassword !== newPassword
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-slate-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20'
                    }`}
                  >
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setConfirmTouched(true)}
                      placeholder="Re-enter your new password"
                      className="w-full px-3.5 py-3 text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none bg-transparent pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmTouched && confirmPassword !== newPassword && (
                    <p className="text-xs font-medium text-red-600 mt-1.5">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    newPassword.length < 6 || newPassword !== confirmPassword || isLoading
                  }
                  className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                    newPassword.length >= 6 && newPassword === confirmPassword && !isLoading
                      ? 'bg-[#16A34A] hover:bg-[#15803D] text-white active:scale-[0.99] shadow-md shadow-emerald-700/10'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success confirmation */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-black text-[#1A2B4C] mb-2">
                Password Updated!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold shadow-md shadow-emerald-700/10 active:scale-[0.99] transition-all cursor-pointer"
              >
                Sign In with New Password
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer Trust Marker */}
      <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>PALYA Official National Livestock Health Stewardship Network</span>
      </div>
    </div>
  );
};
