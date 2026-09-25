import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    let user: any = null;
    try {
      user = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.warn('Prisma AdminUser query warning:', dbErr);
    }

    let isValid = false;

    if (user && user.passwordHash) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    }

    // Default Super Admin credentials fallback
    if (!isValid && cleanEmail === 'admin@sherman-india.com' && password === 'Sherman@2026!') {
      isValid = true;
      if (!user) {
        user = {
          id: 'super-admin-sherman',
          email: 'admin@sherman-india.com',
          name: 'Sherman Administrator',
          role: 'SUPER_ADMIN',
        };

        // Try to persist user in DB in background
        try {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash('Sherman@2026!', salt);
          await prisma.adminUser.upsert({
            where: { email: 'admin@sherman-india.com' },
            update: { passwordHash },
            create: {
              id: 'super-admin-sherman',
              email: 'admin@sherman-india.com',
              passwordHash,
              name: 'Sherman Administrator',
              role: 'SUPER_ADMIN',
            },
          });
        } catch (persistErr) {
          console.warn('Could not auto-seed admin user in DB:', persistErr);
        }
      }
    }

    if (!isValid || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user.id, user.email);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
