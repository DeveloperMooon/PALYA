import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, RefreshCw, ShieldCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VerifyOtpScreenProps {
  mobileNumber: string;
  maskedPhone: string;
  initialDebugOtp?: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({
  maskedPhone,
  initialDebugOtp,
  onVerificationSuccess,
  onBack
}) => {
  const { verifyRegistrationOtp, resendRegistrationOtp } = useAuth();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentDebugOtp, setCurrentDebugOtp] = useState<string | undefined>(initialDebugOtp);

  // References to input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
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
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    setErrorMessage(null);

    // Handle single digit entry
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return; // Only numeric

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Advance focus forward if typed
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 filled, trigger verification automatically
    if (char && index === 5 && newDigits.every((d) => d !== '')) {
      handleVerifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Move back and clear
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
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

      const nextFocusIdx = Math.min(digitsOnly.length, 5);
      inputRefs.current[nextFocusIdx]?.focus();

      if (digitsOnly.length === 6) {
        handleVerifyCode(digitsOnly);
      }
    }
  };

  const handleVerifyCode = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      await verifyRegistrationOtp(fullCode);
      onVerificationSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setErrorMessage(null);

    try {
      const res = await resendRegistrationOtp();
      setCurrentDebugOtp(res.otpCode);
      setCountdown(30);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otpDigits.every((d) => d.length === 1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between px-4 sm:px-6 py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Navigation & Branding */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-[#1A2B4C] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60"
            id="btn-back-from-otp"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
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
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-[#16A34A]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A2B4C] tracking-tight">
              Verify Your Mobile Number
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 leading-relaxed">
              We&apos;ve sent a 6-digit verification code to
              <br />
              <span className="font-bold text-[#1A2B4C]">{maskedPhone}</span>
            </p>
          </div>

          {/* Demo SMS Toast Pill for Developer / Tester Verification */}
          {currentDebugOtp && (
            <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Demo SMS Code: <strong className="font-mono tracking-widest text-sm">{currentDebugOtp}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const digits = currentDebugOtp.split('');
                  setOtpDigits(digits);
                  handleVerifyCode(currentDebugOtp);
                }}
                className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
              role="alert"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 6 Digit Inputs */}
          <div className="flex justify-between gap-1.5 sm:gap-2.5 mb-6" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                id={`otp-digit-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying}
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

          {/* Resend OTP & Countdown */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                id="btn-resend-otp"
                className="text-xs font-bold text-[#16A34A] hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <span>Resend OTP</span>
                )}
              </button>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                Resend OTP in <span className="font-bold text-[#1A2B4C]">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            id="btn-verify-otp-submit"
            onClick={() => handleVerifyCode()}
            disabled={!isComplete || isVerifying}
            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isComplete && !isVerifying
                ? 'bg-[#16A34A] hover:bg-[#15803D] text-white active:scale-[0.99] shadow-md shadow-emerald-700/10'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify & Continue</span>
            )}
          </button>
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
