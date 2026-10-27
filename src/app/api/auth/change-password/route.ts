import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import {
  getAdminSession,
  createSessionToken,
  ADMIN_COOKIE_NAME,
  validatePasswordStrength,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
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

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from your current password.' },
        { status: 400 }
      );
    }

    // Enforce password policy
    const policy = validatePasswordStrength(newPassword);
    if (!policy.valid) {
      return NextResponse.json({ error: policy.error }, { status: 400 });
    }

    // Verify current user & password from DB
    const user = await prisma.adminUser.findUnique({
      where: { id: session.id },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Administrator record not found.' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'The current password you entered is incorrect.' }, { status: 400 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Bump sessionVersion by 1 so all other active sessions elsewhere are immediately invalidated
    const currentVersion = (user as any).sessionVersion ?? 1;
    const nextVersion = currentVersion + 1;

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        passwordHash,
        sessionVersion: nextVersion,
      },
    });

    // Generate fresh session token with updated sessionVersion for current device
    const newToken = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sessionVersion: nextVersion,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Password successfully changed. Other active sessions have been invalidated.',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Change password failure:', error);
    return NextResponse.json(
      { error: 'Failed to change password. Please try again.' },
      { status: 500 }
    );
  }
}
