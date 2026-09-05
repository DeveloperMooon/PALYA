import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Loader2, ArrowLeft, ChevronDown, Info, ShieldCheck } from 'lucide-react';
import { AppRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ROLE_OPTIONS } from '../../services/authService';
import { RoleSelectorModal } from './RoleSelectorModal';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToOverview: () => void;
  onNavigateToOtp: (phone: string, maskedPhone: string, debugOtp: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onNavigateToOverview,
  onNavigateToOtp
}) => {
  const { initiateRegistration } = useAuth();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field touched states for validation
  const [nameTouched, setNameTouched] = useState(false);
  const [mobileTouched, setMobileTouched] = useState(false);
  const [roleTouched, setRoleTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [pincodeTouched, setPincodeTouched] = useState(false);

  // Field validation helpers
  const cleanMobile = mobileNumber.replace(/\D/g, '');
  const cleanPincode = pincode.replace(/\D/g, '');

  const getNameError = () => {
    if (!nameTouched) return null;
    const trimmed = fullName.trim();
    if (!trimmed) return 'This field is required.';
    if (trimmed.length < 2) return 'Full name must contain at least 2 characters.';
    if (/^\d+$/.test(trimmed)) return 'Please enter a valid full name.';
    return null;
  };

  const getMobileError = () => {
    if (!mobileTouched) return null;
    if (!cleanMobile) return 'This field is required.';
    if (cleanMobile.length !== 10) return 'Please enter a valid 10-digit mobile number.';
    return null;
  };

  const getRoleError = () => {
    if (!roleTouched) return null;
    if (!selectedRole) return 'This field is required.';
    return null;
  };

  const getPasswordError = () => {
    if (!passwordTouched) return null;
    if (!password) return 'This field is required.';
    if (password.length < 6) return 'Password must contain at least 6 characters.';
    return null;
  };

  const getConfirmPasswordError = () => {
    if (!confirmTouched) return null;
    if (!confirmPassword) return 'This field is required.';
    if (confirmPassword !== password) return 'Passwords do not match';
    return null;
  };

  const getPincodeError = () => {
    if (!pincodeTouched || !cleanPincode) return null;
    if (cleanPincode.length !== 6) return 'Please enter a valid 6-digit pincode.';
    return null;
  };

  // Check overall form validity
  const isFormValid =
    fullName.trim().length >= 2 &&
    !/^\d+$/.test(fullName.trim()) &&
    cleanMobile.length === 10 &&
    !!selectedRole &&
    password.length >= 6 &&
    confirmPassword === password &&
    (!cleanPincode || cleanPincode.length === 6);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(digitsOnly);
    setErrorMessage(null);
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(digitsOnly);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setMobileTouched(true);
    setRoleTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);
    setPincodeTouched(true);

    if (!isFormValid || !selectedRole || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await initiateRegistration({
        fullName,
        mobileNumber: cleanMobile,
        role: selectedRole,
        password,
        address,
        pincode: cleanPincode || undefined
      });

      onNavigateToOtp(cleanMobile, result.maskedPhone, result.otpCode);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between px-4 sm:px-6 py-8">
      <div className="w-full max-w-lg mx-auto">
        {/* Navigation & Branding */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onNavigateToOverview}
            className="text-xs font-semibold text-slate-500 hover:text-[#1A2B4C] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-200/60"
            id="btn-back-to-overview-from-register"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
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

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A2B4C] tracking-tight">
              Create Account
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Register to get started
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

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* 1. Full Name * */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-name"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrorMessage(null);
                }}
                onBlur={() => setNameTouched(true)}
                placeholder="Enter your full name"
                autoComplete="name"
                className={`w-full px-3.5 py-3 rounded-2xl border text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none transition-all ${
                  getNameError()
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20'
                }`}
                disabled={isLoading}
              />
              {getNameError() && (
                <p className="text-xs font-medium text-red-600 mt-1.5">
                  {getNameError()}
                </p>
              )}
            </div>

            {/* 2. Mobile Number * */}
            <div>
              <label
                htmlFor="reg-mobile"
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
                <div className="px-3.5 py-3 bg-slate-50 text-xs font-bold text-[#26364A] border-r border-slate-200 select-none shrink-0 flex items-center gap-1">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  id="reg-mobile"
                  name="mobileNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  onBlur={() => setMobileTouched(true)}
                  placeholder="10-digit mobile number"
                  autoComplete="tel-national"
                  className="w-full px-3.5 py-3 text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none bg-transparent"
                  disabled={isLoading}
                />
              </div>
              {getMobileError() && (
                <p className="text-xs font-medium text-red-600 mt-1.5">
                  {getMobileError()}
                </p>
              )}
            </div>

            {/* 3. User Type * (Bottom Sheet Trigger) */}
            <div>
              <label
                htmlFor="btn-open-role-selector"
                className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
              >
                User Type <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                id="btn-open-role-selector"
                onClick={() => {
                  setRoleTouched(true);
                  setIsRoleModalOpen(true);
                }}
                className={`w-full px-3.5 py-3 rounded-2xl border text-left text-sm flex items-center justify-between transition-all bg-white cursor-pointer ${
                  getRoleError()
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20'
                }`}
              >
                <span
                  className={
                    selectedRoleOption
                      ? 'font-bold text-[#1A2B4C]'
                      : 'text-slate-400 font-normal'
                  }
                >
                  {selectedRoleOption ? selectedRoleOption.label : 'Select your role'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {getRoleError() && (
                <p className="text-xs font-medium text-red-600 mt-1.5">
                  {getRoleError()}
                </p>
              )}
            </div>

            {/* 4. Password * & Confirm Password * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative flex items-center rounded-2xl border transition-all bg-white ${
                    getPasswordError()
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20'
                  }`}
                >
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {getPasswordError() && (
                  <p className="text-xs font-medium text-red-600 mt-1.5">
                    {getPasswordError()}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-confirm-password"
                  className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative flex items-center rounded-2xl border transition-all bg-white ${
                    getConfirmPasswordError()
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/20'
                  }`}
                >
                  <input
                    id="reg-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmTouched(true)}
                    placeholder="Re-enter your password"
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
                {getConfirmPasswordError() && (
                  <p className="text-xs font-medium text-red-600 mt-1.5">
                    {getConfirmPasswordError()}
                  </p>
                )}
              </div>
            </div>

            {/* 5. Address (Optional) */}
            <div>
              <label
                htmlFor="reg-address"
                className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
              >
                Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="reg-address"
                name="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Complete address (will be required for KYC verification)"
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none transition-all"
                disabled={isLoading}
              />
            </div>

            {/* 6. Pincode (Optional) */}
            <div>
              <label
                htmlFor="reg-pincode"
                className="block text-xs font-bold text-[#26364A] mb-1.5 uppercase tracking-wide"
              >
                Pincode <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="reg-pincode"
                name="pincode"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pincode}
                onChange={handlePincodeChange}
                onBlur={() => setPincodeTouched(true)}
                placeholder="6-digit pincode"
                className={`w-full px-3.5 py-3 rounded-2xl border text-sm text-[#26364A] placeholder:text-slate-400 focus:outline-none transition-all ${
                  getPincodeError()
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20'
                }`}
                disabled={isLoading}
              />
              {getPincodeError() && (
                <p className="text-xs font-medium text-red-600 mt-1.5">
                  {getPincodeError()}
                </p>
              )}
            </div>

            {/* 7. Information Box */}
            <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold">Note:</span> After registration, you can complete
                your KYC verification to access full features including state, district, village
                details, and document uploads.
              </p>
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              id="btn-register-submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                isFormValid && !isLoading
                  ? 'bg-[#16A34A] hover:bg-[#15803D] text-white active:scale-[0.99] shadow-md shadow-emerald-700/10'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          {/* Already have an account? Sign in */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                id="link-go-to-login"
                className="font-bold text-[#16A34A] hover:underline cursor-pointer ml-1"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectorModal
        isOpen={isRoleModalOpen}
        selectedRole={selectedRole}
        onSelectRole={(role) => {
          setSelectedRole(role);
          setRoleTouched(true);
        }}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Footer Trust Marker */}
      <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>PALYA Official National Livestock Health Stewardship Network</span>
      </div>
    </div>
  );
};
