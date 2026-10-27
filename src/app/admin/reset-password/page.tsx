'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setTokenValid(false);
      setTokenError('Password reset token is missing from the link. Please request a new reset email.');
      return;
    }

    // Verify token validity with backend
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenError(data.error || 'This password reset link is invalid or has expired.');
        }
      })
      .catch(() => {
        setTokenValid(false);
        setTokenError('Failed to verify reset token. Please try again or request a new link.');
      })
      .finally(() => {
        setValidating(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login?reset=success');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during password update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sherman-50 border border-sherman-200 text-sherman-800 text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-sherman-600" />
          <span>Security Reset</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 pt-1">
          Set New Admin Password
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Create a strong, unique password to secure your administrator access.
        </p>
      </div>

      {validating ? (
        <div className="py-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-sherman-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            Verifying security token validity...
          </p>
        </div>
      ) : !tokenValid ? (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-medium space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Invalid or Expired Link</span>
            </div>
            <p className="leading-relaxed">{tokenError}</p>
          </div>

          <Link
            href="/admin/forgot-password"
            className="w-full py-3 px-4 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Request New Reset Link</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="text-center pt-2">
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : success ? (
        <div className="space-y-4 animate-in fade-in py-4 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Password Successfully Updated</h3>
            <p className="text-xs text-slate-500">Redirecting to administrator login...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              New Password (minimum 12 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && newPassword.length < 12 && (
              <span className="text-[11px] text-amber-600 mt-1 block">
                {12 - newPassword.length} more characters needed
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 leading-relaxed">
            Updating your password will immediately terminate all other active login sessions for this account.
          </div>

          <button
            type="submit"
            disabled={loading || newPassword.length < 12 || newPassword !== confirmPassword}
            className="w-full py-3 px-4 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating password...</span>
              </>
            ) : (
              <>
                <span>Update Password &amp; Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center p-4 relative overflow-hidden">
      {/* Precision background grid */}
      <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none" />
      <Suspense fallback={<div className="text-white text-xs">Loading reset page...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
