'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ShieldCheck, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center p-4 relative overflow-hidden">
      {/* Precision background grid */}
      <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sherman-50 border border-sherman-200 text-sherman-800 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-sherman-600" />
            <span>Account Recovery</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 pt-1">
            Forgot Admin Password?
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter your registered administrator email address and we will dispatch a secure, single-use password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Recovery Request Dispatched</span>
              </div>
              <p className="leading-relaxed">
                If an authorized administrative account is associated with <strong>{email}</strong>, a password reset link has been dispatched. Please check your inbox and spam folder.
              </p>
              <p className="text-[11px] text-emerald-700">
                For security reasons, the link will automatically expire in 30 minutes.
              </p>
            </div>

            <Link
              href="/admin/login"
              className="w-full py-3 px-4 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Admin Login</span>
            </Link>
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
                Registered Admin Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing request...</span>
                </>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/admin/login"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
