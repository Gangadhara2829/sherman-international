import { NextResponse } from 'next/server';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/auth';
import { createPasswordResetToken } from '@/lib/password-reset';
import { sendPasswordResetEmail } from '@/lib/email';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

function resolveAppBaseUrl(request: Request): string {
  // 1. Configured canonical site URL takes precedence
  if (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim()) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/+$/, '');
  }

  // 2. Vercel deployment URL
  if (process.env.VERCEL_URL && process.env.VERCEL_URL.trim()) {
    const vUrl = process.env.VERCEL_URL.trim();
    return vUrl.startsWith('http') ? vUrl.replace(/\/+$/, '') : `https://${vUrl.replace(/\/+$/, '')}`;
  }

  // 3. Fallback to host header only if strictly valid domain or localhost
  try {
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  } catch {
    return 'http://localhost:3000';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const clientIp = getClientIp(request);
    const rateLimitKey = `forgot:${cleanEmail}:${clientIp}`;

    // Rate limiting: maximum 3 reset requests per 15 minutes
    const rateCheck = checkRateLimit(rateLimitKey, 3, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many password reset requests. Please wait ${rateCheck.retryAfterSeconds} seconds before requesting again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    recordFailedAttempt(rateLimitKey, 15 * 60 * 1000);

    // Generic response message returned whether email exists or not to prevent account enumeration
    const genericResponse = {
      success: true,
      message:
        'If an authorized account is registered with this email, a single-use password reset link has been dispatched. Please check your inbox.',
    };

    // Attempt to generate token (returns null if account not found)
    const tokenResult = await createPasswordResetToken(cleanEmail);

    if (tokenResult) {
      const baseUrl = resolveAppBaseUrl(request);
      const resetUrl = `${baseUrl}/admin/reset-password?token=${encodeURIComponent(tokenResult.rawToken)}`;

      // Send email via existing Resend integration
      await sendPasswordResetEmail({
        to: tokenResult.adminEmail,
        adminName: tokenResult.adminName,
        resetUrl,
        expiresInMinutes: 30,
      });
    }

    return NextResponse.json(genericResponse);
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      {
        success: true,
        message:
          'If an authorized account is registered with this email, a single-use password reset link has been dispatched. Please check your inbox.',
      },
      { status: 200 }
    );
  }
}
