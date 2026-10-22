import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Handshake } from 'lucide-react';
import { getPartners } from '@/lib/partners';
import PartnersGridClient from './PartnersGridClient';

export const metadata = {
  title: 'Our Partners & Global Principals | Sherman International',
  description:
    'Explore leading international industrial equipment manufacturers and technology partners officially represented in India by Sherman International (P) Limited.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OurPartnersPage() {
  const partners = await getPartners({ includeInactive: false });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">Our Partners</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-2xl bg-navy text-white p-8 sm:p-12 mb-10 border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sherman-700/15 to-transparent pointer-events-none" />
          <div className="relative max-w-3xl space-y-3 z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 px-3 py-1 rounded-full bg-white/10 border border-white/15 inline-flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Strategic Industrial Partnerships
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Our Partners &amp; Principals
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Sherman International acts as a strategic technical channel partner and authorized representative for premier global instrumentation and equipment manufacturers across process industries in India.
            </p>
          </div>
        </div>

        {/* Dynamic Partner Logo Grid */}
        <PartnersGridClient initialPartners={partners} />
      </div>
    </div>
  );
}
