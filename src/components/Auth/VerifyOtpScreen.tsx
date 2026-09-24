import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import { motion } from 'motion/react';

import {
  ArrowLeft,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface VerifyOtpScreenProps {
  mobileNumber: string;
  maskedPhone: string;
  initialDebugOtp?: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export const VerifyOtpScreen:
React.FC<VerifyOtpScreenProps> = ({
  maskedPhone,
  onVerificationSuccess,
  onBack
}) => {
  const {
    verifyRegistrationOtp,
    resendRegistrationOtp
  } = useAuth();

  const [
    otpDigits,
    setOtpDigits
  ] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  const [
    countdown,
    setCountdown
  ] = useState<number>(30);

  const [
    canResend,
    setCanResend
  ] = useState<boolean>(false);

  const [
    isVerifying,
    setIsVerifying
  ] = useState<boolean>(false);

  const [
    isResending,
    setIsResending
  ] = useState<boolean>(false);

  const [
    errorMessage,
    setErrorMessage
  ] = useState<string | null>(null);

  const inputRefs =
    useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer =
      setInterval(() => {
        setCountdown((previous) => {
          if (previous <= 1) {
            setCanResend(true);
            return 0;
          }

          return previous - 1;
        });
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (
    index: number,
    value: string
  ) => {
    setErrorMessage(null);

    const character =
      value.slice(-1);

    if (
      character &&
      !/^\d$/.test(character)
    ) {
      return;
    }

    const newDigits = [
      ...otpDigits
    ];

    newDigits[index] =
      character;

    setOtpDigits(newDigits);

    if (
      character &&
      index < 5
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }

    if (
      character &&
      index === 5 &&
      newDigits.every(
        (digit) => digit !== ''
      )
    ) {
      void handleVerifyCode(
        newDigits.join('')
      );
    }
  };

  const handleKeyDown = (
    index: number,
    event:
      React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key ===
      'Backspace'
    ) {
      const newDigits = [
        ...otpDigits
      ];

      if (
        !otpDigits[index] &&
        index > 0
      ) {
        newDigits[index - 1] =
          '';

        setOtpDigits(
          newDigits
        );

        inputRefs.current[
          index - 1
        ]?.focus();

        return;
      }

      newDigits[index] =
        '';

      setOtpDigits(
        newDigits
      );

      return;
    }

    if (
      event.key ===
        'ArrowLeft' &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();

      return;
    }

    if (
      event.key ===
        'ArrowRight' &&
      index < 5
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handlePaste = (
    event:
      React.ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pastedValue =
      event.clipboardData
        .getData('text')
        .trim();

    const digitsOnly =
      pastedValue
        .replace(/\D/g, '')
        .slice(0, 6);

    if (!digitsOnly) {
      return;
    }

    const newDigits = [
      '',
      '',
      '',
      '',
      '',
      ''
    ];

    for (
      let index = 0;
      index <
      digitsOnly.length;
      index += 1
    ) {
      newDigits[index] =
        digitsOnly[index];
    }

    setOtpDigits(
      newDigits
    );

    const nextFocusIndex =
      Math.min(
        digitsOnly.length,
        5
      );

    inputRefs.current[
      nextFocusIndex
    ]?.focus();

    if (
      digitsOnly.length === 6
    ) {
      void handleVerifyCode(
        digitsOnly
      );
    }
  };

  const handleVerifyCode =
    async (
      codeToVerify?: string
    ) => {
      const completeCode =
        codeToVerify ||
        otpDigits.join('');

      if (
        completeCode.length !==
        6
      ) {
        setErrorMessage(
          'Please enter all 6 digits of the verification code.'
        );

        return;
      }

      setIsVerifying(true);
      setErrorMessage(null);

      try {
        await verifyRegistrationOtp(
          completeCode
        );

        onVerificationSuccess();
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Invalid OTP. Please try again.'
        );
      } finally {
        setIsVerifying(false);
      }
    };

  const handleResendOtp =
    async () => {
      if (
        !canResend ||
        isResending
      ) {
        return;
      }

      setIsResending(true);
      setErrorMessage(null);

      try {
        await resendRegistrationOtp();

        setCountdown(30);
        setCanResend(false);

        setOtpDigits([
          '',
          '',
          '',
          '',
          '',
          ''
        ]);

        inputRefs.current[
          0
        ]?.focus();
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to resend code. Please try again.'
        );
      } finally {
        setIsResending(false);
      }
    };

  const isComplete =
    otpDigits.every(
      (digit) =>
        digit.length === 1
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between px-4 sm:px-6 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onBack}
            id="btn-back-from-otp"
            className="text-xs font-semibold text-slate-500 hover:text-[#1A2B4C] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60"
          >
            <ArrowLeft className="w-4 h-4" />

            <span>
              Back
            </span>
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

        <motion.div
          initial={{
            opacity: 0,
            y: 12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.28,
            ease: 'easeOut'
          }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-[#16A34A]">
              <Mail className="w-6 h-6" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#1A2B4C] tracking-tight">
              Verify Your Email
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 leading-relaxed">
              We&apos;ve sent a 6-digit verification code to

              <br />

              <span className="font-bold text-[#1A2B4C]">
                {maskedPhone}
              </span>
            </p>
          </div>

          {errorMessage && (
            <div
              className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
              role="alert"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />

              <span>
                {errorMessage}
              </span>
            </div>
          )}

          <div
            className="flex justify-between gap-1.5 sm:gap-2.5 mb-6"
            onPaste={
              handlePaste
            }
          >
            {otpDigits.map(
              (
                digit,
                index
              ) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[
                      index
                    ] = element;
                  }}
                  id={`otp-digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(
                    event
                  ) =>
                    handleDigitChange(
                      index,
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) =>
                    handleKeyDown(
                      index,
                      event
                    )
                  }
                  disabled={
                    isVerifying
                  }
                  className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl border transition-all focus:outline-none bg-slate-50/50 ${
                    errorMessage
                      ? 'border-red-400 text-red-700 ring-2 ring-red-100 bg-red-50/30'
                      : digit
                        ? 'border-[#16A34A] text-[#1A2B4C] ring-2 ring-[#16A34A]/15 bg-white shadow-xs'
                        : 'border-slate-300 text-[#1A2B4C] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 focus:bg-white'
                  }`}
                />
              )
            )}
          </div>

          <div className="text-center mb-6">
            {canResend ? (
              <button
                type="button"
                onClick={
                  handleResendOtp
                }
                disabled={
                  isResending
                }
                id="btn-resend-otp"
                className="text-xs font-bold text-[#16A34A] hover:underline inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />

                    <span>
                      Sending code...
                    </span>
                  </>
                ) : (
                  <span>
                    Resend OTP
                  </span>
                )}
              </button>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                Resend OTP in{' '}

                <span className="font-bold text-[#1A2B4C]">
                  {countdown}s
                </span>
              </p>
            )}
          </div>

          <button
            type="button"
            id="btn-verify-otp-submit"
            onClick={() =>
              void handleVerifyCode()
            }
            disabled={
              !isComplete ||
              isVerifying
            }
            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
              isComplete &&
              !isVerifying
                ? 'bg-[#16A34A] hover:bg-[#15803D] text-white cursor-pointer active:scale-[0.99] shadow-md shadow-emerald-700/10'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />

                <span>
                  Verifying...
                </span>
              </>
            ) : (
              <span>
                Verify & Continue
              </span>
            )}
          </button>
        </motion.div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

        <span>
          PALYA Official National Livestock Health Stewardship Network
        </span>
      </div>
    </div>
  );
};