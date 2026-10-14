import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Images, ArrowRight, ShieldCheck } from 'lucide-react';
import { getGalleryItems, getGalleryCategories } from '@/lib/gallery';
import GalleryGridClient from './GalleryGridClient';

export const metadata: Metadata = {
  title: 'Corporate Gallery | Sherman International (P) Limited',
  description:
    'Explore Sherman International corporate gallery showcasing genuine industrial equipment, manufacturing facilities, engineering projects, and on-site commissioning across India.',
  openGraph: {
    title: 'Corporate Gallery | Sherman International (P) Limited',
    description:
      'Explore Sherman International corporate gallery showcasing genuine industrial equipment, manufacturing facilities, engineering projects, and on-site commissioning across India.',
  },
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems({ includeUnpublished: false }),
    getGalleryCategories(),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-[#031229] text-white border-b border-slate-800 relative overflow-hidden py-14 sm:py-20">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sherman-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-amber-400 font-semibold">Corporate Gallery</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sherman-500/20 border border-sherman-400/30 text-sherman-300 text-xs font-bold uppercase tracking-wider">
              <Images className="w-3.5 h-3.5" />
              <span>Engineering &amp; Infrastructure Showcase</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              Corporate Gallery
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              A curated visual portfolio showcasing Sherman International's specialized engineering capabilities, high-precision industrial instrumentation, assembly facilities, and turnkey project commissioning.
            </p>
          </div>
        </div>
      </div>

      {/* Main Gallery Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <GalleryGridClient initialItems={items} availableCategories={categories} />

        {/* Bottom CTA Card */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-sherman-700">
              <ShieldCheck className="w-4 h-4 text-sherman-600" />
              <span>Trusted Industrial Engineering Partner</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Looking for Specialized Industrial Solutions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              From flow measurement and combustion safety to dynamic balancing and railway electrification, Sherman International engineers are ready to support your facility.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <span>Consult Our Engineers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
