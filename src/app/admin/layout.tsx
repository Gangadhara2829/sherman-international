import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
  ShieldCheck,
} from 'lucide-react';
import { getAdminSession } from '@/lib/auth';
import Logo from '@/components/Logo';
import AdminNav from './AdminNav';

export const metadata = {
  title: 'Admin Dashboard | Sherman International',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If viewing admin route (except login), verify session
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased font-sans">
      <AdminNav session={session}>
        {children}
      </AdminNav>
    </div>
  );
}
