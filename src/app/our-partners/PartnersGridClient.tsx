'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { PartnerItem } from '@/lib/partners-types';
import { getImageUrl, DEFAULT_BRAND_PLACEHOLDER } from '@/lib/image';

interface PartnersGridClientProps {
  initialPartners: PartnerItem[];
}

export default function PartnersGridClient({ initialPartners }: PartnersGridClientProps) {
  if (initialPartners.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 sm:p-16 text-center space-y-4 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">Partner Directory In Progress</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Our partner and principal network directory is currently being updated. Please check back shortly or explore our product catalog.
          </p>
        </div>
        <div className="pt-2">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {initialPartners.map((partner) => {
        const logoSrc = getImageUrl(partner.logo, DEFAULT_BRAND_PLACEHOLDER);

        const cardInner = (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={logoSrc}
              alt={partner.name ? `${partner.name} Logo` : 'Partner Logo'}
              loading="lazy"
              className="max-h-24 sm:max-h-28 max-w-[85%] w-auto h-auto object-contain object-center transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_BRAND_PLACEHOLDER;
              }}
            />
          </div>
        );

        if (partner.websiteUrl) {
          return (
            <a
              key={partner.id}
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.name}
              className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-sherman-500/70 h-36 sm:h-40 flex items-center justify-center shadow-2xs hover:shadow-md transition-all duration-300"
            >
              {cardInner}
            </a>
          );
        }

        return (
          <div
            key={partner.id}
            title={partner.name}
            className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-sherman-500/70 h-36 sm:h-40 flex items-center justify-center shadow-2xs hover:shadow-md transition-all duration-300"
          >
            {cardInner}
          </div>
        );
      })}
    </div>
  );
}

