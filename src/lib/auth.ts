import { cookies } from 'next/headers';
import prisma from './prisma';

const ADMIN_COOKIE_NAME = 'sherman_admin_session';

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  try {
    // Decoded token format: "userId:email:timestamp"
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [userId, email] = decoded.split(':');

    if (!userId || !email) return null;

    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user || user.email !== email) return null;

    return user;
  } catch (error) {
    return null;
  }
}

export function createSessionToken(userId: string, email: string): string {
  const payload = `${userId}:${email}:${Date.now()}`;
  return Buffer.from(payload).toString('base64');
}

export { ADMIN_COOKIE_NAME };
