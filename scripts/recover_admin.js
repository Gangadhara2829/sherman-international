#!/usr/bin/env node
/**
 * scripts/recover_admin.js
 * 
 * Authorized Offline Administrator Password Recovery Tool
 * Sherman International (P) Limited
 * 
 * SECURITY NOTICE:
 * This script is intended strictly for authorized company owners or database administrators
 * with direct infrastructure access to recover an administrator account when email recovery
 * is inaccessible or misconfigured.
 * 
 * Usage:
 *   node scripts/recover_admin.js <email> <newPassword>
 * 
 * Example:
 *   node scripts/recover_admin.js admin@sherman-india.com "YourSecureNewPassword2026!"
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Load .env if present
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: dbUrl ? { db: { url: dbUrl } } : undefined
});

async function recover() {
  const emailArg = process.argv[2];
  const newPasswordArg = process.argv[3];

  if (!emailArg || !newPasswordArg) {
    console.error('--- Authorized Admin Password Recovery Tool ---');
    console.error('Error: Missing required parameters.');
    console.error('Usage: node scripts/recover_admin.js <admin_email> <new_password>');
    console.error('Note: Password must be at least 12 characters.');
    process.exit(1);
  }

  const cleanEmail = emailArg.toLowerCase().trim();
  const newPassword = newPasswordArg.trim();

  if (newPassword.length < 12) {
    console.error('Security Policy Error: Password must be at least 12 characters in length.');
    process.exit(1);
  }

  console.log(`[Audit] Searching for admin record: "${cleanEmail}"...`);

  const admin = await prisma.adminUser.findUnique({
    where: { email: cleanEmail },
  });

  if (!admin) {
    console.error(`Error: No administrator found with email: "${cleanEmail}".`);
    process.exit(1);
  }

  console.log(`[Audit] Verified admin account ID: ${admin.id} (${admin.name})`);
  console.log('[Audit] Generating secure bcrypt hash (salt rounds: 10)...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);
  const nextSessionVersion = ((admin.sessionVersion || 1) + 1);

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      passwordHash,
      sessionVersion: nextSessionVersion,
      updatedAt: new Date(),
    },
  });

  console.log('----------------------------------------------------');
  console.log('✓ SUCCESS: Administrator credentials successfully updated.');
  console.log(`✓ Email: ${admin.email}`);
  console.log(`✓ Session Version: ${nextSessionVersion} (all previous sessions revoked)`);
  console.log(`✓ Timestamp: ${new Date().toISOString()}`);
  console.log('----------------------------------------------------');
  console.log('Action complete. The administrator can now log in at /admin/login.');
}

recover()
  .catch((err) => {
    console.error('[Error] Recovery failed:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
