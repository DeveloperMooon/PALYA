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
    email: string;
    mobileNumber: string;
    role: AppRole;
    password: string;
    address?: string;
    pincode?: string;
  }) => Promise<{ otpCode: string; maskedPhone: string }>;
  verifyRegistrationOtp: (otpCode: string) => Promise<AuthUser>;
  resendRegistrationOtp: () => Promise<{ otpCode: string }>;
  updateUserKyc: (status: AuthUser['kycStatus']) => void;
  
  updateProfile: (
  fullName: string,
  age?: number
) => Promise<AuthUser>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  // Check persisted session on initial mount
  useEffect(() => {
  let active = true;

  const restoreAuthSession = async () => {
    try {
      const restoredUser =
        await authService.restoreSession();

      if (!active) return;

      setUser(restoredUser);

      setAuthStatus(
        restoredUser
          ? 'authenticated'
          : 'unauthenticated'
      );
    } catch {
      if (!active) return;

      setUser(null);
      setAuthStatus('unauthenticated');
    }
  };

  void restoreAuthSession();

  return () => {
    active = false;
  };
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
    email: string;
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

  const updateProfile = async (
  fullName: string,
  age?: number
): Promise<AuthUser> => {
  const updatedUser =
    await authService.updateProfile(
      fullName,
      age
    );

  setUser(updatedUser);

  return updatedUser;
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
        updateUserKyc,
        updateProfile
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
