'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  websiteUrl: string | null;
}

interface BrandCarouselProps {
  brands: BrandItem[];
}

export default function BrandCarousel({ brands }: BrandCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Global Technology Principals
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Represented OEM Brands & Partners
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              aria-label="Previous brand"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              aria-label="Next brand"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/brands"
              className="ml-2 text-xs font-semibold text-sherman-700 hover:text-sherman-900 px-2.5 py-1.5 rounded bg-slate-100"
            >
              View All Brands
            </Link>
          </div>
        </div>

        {/* Brand Cards Grid / Scroll */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex-shrink-0 w-72 p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-slate-900">
                    {brand.name}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {brand.description || 'International engineering principal represented across India.'}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="text-xs font-semibold text-sherman-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>View Equipment Range</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
