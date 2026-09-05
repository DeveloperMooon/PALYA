import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToOverview: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToOverview,
  onLoginSuccess
}) => {
  const { login } = useAuth();

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation states
  const [mobileTouched, setMobileTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Validation logic
  const cleanMobile = mobileNumber.replace(/\D/g, '');
  const isMobileValid = cleanMobile.length === 10;
  const isPasswordValid = password.length >= 6;
  const isFormValid = isMobileValid && isPasswordValid;

  const getMobileError = () => {
    if (!mobileTouched) return null;
    if (!cleanMobile) return 'This field is required.';
    if (cleanMobile.length !== 10) return 'Please enter a valid 10-digit mobile number.';
    return null;
  };

  const getPasswordError = () => {
    if (!passwordTouched) return null;
    if (!password) return 'This field is required.';
    if (password.length < 6) return 'Password must contain at least 6 characters.';
    return null;
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits, up to 10
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(digitsOnly);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMobileTouched(true);
    setPasswordTouched(true);

    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(cleanMobile, password);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Incorrect mobile number or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick helper to fill test credentials
  const fillDemoCredentials = (role: 'farmer' | 'vet') => {
    if (role === 'farmer') {
      setMobileNumber('9876543210');
      setPassword('password123');
    } else {
      setMobileNumber('9123456789');
      setPassword('password123');
    }
    setMobileTouched(false);
    setPasswordTouched(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between px-4 sm:px-6 py-8">
      {/* Top Header & Branding */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onNavigateToOverview}
            className="text-xs font-semibold text-slate-500 hover:text-[#1A2B4C] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60"
            id="btn-back-to-overview"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button>

          {/* PALYA Mini Brand Emblem */}
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

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
        >
          {/* Headline */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A2B4C] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Sign in to continue
            </p>
          </div>

          {/* Global Alert / Error banner */}
          {errorMessage && (
            <div
              className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
              role="alert"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Mobile Number Field */}
            <div>
              <label
                htmlFor="login-mobile"
                className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>

              <div
                className={`flex items-center rounded-2xl border transition-all overflow-hidden bg-white ${
                  getMobileError()
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20'
                }`}
              >
                {/* Fixed +91 Country Code Box */}
                <div className="px-3.5 py-3 bg-slate-50 text-xs font-bold text-[#26364A] border-r border-slate-200 select-none shrink-0 flex items-center gap-1">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>

                <input
                  id="login-mobile"
                  name="mobileNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  onBlur={() => setMobileTouched(true)}
                  placeholder="Enter 10-digit mobile number"
                  autoComplete="tel-national"
                  className="w-full px-3.5 py-3 text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none bg-transparent"
                  disabled={isLoading}
                />
              </div>

              {getMobileError() && (
                <p className="text-xs font-medium text-red-600 mt-1.5 flex items-center gap-1">
                  <span>{getMobileError()}</span>
                </p>
              )}
            </div>

            {/* Password Field with Forgot Password link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-[#26364A] uppercase tracking-wide"
                >
                  Password <span className="text-red-500">*</span>
                </label>

                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-xs font-bold text-[#16A34A] hover:underline cursor-pointer"
                  id="link-forgot-password"
                >
                  Forgot Password?
                </button>
              </div>

              <div
                className={`relative flex items-center rounded-2xl border transition-all bg-white ${
                  getPasswordError()
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20'
                }`}
              >
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-3 text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none bg-transparent pr-11"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {getPasswordError() && (
                <p className="text-xs font-medium text-red-600 mt-1.5">
                  {getPasswordError()}
                </p>
              )}
            </div>

            {/* Submit Sign In Button */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isFormValid && !isLoading
                  ? 'bg-[#16A34A] hover:bg-[#15803D] text-white active:scale-[0.99] shadow-md shadow-emerald-700/10'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Need an account? Register */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need an account?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                id="link-go-to-register"
                className="font-bold text-[#16A34A] hover:underline cursor-pointer ml-1"
              >
                Register
              </button>
            </p>
          </div>

          {/* Demo Quick Fill Helper */}
          <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span>Quick Demo Sign-In:</span>
              <span className="text-[10px] text-slate-400">Pass: password123</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('farmer')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 font-bold text-slate-700 hover:text-[#16A34A] transition-colors cursor-pointer text-center"
              >
                Farmer (Rajesh)
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('vet')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 font-bold text-slate-700 hover:text-[#16A34A] transition-colors cursor-pointer text-center"
              >
                Veterinarian (Dr. Suresh)
              </button>
            </div>
          </div>
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
