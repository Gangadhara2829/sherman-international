'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';

function LoginForm() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
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
          <span>Authorized Administration Portal</span>
        </div>
        <p className="text-xs text-slate-500 pt-1">
          Sign in to manage products, categories, brands, enquiries, and routine website content.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Password reset successful! You can now sign in with your new password.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sherman-india.com"
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-[11px] font-bold text-sherman-700 hover:text-sherman-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Access Management Console</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <a
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Return to Public Website
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center p-4 relative overflow-hidden">
      {/* Precision background grid */}
      <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none" />
      <Suspense fallback={<div className="text-white text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
