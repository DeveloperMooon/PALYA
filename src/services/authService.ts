import { AuthUser, AppRole, KycStatus } from '../types';

export interface UserAccountRecord {
  user: AuthUser;
  passwordHash: string;
}

export interface PendingRegistration {
  fullName: string;
  mobileNumber: string;
  role: AppRole;
  passwordHash: string;
  address?: string;
  pincode?: string;
  otpCode: string;
  otpExpiresAt: number;
}

export interface PendingPasswordReset {
  mobileNumber: string;
  otpCode: string;
  otpExpiresAt: number;
  verified: boolean;
}

export const ROLE_OPTIONS: { id: AppRole; label: string; description: string }[] = [
  {
    id: 'livestock_owner',
    label: 'Livestock Owner/Producer',
    description: 'Dairy farmers, livestock breeders, herd managers'
  },
  {
    id: 'veterinarian',
    label: 'Veterinarian',
    description: 'Registered animal health practitioners & inspectors'
  },
  {
    id: 'laboratory',
    label: 'Laboratory',
    description: 'Diagnostic labs, AMR testing, residue analytics'
  },
  {
    id: 'government_official',
    label: 'Government Official',
    description: 'Animal husbandry dept, regulatory & food safety officers'
  },
  {
    id: 'collector',
    label: 'Collector',
    description: 'Milk & meat cooperative field agents, sample collectors'
  },
  {
    id: 'pharmaceutical_retailer',
    label: 'Pharmaceutical Retailer',
    description: 'Veterinary drug stores, distributors, feed dispensers'
  }
];

const STORAGE_KEY_AUTH_USER = 'palya_auth_user';
const STORAGE_KEY_USERS_DB = 'palya_users_db';
const STORAGE_KEY_PENDING_REG = 'palya_pending_reg';
const STORAGE_KEY_PENDING_RESET = 'palya_pending_reset';

// Basic one-way cryptographic hash for client simulation (SHA-256)
async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`palya_salt_${password}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback if subtle crypto unavailable
    let hash = 0;
    const str = `palya_salt_${password}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}

// Generate realistic 6-digit OTP
function generateOtp(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

// Seed initial users if not present
async function initializeUsersDb(): Promise<UserAccountRecord[]> {
  const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // parse error, re-seed
    }
  }

  const defaultFarmerHash = await hashPassword('password123');
  const defaultVetHash = await hashPassword('password123');

  const defaultUsers: UserAccountRecord[] = [
    {
      user: {
        id: 'usr-farmer-01',
        fullName: 'Rajesh Kumar',
        mobileNumber: '9876543210',
        role: 'livestock_owner',
        address: 'Shiv Dairy Farm, Sector 4, Meerut',
        pincode: '250404',
        kycStatus: 'verified',
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-08-20T10:30:00.000Z'
      },
      passwordHash: defaultFarmerHash
    },
    {
      user: {
        id: 'usr-vet-01',
        fullName: 'Dr. Suresh Kumar',
        mobileNumber: '9123456789',
        role: 'veterinarian',
        address: 'District Veterinary Polyclinic, Meerut',
        pincode: '250001',
        kycStatus: 'verified',
        createdAt: '2026-01-10T08:00:00.000Z',
        updatedAt: '2026-08-22T14:15:00.000Z'
      },
      passwordHash: defaultVetHash
    }
  ];

  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export const authService = {
  // Check persisted authenticated user
  getAuthenticatedUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Save authenticated session
  setAuthenticatedUser(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    }
  },

  // Log in with mobile number and password
  async login(mobileNumber: string, password: string): Promise<AuthUser> {
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must contain at least 6 characters.');
    }

    // Artificial tiny delay for realistic auth roundtrip
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = await initializeUsersDb();
    const targetHash = await hashPassword(password);

    const record = users.find(
      (u) => u.user.mobileNumber === cleanMobile && u.passwordHash === targetHash
    );

    if (!record) {
      throw new Error('Incorrect mobile number or password.');
    }

    this.setAuthenticatedUser(record.user);
    return record.user;
  },

  // Register - step 1: Validate, generate OTP, store pending state
  async initiateRegistration(params: {
    fullName: string;
    mobileNumber: string;
    role: AppRole;
    password: string;
    address?: string;
    pincode?: string;
  }): Promise<{ otpCode: string; maskedPhone: string }> {
    const cleanMobile = params.mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }

    const trimmedName = params.fullName.trim();
    if (trimmedName.length < 2 || /^\d+$/.test(trimmedName)) {
      throw new Error('Please enter a valid full name.');
    }

    if (!params.role) {
      throw new Error('Please select a user type.');
    }

    if (!params.password || params.password.length < 6) {
      throw new Error('Password must contain at least 6 characters.');
    }

    if (params.pincode) {
      const cleanPincode = params.pincode.replace(/\D/g, '');
      if (cleanPincode.length !== 6) {
        throw new Error('Please enter a valid 6-digit pincode.');
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = await initializeUsersDb();
    const existing = users.find((u) => u.user.mobileNumber === cleanMobile);
    if (existing) {
      throw new Error('An account with this mobile number already exists. Try signing in instead.');
    }

    const passwordHash = await hashPassword(params.password);
    const otpCode = generateOtp();
    const pendingData: PendingRegistration = {
      fullName: trimmedName,
      mobileNumber: cleanMobile,
      role: params.role,
      passwordHash,
      address: params.address?.trim() || undefined,
      pincode: params.pincode?.trim() || undefined,
      otpCode,
      otpExpiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    localStorage.setItem(STORAGE_KEY_PENDING_REG, JSON.stringify(pendingData));

    const maskedPhone = `+91 ${cleanMobile.slice(0, 5)} ${cleanMobile.slice(5)}`;
    return { otpCode, maskedPhone };
  },

  // Get current pending registration
  getPendingRegistration(): PendingRegistration | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PENDING_REG);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Resend OTP for registration
  async resendRegistrationOtp(): Promise<{ otpCode: string }> {
    const pending = this.getPendingRegistration();
    if (!pending) {
      throw new Error('Registration session expired. Please start registration again.');
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const newOtp = generateOtp();
    pending.otpCode = newOtp;
    pending.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY_PENDING_REG, JSON.stringify(pending));

    return { otpCode: newOtp };
  },

  // Verify OTP & finalize registration
  async verifyRegistrationOtp(inputOtp: string): Promise<AuthUser> {
    const pending = this.getPendingRegistration();
    if (!pending) {
      throw new Error('Registration session expired. Please start registration again.');
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (Date.now() > pending.otpExpiresAt) {
      throw new Error('OTP has expired. Please request a new code.');
    }

    if (inputOtp.trim() !== pending.otpCode) {
      throw new Error('Invalid OTP. Please try again.');
    }

    // Create user profile
    const now = new Date().toISOString();
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      fullName: pending.fullName,
      mobileNumber: pending.mobileNumber,
      role: pending.role,
      address: pending.address,
      pincode: pending.pincode,
      kycStatus: 'not_started',
      createdAt: now,
      updatedAt: now
    };

    const newRecord: UserAccountRecord = {
      user: newUser,
      passwordHash: pending.passwordHash
    };

    const users = await initializeUsersDb();
    users.push(newRecord);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

    // Clear pending registration
    localStorage.removeItem(STORAGE_KEY_PENDING_REG);

    // Save active session
    this.setAuthenticatedUser(newUser);
    return newUser;
  },

  // Forgot password - Step 1: Request OTP
  async initiateForgotPassword(mobileNumber: string): Promise<{ otpCode: string; maskedPhone: string }> {
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = await initializeUsersDb();
    const user = users.find((u) => u.user.mobileNumber === cleanMobile);
    if (!user) {
      throw new Error('No account found with this mobile number.');
    }

    const otpCode = generateOtp();
    const pendingReset: PendingPasswordReset = {
      mobileNumber: cleanMobile,
      otpCode,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      verified: false
    };

    localStorage.setItem(STORAGE_KEY_PENDING_RESET, JSON.stringify(pendingReset));
    const maskedPhone = `+91 ${cleanMobile.slice(0, 5)} ${cleanMobile.slice(5)}`;
    return { otpCode, maskedPhone };
  },

  // Forgot password - Step 2: Verify OTP
  async verifyForgotPasswordOtp(inputOtp: string): Promise<boolean> {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING_RESET);
    if (!raw) {
      throw new Error('Password reset session expired. Please try again.');
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const pending: PendingPasswordReset = JSON.parse(raw);

    if (Date.now() > pending.otpExpiresAt) {
      throw new Error('OTP has expired. Please request a new code.');
    }

    if (inputOtp.trim() !== pending.otpCode) {
      throw new Error('Invalid OTP. Please try again.');
    }

    pending.verified = true;
    localStorage.setItem(STORAGE_KEY_PENDING_RESET, JSON.stringify(pending));
    return true;
  },

  // Forgot password - Step 3: Set New Password
  async completePasswordReset(newPassword: string): Promise<boolean> {
    const raw = localStorage.getItem(STORAGE_KEY_PENDING_RESET);
    if (!raw) {
      throw new Error('Session expired. Please start the password reset flow again.');
    }

    const pending: PendingPasswordReset = JSON.parse(raw);
    if (!pending.verified) {
      throw new Error('Please verify OTP first.');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must contain at least 6 characters.');
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const newHash = await hashPassword(newPassword);
    const users = await initializeUsersDb();
    const index = users.findIndex((u) => u.user.mobileNumber === pending.mobileNumber);

    if (index === -1) {
      throw new Error('User not found.');
    }

    users[index].passwordHash = newHash;
    users[index].user.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    localStorage.removeItem(STORAGE_KEY_PENDING_RESET);

    return true;
  },

  // Logout
  logout(): void {
    this.setAuthenticatedUser(null);
    localStorage.removeItem(STORAGE_KEY_PENDING_REG);
    localStorage.removeItem(STORAGE_KEY_PENDING_RESET);
  }
};
