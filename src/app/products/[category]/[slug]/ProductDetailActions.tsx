'use client';

import React from 'react';
import { MessageSquare, CheckCircle2 } from 'lucide-react';
import { useEnquiry } from '@/components/EnquiryModal';

interface ProductDetailActionsProps {
  productName: string;
  categoryName: string;
  productId: string;
}

export default function ProductDetailActions({
  productName,
  categoryName,
  productId,
}: ProductDetailActionsProps) {
  const { openEnquiry } = useEnquiry();

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Sherman International, I am interested in technical details and commercial pricing for: ${productName} (${categoryName}).`
    );
    window.open(`https://wa.me/919810024890?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* Primary CTA: Send Enquiry to Sherman */}
        <button
          onClick={() => openEnquiry(productName, categoryName, productId)}
          className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 py-3 px-6 rounded bg-navy hover:bg-sherman-900 text-white font-bold text-sm transition-colors shadow-xs"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Request Technical Proposal</span>
        </button>

        {/* WhatsApp Direct */}
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
          title="Instant WhatsApp Support"
        >
          <span>WhatsApp Desk</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Direct Sherman Engineering Desk
        </span>
        <span>•</span>
        <span>Standard OEM Warranty</span>
        <span>•</span>
        <span>Custom Application Sizing</span>
      </div>
    </div>
  );
}

