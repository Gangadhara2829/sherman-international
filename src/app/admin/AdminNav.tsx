'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Building2,
  Factory,
  Wrench,
  FileEdit,
  MessageSquare,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';
import Logo from '@/components/Logo';

interface AdminNavProps {
  session: { id: string; email: string; name: string; role: string } | null;
  children: React.ReactNode;
}

export default function AdminNav({ session, children }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, don't show admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If unauthenticated and on protected admin page, render login prompt or redirect
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">Admin Session Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please log in with your administrative credentials to manage Sherman International content.
          </p>
          <Link
            href="/admin/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Brands & Principals', href: '/admin/brands', icon: Building2 },
    { label: 'Proudly Served (Clients)', href: '/admin/clients', icon: ShieldCheck },
    { label: 'Industries', href: '/admin/industries', icon: Factory },
    { label: 'Services', href: '/admin/services', icon: Wrench },
    { label: 'Website Content', href: '/admin/content', icon: FileEdit },
    { label: 'Customer Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar (LEFT) */}
      <aside className="w-64 bg-navy text-slate-300 hidden md:flex flex-col justify-between border-r border-navy-light flex-shrink-0">
        <div>
          {/* Logo Bar */}
          <div className="p-5 border-b border-navy-light/60">
            <Logo variant="light" />
            <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Content Control Center
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sherman-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-navy-light/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sherman-700 text-white flex items-center justify-center font-bold text-xs">
                {session.name.charAt(0)}
              </div>
              <div className="truncate max-w-[120px]">
                <div className="font-bold text-white text-[11px] truncate">{session.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{session.email}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
          >
            <span>Preview Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-slate-900 capitalize font-bold">
                {pathname.replace('/admin/', '').replace('/admin', 'Dashboard') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-sherman-700 hover:underline hidden sm:flex items-center gap-1"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-600 hover:text-rose-600 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-navy text-white p-4 space-y-1 border-b border-navy-light animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Children */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
