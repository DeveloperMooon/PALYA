import { supabaseAuth } from './supabaseAuthClient';
import type { AppRole, AuthUser } from '../types';

export interface PendingRegistration {
  fullName: string;
  email: string;
  mobileNumber: string;
  role: AppRole;
  password: string;
  address?: string;
  pincode?: string;
}

interface ApiUserResponse {
  user: AuthUser;
}

interface ForgotPasswordRequestResponse {
  maskedPhone: string;
}

interface ForgotPasswordVerifyResponse {
  resetToken: string;
}

export const ROLE_OPTIONS: {
  id: AppRole;
  label: string;
  description: string;
}[] = [
  {
    id: 'livestock_owner',
    label: 'Livestock Owner/Producer',
    description: 'Dairy farmers, livestock breeders, herd managers',
  },
  {
    id: 'veterinarian',
    label: 'Veterinarian',
    description: 'Registered animal health practitioners & inspectors',
  },
  {
    id: 'laboratory',
    label: 'Laboratory',
    description: 'Diagnostic labs, AMR testing, residue analytics',
  },
  {
    id: 'government_official',
    label: 'Government Official',
    description: 'Animal husbandry dept, regulatory & food safety officers',
  },
  {
    id: 'collector',
    label: 'Collector',
    description: 'Milk & meat cooperative field agents, sample collectors',
  },
  {
    id: 'pharmaceutical_retailer',
    label: 'Pharmaceutical Retailer',
    description: 'Veterinary drug stores, distributors, feed dispensers',
  },
];

const API_URL = String(
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

let currentUser: AuthUser | null = null;

let pendingRegistration:
  | PendingRegistration
  | null = null;

let pendingPasswordReset: {
  mobileNumber: string;
  resetToken?: string;
} | null = null;

function cleanMobileNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(-10);
}

function cleanEmailAddress(value: string): string {
  return value
    .trim()
    .toLowerCase();
}

function maskEmail(email: string): string {
  return email.replace(
    /^(.{2}).*(@.*)$/,
    '$1***$2'
  );
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      credentials: 'include',

      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
  );

  const body =
    response.status === 204
      ? null
      : await response
          .json()
          .catch(() => null);

  if (!response.ok) {
    const message =
      body &&
      typeof body === 'object' &&
      'error' in body
        ? String(body.error)
        : 'Request failed. Please try again.';

    throw new Error(message);
  }

  return body as T;
}

export const authService = {
  async sendEmailOtp(
    email: string
  ): Promise<void> {
    const cleanEmail =
      cleanEmailAddress(email);

    const { error } =
      await supabaseAuth.auth.signInWithOtp({
        email: cleanEmail,

        options: {
          shouldCreateUser: true,
        },
      });

    if (error) {
      throw new Error(error.message);
    }
  },

  async verifyEmailOtp(
    email: string,
    otpCode: string
  ): Promise<string> {
    const { data, error } =
      await supabaseAuth.auth.verifyOtp({
        email:
          cleanEmailAddress(email),

        token:
          otpCode.trim(),

        type: 'email',
      });

    const accessToken =
      data.session?.access_token;

    if (
      error ||
      !data.user ||
      !accessToken
    ) {
      throw new Error(
        error?.message ||
          'Invalid or expired OTP.'
      );
    }

    return accessToken;
  },

  getAuthenticatedUser():
  AuthUser | null {
    return currentUser;
  },

  setAuthenticatedUser(
    user: AuthUser | null
  ): void {
    currentUser = user;
  },

  async restoreSession():
  Promise<AuthUser | null> {
    try {
      const response =
        await apiRequest<ApiUserResponse>(
          '/api/auth/me'
        );

      currentUser =
        response.user;

      return response.user;

    } catch {
      currentUser = null;

      return null;
    }
  },

  async login(
    mobileNumber: string,
    password: string
  ): Promise<AuthUser> {
    const cleanMobile =
      cleanMobileNumber(
        mobileNumber
      );

    if (
      !/^\d{10}$/.test(
        cleanMobile
      )
    ) {
      throw new Error(
        'Please enter a valid 10-digit mobile number.'
      );
    }

    if (!password) {
      throw new Error(
        'Password is required.'
      );
    }

    const response =
      await apiRequest<ApiUserResponse>(
        '/api/auth/login',
        {
          method: 'POST',

          body: JSON.stringify({
            mobileNumber:
              cleanMobile,

            password,
          }),
        }
      );

    currentUser =
      response.user;

    return response.user;
  },

  async initiateRegistration(
    params: PendingRegistration
  ): Promise<{
    otpCode: string;
    maskedPhone: string;
  }> {
    const fullName =
      params.fullName.trim();

    const email =
      cleanEmailAddress(
        params.email
      );

    const mobileNumber =
      cleanMobileNumber(
        params.mobileNumber
      );

    const address =
      params.address?.trim() ||
      undefined;

    const pincode =
      params.pincode
        ?.replace(/\D/g, '') ||
      undefined;

    if (
      params.role === 'admin'
    ) {
      throw new Error(
        'Administrator accounts cannot be created through public registration.'
      );
    }

    if (
      fullName.length < 2 ||
      /^\d+$/.test(fullName)
    ) {
      throw new Error(
        'Please enter a valid full name.'
      );
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        email
      )
    ) {
      throw new Error(
        'Please enter a valid email address.'
      );
    }

    if (
      !/^\d{10}$/.test(
        mobileNumber
      )
    ) {
      throw new Error(
        'Please enter a valid 10-digit mobile number.'
      );
    }

    if (
      !params.password ||
      params.password.length < 8
    ) {
      throw new Error(
        'Password must contain at least 8 characters.'
      );
    }

    if (
      pincode &&
      !/^\d{6}$/.test(pincode)
    ) {
      throw new Error(
        'Please enter a valid 6-digit pincode.'
      );
    }

    await this.sendEmailOtp(
      email
    );

    pendingRegistration = {
      fullName,
      email,
      mobileNumber,
      role: params.role,
      password:
        params.password,
      address,
      pincode,
    };

    return {
      otpCode: '',

      maskedPhone:
        maskEmail(email),
    };
  },

  getPendingRegistration():
  PendingRegistration | null {
    return pendingRegistration;
  },

  async resendRegistrationOtp():
  Promise<{
    otpCode: string;
  }> {
    if (!pendingRegistration) {
      throw new Error(
        'Registration session expired. Please start registration again.'
      );
    }

    await this.sendEmailOtp(
      pendingRegistration.email
    );

    return {
      otpCode: '',
    };
  },

  async verifyRegistrationOtp(
    inputOtp: string
  ): Promise<AuthUser> {
    if (!pendingRegistration) {
      throw new Error(
        'Registration session expired. Please start registration again.'
      );
    }

    const cleanOtp =
      inputOtp.trim();

    if (
      !/^\d{6}$/.test(
        cleanOtp
      )
    ) {
      throw new Error(
        'Please enter a valid 6-digit verification code.'
      );
    }

    const accessToken =
      await this.verifyEmailOtp(
        pendingRegistration.email,
        cleanOtp
      );

    const response =
      await apiRequest<ApiUserResponse>(
        '/api/auth/register',
        {
          method: 'POST',

          body: JSON.stringify({
            accessToken,
            ...pendingRegistration,
          }),
        }
      );

    currentUser =
      response.user;

    pendingRegistration =
      null;

    await supabaseAuth.auth.signOut({
      scope: 'local',
    });

    return response.user;
  },

  async updateProfile(
  fullName: string,
  age?: number,
  farmName?: string,
  farmLatitude?: number,
  farmLongitude?: number
): Promise<AuthUser> {
  const response =
    await apiRequest<ApiUserResponse>(
      '/api/auth/profile',
      {
        method: 'PATCH',
        body: JSON.stringify({
          fullName,
          age,
          farmName,
          farmLatitude,
          farmLongitude,
        }),
      }
    );

  currentUser = response.user;
  return response.user;
},

  async updateKycStatus(
    status:
      AuthUser['kycStatus']
  ): Promise<AuthUser> {
    const response =
      await apiRequest<ApiUserResponse>(
        '/api/auth/kyc',
        {
          method: 'PATCH',

          body: JSON.stringify({
            status,
          }),
        }
      );

    currentUser =
      response.user;

    return response.user;
  },

  async initiateForgotPassword(
    mobileNumber: string
  ): Promise<{
    otpCode: string;
    maskedPhone: string;
  }> {
    const cleanMobile =
      cleanMobileNumber(
        mobileNumber
      );

    if (
      !/^\d{10}$/.test(
        cleanMobile
      )
    ) {
      throw new Error(
        'Please enter a valid 10-digit mobile number.'
      );
    }

    const response =
      await apiRequest<ForgotPasswordRequestResponse>(
        '/api/auth/forgot-password/request',
        {
          method: 'POST',

          body: JSON.stringify({
            mobileNumber:
              cleanMobile,
          }),
        }
      );

    pendingPasswordReset = {
      mobileNumber:
        cleanMobile,
    };

    return {
      otpCode: '',

      maskedPhone:
        response.maskedPhone,
    };
  },

  async verifyForgotPasswordOtp(
    inputOtp: string
  ): Promise<boolean> {
    if (
      !pendingPasswordReset
    ) {
      throw new Error(
        'Password reset session expired. Please start again.'
      );
    }

    const cleanOtp =
      inputOtp.trim();

    if (
      !/^\d{6}$/.test(
        cleanOtp
      )
    ) {
      throw new Error(
        'Please enter a valid 6-digit verification code.'
      );
    }

    const response =
      await apiRequest<ForgotPasswordVerifyResponse>(
        '/api/auth/forgot-password/verify',
        {
          method: 'POST',

          body: JSON.stringify({
            mobileNumber:
              pendingPasswordReset
                .mobileNumber,

            otpCode:
              cleanOtp,
          }),
        }
      );

    pendingPasswordReset
      .resetToken =
        response.resetToken;

    return true;
  },

  async completePasswordReset(
    newPassword: string
  ): Promise<boolean> {
    if (
      !pendingPasswordReset
        ?.resetToken
    ) {
      throw new Error(
        'Verify the OTP before setting a new password.'
      );
    }

    if (
      newPassword.length < 8
    ) {
      throw new Error(
        'Password must contain at least 8 characters.'
      );
    }

    await apiRequest<void>(
      '/api/auth/forgot-password/reset',
      {
        method: 'POST',

        body: JSON.stringify({
          resetToken:
            pendingPasswordReset
              .resetToken,

          newPassword,
        }),
      }
    );

    pendingPasswordReset =
      null;

    return true;
  },

  isAdmin(): boolean {
    return (
      currentUser?.role ===
      'admin'
    );
  },

  logout(): void {
    currentUser = null;

    pendingRegistration =
      null;

    pendingPasswordReset =
      null;

    void apiRequest<void>(
      '/api/auth/logout',
      {
        method: 'POST',
      }
    ).catch(
      () => undefined
    );

    void supabaseAuth.auth.signOut({
      scope: 'local',
    });
  },
};