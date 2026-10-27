import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  validatePasswordStrength,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth';
import {
  verifyPasswordResetToken,
  consumePasswordResetToken,
} from '@/lib/password-reset';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

/**
 * GET: Validates whether a reset token is currently active and unexpired.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ valid: false, error: 'Reset token is required.' }, { status: 400 });
  }

  const clientIp = getClientIp(request);
  const rateLimitKey = `verify_token:${clientIp}`;
  const rateCheck = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { valid: false, error: 'Too many token verification requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  const result = await verifyPasswordResetToken(token);
  return NextResponse.json({
    valid: result.valid,
    error: result.error,
    adminEmail: result.adminEmail ? `${result.adminEmail.slice(0, 3)}***@***` : undefined,
  });
}

/**
 * POST: Resets the password using a valid token.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, newPassword, confirmPassword } = body;

    const clientIp = getClientIp(request);
    const rateLimitKey = `reset_attempt:${clientIp}`;

    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many password reset attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Reset token is required.' }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ error: 'New password is required.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    // Enforce password policy
    const policy = validatePasswordStrength(newPassword);
    if (!policy.valid) {
      return NextResponse.json({ error: policy.error }, { status: 400 });
    }

    // Verify token first
    const verification = await verifyPasswordResetToken(token);
    if (!verification.valid) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    // Hash new password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Consume token, update password, and revoke previous sessions
    const consumeResult = await consumePasswordResetToken(token, passwordHash);
    if (!consumeResult.success) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: consumeResult.error || 'Failed to update credentials. Please request a new link.' },
        { status: 400 }
      );
    }

    // Clear rate limiter
    resetRateLimit(rateLimitKey);

    const response = NextResponse.json({
      success: true,
      message: 'Password successfully updated. You may now sign in with your new credentials.',
    });

    // Clear any existing session cookie
    response.cookies.delete(ADMIN_COOKIE_NAME);

    return response;
  } catch (error: any) {
    console.error('Password reset failure:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or contact support.' },
      { status: 500 }
    );
  }
}
