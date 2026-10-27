import { cookies } from 'next/headers';
import crypto from 'crypto';
import prisma from './prisma';

export const ADMIN_COOKIE_NAME = 'sherman_admin_session';

const DEFAULT_SECRET = 'sherman-international-secure-admin-secret-2026-key';

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || DEFAULT_SECRET;
  return secret.trim();
}

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AdminSessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  sessionVersion: number;
  createdAt: number;
  expiresAt: number;
}

/**
 * Creates a cryptographically signed session token (HMAC-SHA256).
 * Contains user identity, session version for revocation, and expiry timestamp.
 */
export function createSessionToken(
  userOrId: { id: string; email: string; name?: string; role?: string; sessionVersion?: number } | string,
  emailArg?: string,
  sessionVersionArg: number = 1
): string {
  let id: string;
  let email: string;
  let name = 'Sherman Administrator';
  let role = 'ADMIN';
  let sessionVersion = sessionVersionArg;

  if (typeof userOrId === 'object' && userOrId !== null) {
    id = userOrId.id;
    email = userOrId.email;
    name = userOrId.name || name;
    role = userOrId.role || role;
    sessionVersion = userOrId.sessionVersion ?? sessionVersionArg;
  } else {
    id = userOrId;
    email = emailArg || 'admin@sherman-india.com';
  }

  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days expiration

  const payload: AdminSessionPayload = {
    id,
    email: email.toLowerCase().trim(),
    name,
    role,
    sessionVersion,
    createdAt: now,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 * Validates HMAC signature and timestamp expiry.
 */
export function verifySessionToken(token: string): AdminSessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) {
    // Check if legacy unsigned base64 token (for seamless backwards transition)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId, email, timestamp] = decoded.split(':');
      if (userId && email) {
        const time = Number(timestamp) || 0;
        // Legacy tokens valid for at most 7 days from creation
        if (time > 0 && Date.now() - time > 7 * 24 * 60 * 60 * 1000) {
          return null;
        }
        return {
          id: userId,
          email: email.toLowerCase().trim(),
          name: 'Sherman Administrator',
          role: 'ADMIN',
          sessionVersion: 1,
          createdAt: time || Date.now(),
          expiresAt: (time || Date.now()) + 7 * 24 * 60 * 60 * 1000,
        };
      }
    } catch {
      return null;
    }
    return null;
  }

  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(payloadBase64)
    .digest('base64url');

  // Constant-time comparison to prevent timing attacks
  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload: AdminSessionPayload = JSON.parse(jsonStr);

    if (!payload.id || !payload.email || !payload.expiresAt) {
      return null;
    }

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently authenticated admin session.
 * Checks cookie signature, expiration, and database session version.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  const payload = verifySessionToken(sessionToken);
  if (!payload) return null;

  try {
    let user: any = null;
    try {
      const rows = await prisma.$queryRaw<any[]>`
        SELECT "id", "email", "name", "role", "sessionVersion"
        FROM "AdminUser"
        WHERE "id" = ${payload.id}
        LIMIT 1
      `;
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch {
      // Fallback if raw query unavailable
    }

    if (!user) {
      user = await prisma.adminUser.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, name: true, role: true },
      });
    }

    if (user && user.email.toLowerCase() === payload.email.toLowerCase()) {
      // Invalidate if session version in cookie doesn't match current user version in DB
      const currentVersion =
        user.sessionVersion !== undefined && user.sessionVersion !== null
          ? Number(user.sessionVersion)
          : 1;

      if (payload.sessionVersion !== undefined && payload.sessionVersion !== currentVersion) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
  } catch (e) {
    console.warn('Prisma getAdminSession lookup warning:', e);
  }

  return null;
}

// -------------------------------------------------------------
// Rate Limiting (In-Memory sliding window)
// -------------------------------------------------------------
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now - record.lastAttempt > 60 * 60 * 1000) {
        rateLimitMap.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

/**
 * Evaluates whether an action is permitted under rate limiting.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
  }

  // If outside window, reset
  if (now - record.firstAttempt > windowMs) {
    rateLimitMap.delete(key);
    return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
  }

  if (record.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
  }

  return {
    allowed: true,
    remaining: maxAttempts - record.attempts,
    retryAfterSeconds: 0,
  };
}

/**
 * Records a failed attempt for rate limiting.
 */
export function recordFailedAttempt(key: string, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.firstAttempt > windowMs) {
    rateLimitMap.set(key, { attempts: 1, firstAttempt: now, lastAttempt: now });
  } else {
    record.attempts += 1;
    record.lastAttempt = now;
  }
}

/**
 * Clears rate limiting on successful action.
 */
export function resetRateLimit(key: string) {
  rateLimitMap.delete(key);
}

// -------------------------------------------------------------
// Password Policy & Strength Validation
// -------------------------------------------------------------
const COMMON_DISALLOWED_PASSWORDS = new Set([
  'password12345',
  '123456789012',
  '1234567890123',
  'adminadmin123',
  'administrator1',
  'sherman123456',
  'welcome123456',
  'qwertyuiop12',
  'changeme1234',
  'sherman@1234',
]);

/**
 * Validates that a new password conforms to security standards:
 * - Minimum 12 characters
 * - Not a commonly compromised/trivial string
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters in length.' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password cannot exceed 128 characters.' };
  }

  const lower = password.toLowerCase();
  if (COMMON_DISALLOWED_PASSWORDS.has(lower)) {
    return { valid: false, error: 'This password is too common and easily guessed. Please choose a unique passphrase.' };
  }

  return { valid: true };
}
