# Sherman International — Administrator Authentication & Recovery Guide

## 1. Overview & Architecture

The administrative portal for Sherman International uses server-side credential verification, signed sessions, and rate-limited account recovery:
- **Authentication**: Credentials verified on the server against `AdminUser` records in PostgreSQL with `bcryptjs` hashing.
- **Session Tokens**: Cryptographically signed using HMAC-SHA256 with `ADMIN_JWT_SECRET`. Sessions include an expiry (7 days) and a database-backed `sessionVersion`.
- **Session Revocation**: Whenever an administrator changes their password or resets it, their `sessionVersion` increments in the database. All existing session tokens worldwide are instantly revoked, eliminating stale session risks.
- **Cookie Security**: `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` (in production).
- **Brute-Force Rate Limiting**: Built-in sliding-window rate limiters defend login, reset link dispatch, and token verification endpoints against brute-force attacks.

---

## 2. Standard Workflows

### A. Logging In
1. Navigate to `/admin/login`.
2. Enter your registered administrative email and password.
3. Upon successful verification, an encrypted, signed HTTP-only cookie is issued and you are directed to the dashboard.

### B. Changing Password (While Logged In)
1. Within the admin panel, click **Change Password** (located in the desktop header, left sidebar footer, or mobile drawer).
2. Enter your current password, followed by your new password (minimum 12 characters) and confirmation.
3. The server validates your current password with `bcrypt`, updates the password hash, increments `sessionVersion`, and issues a fresh session token for your current browser. All other active sessions on other computers/devices are revoked automatically.

### C. Forgot Password (Email Recovery)
1. On `/admin/login`, click **Forgot Password?**.
2. Enter your registered email address.
3. The server responds with a generic confirmation message to prevent account enumeration.
4. If the account exists, a 32-byte cryptographically secure random token is generated. Only its SHA-256 hash is stored in the database with a **30-minute expiry window**.
5. An email with a single-use reset link is sent via **Resend** to your registered email address.
6. Click the reset link (`/admin/reset-password?token=...`), enter and confirm your new password (>= 12 characters).
7. Upon submission, the token is atomically consumed (cannot be reused), the new password hash is stored, and previous sessions are revoked.

---

## 3. Emergency Authorized Recovery (If Email is Unavailable)

If the company owner loses access to their email or if DNS/email services are down, an authorized operator with direct server/infrastructure access can securely reset the credentials using the CLI tool.

### Prerequisites
- SSH or terminal access to the production host/environment.
- Environment variables configured with `DATABASE_URL`.

### Recovery Command
Run the following script from the project root:
```bash
node scripts/recover_admin.js <admin_email> "<new_secure_password>"
```

### Example
```bash
node scripts/recover_admin.js admin@sherman-india.com "NewStrongAdminPass2026!"
```

### Security Guarantees:
- Validates that the password meets the minimum length requirement (>= 12 characters).
- Computes a salt and strong `bcrypt` hash.
- Bumps `sessionVersion`, immediately kicking out any active sessions.
- Prints a security audit confirmation timestamp.
- **Never** leaves hardcoded credentials or backdoors in application source code.
