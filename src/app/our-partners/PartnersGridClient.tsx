'use client';

import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, ShieldCheck, Building2, Globe } from 'lucide-react';
import { PartnerItem } from '@/lib/partners';
import { getImageUrl, DEFAULT_BRAND_PLACEHOLDER } from '@/lib/image';

interface PartnersGridClientProps {
  initialPartners: PartnerItem[];
}

export default function PartnersGridClient({ initialPartners }: PartnersGridClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return initialPartners;
    const q = searchQuery.toLowerCase().trim();
    return initialPartners.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [initialPartners, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Controls: Search & Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search OEM partner brands..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium px-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>
            Representing <strong className="text-slate-900 font-bold">{filteredPartners.length}</strong> Global Industrial Partners
          </span>
        </div>
      </div>

      {/* Partners Logo Grid */}
      {filteredPartners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No partner brands found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No partner matching "{searchQuery}" was found. Clear your search or contact our engineering desk for specific representation queries.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredPartners.map((partner) => {
            const logoSrc = getImageUrl(partner.logo, DEFAULT_BRAND_PLACEHOLDER);

            return (
              <div
                key={partner.id}
                className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-sherman-500/70 p-5 sm:p-6 flex flex-col items-center justify-between shadow-2xs hover:shadow-lg transition-all duration-300 min-h-[170px]"
              >
                {/* Logo Frame */}
                <div className="relative w-full h-24 flex items-center justify-center p-2 rounded-xl bg-slate-50/50 group-hover:bg-white transition-colors duration-200">
                  <img
                    src={logoSrc}
                    alt={`${partner.name} Logo`}
                    loading="lazy"
                    className="max-h-20 max-w-full w-auto h-auto object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_BRAND_PLACEHOLDER;
                    }}
                  />
                </div>

                {/* Partner Name & Optional Link */}
                <div className="w-full text-center pt-3 border-t border-slate-100/90 mt-2 space-y-1">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-sherman-700 transition-colors line-clamp-1">
                    {partner.name}
                  </div>

                  {partner.websiteUrl ? (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-sherman-700 hover:text-sherman-900 hover:underline transition-colors"
                      title={`Visit ${partner.name} official site`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>Official Portal</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : partner.description ? (
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {partner.description}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
