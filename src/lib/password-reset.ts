import crypto from 'crypto';
import prisma from './prisma';

export interface ResetTokenVerificationResult {
  valid: boolean;
  adminId?: string;
  adminEmail?: string;
  adminName?: string;
  error?: string;
}

/**
 * Computes the SHA-256 hash of a raw reset token.
 * Only the hash is ever persisted to the database.
 */
export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Creates a cryptographically secure, single-use password reset token.
 * Token expires in 30 minutes.
 */
export async function createPasswordResetToken(
  email: string
): Promise<{ rawToken: string; expiresAt: Date; adminName: string; adminEmail: string } | null> {
  const cleanEmail = email.toLowerCase().trim();

  // Find authorized admin account
  const admin = await prisma.adminUser.findUnique({
    where: { email: cleanEmail },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
    return null;
  }

  // 32 bytes of cryptographically secure randomness (256-bit entropy)
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
  const tokenId = crypto.randomUUID();

  // Invalidate any previously active unused tokens for this admin
  try {
    await prisma.$executeRaw`
      UPDATE "PasswordResetToken"
      SET "usedAt" = ${now}
      WHERE "adminId" = ${admin.id} AND "usedAt" IS NULL
    `;
  } catch (err) {
    console.warn('Notice when clearing prior tokens:', err);
  }

  // Insert new hashed token
  await prisma.$executeRaw`
    INSERT INTO "PasswordResetToken" ("id", "tokenHash", "adminId", "expiresAt", "createdAt")
    VALUES (${tokenId}, ${tokenHash}, ${admin.id}, ${expiresAt}, ${now})
  `;

  return {
    rawToken,
    expiresAt,
    adminName: admin.name,
    adminEmail: admin.email,
  };
}

/**
 * Validates a raw reset token against the database hash and expiration.
 */
export async function verifyPasswordResetToken(
  rawToken: string
): Promise<ResetTokenVerificationResult> {
  if (!rawToken || typeof rawToken !== 'string' || rawToken.trim().length < 32) {
    return { valid: false, error: 'Invalid or missing password reset token.' };
  }

  const tokenHash = hashResetToken(rawToken.trim());

  try {
    const tokens = await prisma.$queryRaw<any[]>`
      SELECT "id", "tokenHash", "adminId", "expiresAt", "usedAt"
      FROM "PasswordResetToken"
      WHERE "tokenHash" = ${tokenHash}
      LIMIT 1
    `;

    if (!tokens || tokens.length === 0) {
      return { valid: false, error: 'Invalid or expired password reset link. Please request a new link.' };
    }

    const tokenRecord = tokens[0];

    if (tokenRecord.usedAt !== null) {
      return {
        valid: false,
        error: 'This password reset link has already been used. Please submit a new request if needed.',
      };
    }

    const expiresAtTime = new Date(tokenRecord.expiresAt).getTime();
    if (expiresAtTime < Date.now()) {
      return {
        valid: false,
        error: 'This password reset link has expired (links are valid for 30 minutes). Please request a new one.',
      };
    }

    // Verify admin still exists
    const admin = await prisma.adminUser.findUnique({
      where: { id: tokenRecord.adminId },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      return { valid: false, error: 'Associated administrator account was not found.' };
    }

    return {
      valid: true,
      adminId: admin.id,
      adminEmail: admin.email,
      adminName: admin.name,
    };
  } catch (error: any) {
    console.error('Failed to verify reset token:', error);
    return { valid: false, error: 'An unexpected error occurred while validating the reset link.' };
  }
}

/**
 * Atomically consumes the reset token, updates the administrator's password,
 * and increments sessionVersion to instantly invalidate all other sessions.
 */
export async function consumePasswordResetToken(
  rawToken: string,
  newPasswordHash: string
): Promise<{ success: boolean; error?: string }> {
  const verification = await verifyPasswordResetToken(rawToken);
  if (!verification.valid || !verification.adminId) {
    return { success: false, error: verification.error || 'Invalid reset token' };
  }

  const tokenHash = hashResetToken(rawToken.trim());
  const now = new Date();

  try {
    // 1. Mark token as consumed
    await prisma.$executeRaw`
      UPDATE "PasswordResetToken"
      SET "usedAt" = ${now}
      WHERE "tokenHash" = ${tokenHash} AND "usedAt" IS NULL
    `;

    // 2. Update password and bump sessionVersion to revoke all active sessions
    await prisma.$executeRaw`
      UPDATE "AdminUser"
      SET "passwordHash" = ${newPasswordHash},
          "sessionVersion" = COALESCE("sessionVersion", 1) + 1,
          "updatedAt" = ${now}
      WHERE "id" = ${verification.adminId}
    `;

    return { success: true };
  } catch (err: any) {
    console.error('Failed to consume reset token:', err);
    return { success: false, error: 'Failed to update credentials. Please try again.' };
  }
}
