import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { supabase, supabaseAuth } from '../db/supabase';


const router = Router();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Missing JWT_SECRET environment variable');
}

const JWT_SECRET: jwt.Secret = jwtSecret;

const SESSION_COOKIE = 'palya_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const PUBLIC_ROLES = new Set([
  'livestock_owner',
  'veterinarian',
  'laboratory',
  'government_official',
  'collector',
  'pharmaceutical_retailer',
]);

interface AppUserRow {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  age?: number | null;
  email: string | null;
  mobile_number: string;
  role: string;
  password_hash: string;
  address: string | null;
  pincode: string | null;
  kyc_status: string;
  created_at: string;
  updated_at: string;
}

interface SessionPayload extends jwt.JwtPayload {
  sub: string;
  role: string;
}

function normalizeEmail(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function normalizeMobile(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '').slice(-10);
}

function maskEmailAddress(
  email: string
): string {
  return email.replace(
    /^(.{2}).*(@.*)$/,
    '$1***$2'
  );
}

function publicUser(row: AppUserRow) {
  return {
    id: row.id,
    fullName: row.full_name,
    age: row.age ?? undefined,
    email: row.email,
    mobileNumber: row.mobile_number,
    role: row.role,
    address: row.address ?? undefined,
    pincode: row.pincode ?? undefined,
    kycStatus: row.kyc_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function setSessionCookie(res: Response, user: AppUserRow): void {
  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
  });
}

function clearSessionCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getAuthenticatedUserId(
  req: Request
): string | null {
  const sessionToken =
    req.cookies?.[SESSION_COOKIE];

  if (
    !sessionToken ||
    typeof sessionToken !== 'string'
  ) {
    return null;
  }

  try {
    const payload =
      jwt.verify(
        sessionToken,
        JWT_SECRET
      ) as SessionPayload;

    return typeof payload.sub === 'string'
      ? payload.sub
      : null;

  } catch {
    return null;
  }
}

router.patch(
  '/profile',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        getAuthenticatedUserId(req);

      if (!userId) {
        clearSessionCookie(res);

        return res.status(401).json({
          error:
            'Session expired. Please log in again.',
        });
      }

      const fullName =
        String(
          req.body?.fullName ?? ''
        ).trim();

      const age =
        req.body?.age;

      if (
        fullName.length < 2 ||
        /^\d+$/.test(fullName)
      ) {
        return res.status(400).json({
          error:
            'Please enter a valid full name.',
        });
      }

      if (
        age !== undefined &&
        (
          !Number.isInteger(age) ||
          age < 1 ||
          age > 120
        )
      ) {
        return res.status(400).json({
          error:
            'Please enter a valid age.',
        });
      }

      const updates: {
        full_name: string;
        age?: number;
        updated_at: string;
      } = {
        full_name: fullName,
        updated_at:
          new Date().toISOString(),
      };

      if (age !== undefined) {
        updates.age = age;
      }

      const {
        data: updatedUser,
        error,
      } = await supabase
        .from('app_users')
        .update(updates)
        .eq('id', userId)
        .select(
          'id, auth_user_id, full_name, age, email, mobile_number, role, password_hash, address, pincode, kyc_status, created_at, updated_at'
        )
        .single<AppUserRow>();

      if (error || !updatedUser) {
        throw (
          error ??
          new Error(
            'Profile could not be updated.'
          )
        );
      }

      return res.json({
        user:
          publicUser(updatedUser),
      });

    } catch (error) {
      console.error(
        'Profile update error:',
        error
      );

      return res.status(500).json({
        error:
          'Profile update failed. Please try again.',
      });
    }
  }
);

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      accessToken,
      fullName,
      email,
      mobileNumber,
      role,
      password,
      address,
      pincode,
    } = req.body ?? {};

    const cleanName = String(fullName ?? '').trim();
    const cleanEmail = normalizeEmail(email);
    const cleanMobile = normalizeMobile(mobileNumber);
    const cleanRole = String(role ?? '').trim();
    const cleanPassword = String(password ?? '');
    const cleanAddress = String(address ?? '').trim() || null;
    const cleanPincode =
      String(pincode ?? '').replace(/\D/g, '') || null;

    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(401).json({
        error:
          'Email verification token is missing. Please verify the OTP again.',
      });
    }

    if (cleanName.length < 2) {
      return res
        .status(400)
        .json({ error: 'Please enter a valid full name.' });
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return res
        .status(400)
        .json({ error: 'Please enter a valid email address.' });
    }

    if (!/^\d{10}$/.test(cleanMobile)) {
      return res
        .status(400)
        .json({
          error: 'Please enter a valid 10-digit mobile number.',
        });
    }

    if (!PUBLIC_ROLES.has(cleanRole)) {
      return res
        .status(400)
        .json({ error: 'Please select a valid user type.' });
    }

    if (cleanPassword.length < 8) {
      return res
        .status(400)
        .json({
          error: 'Password must be at least 8 characters.',
        });
    }

    if (cleanPincode && !/^\d{6}$/.test(cleanPincode)) {
      return res
        .status(400)
        .json({
          error: 'Pincode must contain exactly 6 digits.',
        });
    }

    const {
      data: { user: verifiedAuthUser },
      error: tokenError,
    } = await supabase.auth.getUser(accessToken);

    if (tokenError || !verifiedAuthUser) {
      return res.status(401).json({
        error:
          'Email verification has expired. Please request a new OTP.',
      });
    }

    if (!verifiedAuthUser.email_confirmed_at) {
      return res.status(401).json({
        error: 'Please verify your email before registering.',
      });
    }

    if (
      normalizeEmail(verifiedAuthUser.email) !==
      cleanEmail
    ) {
      return res.status(403).json({
        error:
          'Verified email does not match the registration email.',
      });
    }

    const {
      data: existingMobile,
      error: mobileLookupError,
    } = await supabase
      .from('app_users')
      .select('id')
      .eq('mobile_number', cleanMobile)
      .maybeSingle();

    if (mobileLookupError) {
      throw mobileLookupError;
    }

    if (existingMobile) {
      return res.status(409).json({
        error:
          'An account already exists with this mobile number.',
      });
    }

    const {
      data: existingEmail,
      error: emailLookupError,
    } = await supabase
      .from('app_users')
      .select('id')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (emailLookupError) {
      throw emailLookupError;
    }

    if (existingEmail) {
      return res.status(409).json({
        error:
          'An account already exists with this email address.',
      });
    }

    const {
      data: existingAuthUser,
      error: authLookupError,
    } = await supabase
      .from('app_users')
      .select('id')
      .eq('auth_user_id', verifiedAuthUser.id)
      .maybeSingle();

    if (authLookupError) {
      throw authLookupError;
    }

    if (existingAuthUser) {
      return res.status(409).json({
        error:
          'This verified email is already registered.',
      });
    }

    const passwordHash =
      await bcrypt.hash(cleanPassword, 12);

    const {
      data: createdUser,
      error: insertError,
    } = await supabase
      .from('app_users')
      .insert({
        auth_user_id: verifiedAuthUser.id,
        full_name: cleanName,
        email: cleanEmail,
        mobile_number: cleanMobile,
        role: cleanRole,
        password_hash: passwordHash,
        address: cleanAddress,
        pincode: cleanPincode,
        kyc_status: 'not_started',
      })
      .select(
        'id, auth_user_id, full_name, age, email, mobile_number, role, password_hash, address, pincode, kyc_status, created_at, updated_at'
      )
      .single<AppUserRow>();

    if (insertError || !createdUser) {
      if (insertError?.code === '23505') {
        return res.status(409).json({
          error:
            'An account already exists with these details.',
        });
      }

      throw (
        insertError ??
        new Error('Account could not be created.')
      );
    }

    setSessionCookie(res, createdUser);

    return res
      .status(201)
      .json({
        user: publicUser(createdUser),
      });

  } catch (error) {

    console.error(
      'Registration error:',
      error
    );

    return res.status(500).json({
      error:
        'Registration failed. Please try again.',
      details:
        process.env.NODE_ENV === 'development'
          ? errorMessage(error)
          : undefined,
    });
  }
});


router.post('/login', async (req: Request, res: Response) => {

  try {

    const cleanMobile =
      normalizeMobile(
        req.body?.mobileNumber
      );

    const password =
      String(
        req.body?.password ?? ''
      );

    if (
      !/^\d{10}$/.test(cleanMobile) ||
      !password
    ) {

      return res.status(400).json({
        error:
          'Mobile number and password are required.',
      });
    }

    const {
      data: user,
      error,
    } = await supabase
      .from('app_users')
      .select(
        'id, auth_user_id, full_name, age, email, mobile_number, role, password_hash, address, pincode, kyc_status, created_at, updated_at'
      )
      .eq(
        'mobile_number',
        cleanMobile
      )
      .maybeSingle<AppUserRow>();

    if (error) {
      throw error;
    }

    if (
      !user ||
      !(await bcrypt.compare(
        password,
        user.password_hash
      ))
    ) {

      return res.status(401).json({
        error:
          'Invalid mobile number or password.',
      });
    }

    setSessionCookie(
      res,
      user
    );

    return res.json({
      user:
        publicUser(user),
    });

  } catch (error) {

    console.error(
      'Login error:',
      error
    );

    return res.status(500).json({
      error:
        'Login failed. Please try again.',
      details:
        process.env.NODE_ENV === 'development'
          ? errorMessage(error)
          : undefined,
    });
  }
});


router.get('/me', async (req: Request, res: Response) => {

  try {

    const sessionToken =
      req.cookies?.[SESSION_COOKIE];

    if (
      !sessionToken ||
      typeof sessionToken !== 'string'
    ) {

      return res.status(401).json({
        error:
          'Not authenticated.',
      });
    }

    let payload:
      SessionPayload;

    try {

      payload =
        jwt.verify(
          sessionToken,
          JWT_SECRET
        ) as SessionPayload;

    } catch {

      clearSessionCookie(res);

      return res.status(401).json({
        error:
          'Session has expired. Please log in again.',
      });
    }

    if (!payload.sub) {

      clearSessionCookie(res);

      return res.status(401).json({
        error:
          'Invalid session.',
      });
    }

    const {
      data: user,
      error,
    } = await supabase
      .from('app_users')
      .select(
        'id, auth_user_id, full_name, age, email, mobile_number, role, password_hash, address, pincode, kyc_status, created_at, updated_at'
      )
      .eq(
        'id',
        payload.sub
      )
      .maybeSingle<AppUserRow>();

    if (error) {
      throw error;
    }

    if (!user) {

      clearSessionCookie(res);

      return res.status(401).json({
        error:
          'Account no longer exists.',
      });
    }

    return res.json({
      user:
        publicUser(user),
    });

  } catch (error) {

    console.error(
      'Session lookup error:',
      error
    );

    return res.status(500).json({
      error:
        'Could not load the current session.',
    });
  }
});

router.post(
  '/forgot-password/request',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const mobileNumber =
        normalizeMobile(
          req.body?.mobileNumber
        );

      if (
        !/^\d{10}$/.test(
          mobileNumber
        )
      ) {
        return res.status(400).json({
          error:
            'Please enter a valid 10-digit mobile number.',
        });
      }

      const {
        data: user,
        error: lookupError,
      } = await supabase
        .from('app_users')
        .select(
          'id, email'
        )
        .eq(
          'mobile_number',
          mobileNumber
        )
        .maybeSingle<{
          id: string;
          email: string | null;
        }>();

      if (lookupError) {
        throw lookupError;
      }

      if (
        !user ||
        !user.email
      ) {
        return res.status(404).json({
          error:
            'No verified account was found with this mobile number.',
        });
      }

      const {
        error: otpError,
      } =
        await supabaseAuth.auth
          .signInWithOtp({
            email: user.email,

            options: {
              shouldCreateUser:
                false,
            },
          });

      if (otpError) {
        throw otpError;
      }

      return res.json({
        maskedPhone:
          maskEmailAddress(
            user.email
          ),
      });

    } catch (error) {
      console.error(
        'Forgot password OTP error:',
        error
      );

      return res.status(500).json({
        error:
          'Could not send the verification code. Please try again.',
      });
    }
  }
);

router.post(
  '/forgot-password/verify',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const mobileNumber =
        normalizeMobile(
          req.body?.mobileNumber
        );

      const otpCode =
        String(
          req.body?.otpCode ?? ''
        ).trim();

      if (
        !/^\d{10}$/.test(
          mobileNumber
        ) ||
        !/^\d{6}$/.test(
          otpCode
        )
      ) {
        return res.status(400).json({
          error:
            'Valid mobile number and 6-digit OTP are required.',
        });
      }

      const {
        data: appUser,
        error: lookupError,
      } = await supabase
        .from('app_users')
        .select(
          'id, auth_user_id, email'
        )
        .eq(
          'mobile_number',
          mobileNumber
        )
        .maybeSingle<{
          id: string;
          auth_user_id: string | null;
          email: string | null;
        }>();

      if (lookupError) {
        throw lookupError;
      }

      if (
        !appUser ||
        !appUser.email ||
        !appUser.auth_user_id
      ) {
        return res.status(404).json({
          error:
            'Verified account was not found.',
        });
      }

      const {
        data,
        error: verifyError,
      } =
        await supabaseAuth.auth
          .verifyOtp({
            email:
              appUser.email,

            token:
              otpCode,

            type:
              'email',
          });

      if (
        verifyError ||
        !data.user
      ) {
        return res.status(401).json({
          error:
            'Invalid or expired verification code.',
        });
      }

      if (
        data.user.id !==
        appUser.auth_user_id
      ) {
        return res.status(403).json({
          error:
            'Verification account mismatch.',
        });
      }

      const resetToken =
        jwt.sign(
          {
            sub:
              appUser.id,

            purpose:
              'password_reset',
          },
          JWT_SECRET,
          {
            expiresIn:
              '10m',
          }
        );

      return res.json({
        resetToken,
      });

    } catch (error) {
      console.error(
        'Forgot password verification error:',
        error
      );

      return res.status(500).json({
        error:
          'Could not verify the code. Please try again.',
      });
    }
  }
);

router.post(
  '/forgot-password/reset',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const resetToken =
        String(
          req.body?.resetToken ?? ''
        ).trim();

      const newPassword =
        String(
          req.body?.newPassword ?? ''
        );

      if (!resetToken) {
        return res.status(401).json({
          error:
            'Password reset session is missing.',
        });
      }

      if (
        newPassword.length < 8
      ) {
        return res.status(400).json({
          error:
            'Password must contain at least 8 characters.',
        });
      }

      let payload:
        jwt.JwtPayload;

      try {
        const decoded =
          jwt.verify(
            resetToken,
            JWT_SECRET
          );

        if (
          typeof decoded ===
          'string'
        ) {
          throw new Error(
            'Invalid reset token.'
          );
        }

        payload = decoded;

      } catch {
        return res.status(401).json({
          error:
            'Password reset session has expired. Please request another OTP.',
        });
      }

      if (
        payload.purpose !==
          'password_reset' ||
        typeof payload.sub !==
          'string'
      ) {
        return res.status(401).json({
          error:
            'Invalid password reset session.',
        });
      }

      const passwordHash =
        await bcrypt.hash(
          newPassword,
          12
        );

      const {
        data: updatedUser,
        error,
      } = await supabase
        .from('app_users')
        .update({
          password_hash:
            passwordHash,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          'id',
          payload.sub
        )
        .select('id')
        .maybeSingle<{
          id: string;
        }>();

      if (error) {
        throw error;
      }

      if (!updatedUser) {
        return res.status(404).json({
          error:
            'Account was not found.',
        });
      }

      clearSessionCookie(res);

      return res
        .status(204)
        .send();

    } catch (error) {
      console.error(
        'Password reset error:',
        error
      );

      return res.status(500).json({
        error:
          'Password could not be reset. Please try again.',
      });
    }
  }
);

router.post(
  '/logout',
  (_req: Request, res: Response) => {

    clearSessionCookie(res);

    return res
      .status(204)
      .send();
  }
);


export {
  router as authRouter
};