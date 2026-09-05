import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AppRole } from '../types';
import { authService } from '../services/authService';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

interface AuthContextType {
  user: AuthUser | null;
  authStatus: AuthStatus;
  login: (mobileNumber: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  initiateRegistration: (params: {
    fullName: string;
    mobileNumber: string;
    role: AppRole;
    password: string;
    address?: string;
    pincode?: string;
  }) => Promise<{ otpCode: string; maskedPhone: string }>;
  verifyRegistrationOtp: (otpCode: string) => Promise<AuthUser>;
  resendRegistrationOtp: () => Promise<{ otpCode: string }>;
  updateUserKyc: (status: AuthUser['kycStatus']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  // Check persisted session on initial mount
  useEffect(() => {
    try {
      const persistedUser = authService.getAuthenticatedUser();
      if (persistedUser) {
        setUser(persistedUser);
        setAuthStatus('authenticated');
      } else {
        setUser(null);
        setAuthStatus('unauthenticated');
      }
    } catch {
      setUser(null);
      setAuthStatus('unauthenticated');
    }
  }, []);

  const login = async (mobileNumber: string, password: string): Promise<AuthUser> => {
    const authenticatedUser = await authService.login(mobileNumber, password);
    setUser(authenticatedUser);
    setAuthStatus('authenticated');
    return authenticatedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthStatus('unauthenticated');
  };

  const initiateRegistration = async (params: {
    fullName: string;
    mobileNumber: string;
    role: AppRole;
    password: string;
    address?: string;
    pincode?: string;
  }) => {
    return await authService.initiateRegistration(params);
  };

  const verifyRegistrationOtp = async (otpCode: string): Promise<AuthUser> => {
    const verifiedUser = await authService.verifyRegistrationOtp(otpCode);
    setUser(verifiedUser);
    setAuthStatus('authenticated');
    return verifiedUser;
  };

  const resendRegistrationOtp = async () => {
    return await authService.resendRegistrationOtp();
  };

  const updateUserKyc = (status: AuthUser['kycStatus']) => {
    if (user) {
      const updated = { ...user, kycStatus: status, updatedAt: new Date().toISOString() };
      authService.setAuthenticatedUser(updated);
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,
        login,
        logout,
        initiateRegistration,
        verifyRegistrationOtp,
        resendRegistrationOtp,
        updateUserKyc
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
