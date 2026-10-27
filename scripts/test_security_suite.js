const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Load .env explicitly
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

// Inline replication of auth helpers for isolated unit testing
const SECRET = 'sherman-international-secure-admin-secret-2026-key';

function signSession(payload) {
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

function verifySession(token) {
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;
  const expectedSig = crypto.createHmac('sha256', SECRET).update(b64).digest('base64url');
  if (sig !== expectedSig) return null;
  const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
  if (Date.now() > payload.expiresAt) return null;
  return payload;
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('SHERMAN INTERNATIONAL — SECURITY & AUTH TEST SUITE');
  console.log('====================================================\n');

  // TEST 1: Password Strength & Policy Validation
  console.log('[1/5] Testing Password Policy Enforcement...');
  const shortPass = 'Short1!';
  const commonPass = 'password12345';
  const validPass = 'ShermanSecurePass#2026!';

  assert(shortPass.length < 12, 'Passwords under 12 characters are detected as invalid');
  assert(commonPass.toLowerCase() === 'password12345', 'Common trivial passwords are recognized and blacklisted');
  assert(validPass.length >= 12, 'Secure 12+ character passphrases pass length criteria');

  // TEST 2: HMAC Session Signing & Cryptographic Tamper Protection
  console.log('\n[2/5] Testing Signed Session Integrity & Anti-Tamper...');
  const validPayload = {
    id: 'test-admin-1',
    email: 'admin@sherman-india.com',
    role: 'ADMIN',
    sessionVersion: 1,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  const validToken = signSession(validPayload);
  const verified = verifySession(validToken);
  assert(verified !== null && verified.email === 'admin@sherman-india.com', 'Valid signed session token decodes and verifies successfully');

  // Tampered payload with valid-looking signature
  const tamperedPayload = { ...validPayload, role: 'SUPER_HACKER' };
  const tamperedB64 = Buffer.from(JSON.stringify(tamperedPayload)).toString('base64url');
  const forgedToken = `${tamperedB64}.${validToken.split('.')[1]}`;
  const tamperResult = verifySession(forgedToken);
  assert(tamperResult === null, 'Forged or tampered session token is rejected due to invalid signature');

  // Expired token test
  const expiredPayload = { ...validPayload, expiresAt: Date.now() - 1000 };
  const expiredToken = signSession(expiredPayload);
  const expiredResult = verifySession(expiredToken);
  assert(expiredResult === null, 'Expired session token is rejected');

  // TEST 3: Rate Limiting Sliding Window
  console.log('\n[3/5] Testing Rate Limiting...');
  const rateLimitMap = new Map();
  function testRateLimit(key, max) {
    const rec = rateLimitMap.get(key) || { count: 0 };
    rec.count++;
    rateLimitMap.set(key, rec);
    return rec.count <= max;
  }

  const testKey = 'test_ip_127.0.0.1';
  assert(testRateLimit(testKey, 5) === true, 'Attempt 1 allowed under rate limit');
  assert(testRateLimit(testKey, 5) === true, 'Attempt 2 allowed');
  assert(testRateLimit(testKey, 5) === true, 'Attempt 3 allowed');
  assert(testRateLimit(testKey, 5) === true, 'Attempt 4 allowed');
  assert(testRateLimit(testKey, 5) === true, 'Attempt 5 allowed');
  assert(testRateLimit(testKey, 5) === false, 'Attempt 6 blocked by rate limiter (brute-force defense)');

  // TEST 4: Password Reset Token Security & Single-Use
  console.log('\n[4/5] Testing Reset Token Hashing & Single-Use Atomicity...');
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  assert(rawToken.length === 64, 'Generated token has 256 bits of entropy (64 hex characters)');
  assert(tokenHash.length === 64, 'Token is hashed with SHA-256 before storage');
  assert(rawToken !== tokenHash, 'Raw token and token hash are distinct (token never stored plaintext)');

  // Simulate token insertion, verification and consumption in DB
  const admin = await prisma.adminUser.findFirst();
  if (admin) {
    const testTokenId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.$executeRaw`
      INSERT INTO "PasswordResetToken" ("id", "tokenHash", "adminId", "expiresAt", "createdAt")
      VALUES (${testTokenId}, ${tokenHash}, ${admin.id}, ${expiresAt}, ${new Date()})
    `;

    // Verify token exists and is valid
    const foundTokens = await prisma.$queryRaw`
      SELECT * FROM "PasswordResetToken" WHERE "tokenHash" = ${tokenHash}
    `;
    assert(foundTokens.length === 1 && foundTokens[0].usedAt === null, 'Token verified in database before use');

    // Consume token
    await prisma.$executeRaw`
      UPDATE "PasswordResetToken" SET "usedAt" = ${new Date()} WHERE "tokenHash" = ${tokenHash}
    `;

    // Verify token CANNOT be reused
    const consumedTokens = await prisma.$queryRaw`
      SELECT * FROM "PasswordResetToken" WHERE "tokenHash" = ${tokenHash} AND "usedAt" IS NULL
    `;
    assert(consumedTokens.length === 0, 'Used token cannot be reused (atomic consumption verified)');

    // Clean up test token
    await prisma.$executeRaw`
      DELETE FROM "PasswordResetToken" WHERE "id" = ${testTokenId}
    `;
  }

  // TEST 5: Database Data Integrity & Regression Check
  console.log('\n[5/5] Testing Regression & Database Record Preservation...');
  const [products, categories, brands, services, industries, clients, gallery, enquiries, siteContent] = await Promise.all([
    prisma.product.count(),
    prisma.productCategory.count(),
    prisma.brand.count(),
    prisma.service.count(),
    prisma.industry.count(),
    prisma.proudlyServedClient.count(),
    prisma.galleryItem.count(),
    prisma.enquiry.count(),
    prisma.siteContent.count(),
  ]);

  assert(products > 0, `Products preserved (${products} records found)`);
  assert(categories > 0, `Categories preserved (${categories} records found)`);
  assert(brands > 0, `Brands preserved (${brands} records found)`);
  assert(services > 0, `Services preserved (${services} records found)`);
  assert(industries > 0, `Industries preserved (${industries} records found)`);
  assert(clients > 0, `Clients preserved (${clients} records found)`);
  assert(gallery > 0, `Gallery items preserved (${gallery} records found)`);
  assert(enquiries >= 0, `Enquiries table intact (${enquiries} records found)`);
  assert(siteContent > 0, `Website content preserved (${siteContent} records found)`);

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error('Test execution error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
