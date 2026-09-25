'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useEnquiry } from './EnquiryModal';

export default function EnquiryCtaBanner() {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="py-16 bg-navy text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-light/40 p-8 sm:p-12 rounded-lg border border-slate-700/80 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded bg-white/10 border border-white/15">
              Direct Technical Desk
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Have an Engineering Requirement or Sizing Consultation?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect directly with Sherman International's application technocrats for technical datasheets, techno-commercial proposals, and EPC project documentation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => openEnquiry()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-sherman-600 hover:bg-sherman-500 text-white font-bold text-sm transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Technical Enquiry</span>
            </button>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors"
            >
              <span>Office & Contact Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

