import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { LoginScreen } from '../Auth/LoginScreen';
import { RegisterScreen } from '../Auth/RegisterScreen';
import { VerifyOtpScreen } from '../Auth/VerifyOtpScreen';
import { ForgotPasswordScreen } from '../Auth/ForgotPasswordScreen';

interface AuthScreenProps {
  currentScreen?: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentScreen = 'sign-in',
  onNavigate,
  onSuccess,
  onBackToLanding
}) => {
  // Intermediate state for OTP verification
  const [pendingPhone, setPendingPhone] = useState<string>('9876543210');
  const [pendingMaskedPhone, setPendingMaskedPhone] = useState<string>('+91 98765 43210');
  const [pendingDebugOtp, setPendingDebugOtp] = useState<string | undefined>(undefined);

  // Map currentScreen to internal view mode
  const getActiveView = () => {
    switch (currentScreen) {
      case 'register':
        return 'register';
      case 'verify-otp':
        return 'verify-otp';
      case 'forgot-password':
        return 'forgot-password';
      case 'sign-in':
      case 'auth':
      default:
        return 'sign-in';
    }
  };

  const activeView = getActiveView();

  const handleGoToOtp = (phone: string, masked: string, debugOtp: string) => {
    setPendingPhone(phone);
    setPendingMaskedPhone(masked);
    setPendingDebugOtp(debugOtp);
    onNavigate('verify-otp');
  };

  switch (activeView) {
    case 'register':
      return (
        <RegisterScreen
          onNavigateToLogin={() => onNavigate('sign-in')}
          onNavigateToOverview={onBackToLanding}
          onNavigateToOtp={handleGoToOtp}
        />
      );

    case 'verify-otp':
      return (
        <VerifyOtpScreen
          mobileNumber={pendingPhone}
          maskedPhone={pendingMaskedPhone}
          initialDebugOtp={pendingDebugOtp}
          onVerificationSuccess={onSuccess}
          onBack={() => onNavigate('register')}
        />
      );

    case 'forgot-password':
      return (
        <ForgotPasswordScreen
          onBackToLogin={() => onNavigate('sign-in')}
          onNavigateToOverview={onBackToLanding}
        />
      );

    case 'sign-in':
    default:
      return (
        <LoginScreen
          onNavigateToRegister={() => onNavigate('register')}
          onNavigateToForgotPassword={() => onNavigate('forgot-password')}
          onNavigateToOverview={onBackToLanding}
          onLoginSuccess={onSuccess}
        />
      );
  }
};
