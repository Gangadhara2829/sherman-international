'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import SafeImage from './SafeImage';
import { DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface CategoryWithProducts {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  products: {
    id: string;
    name: string;
    slug: string;
    brandName?: string | null;
    shortDescription?: string | null;
  }[];
}

interface ProductsMegaMenuProps {
  categories: CategoryWithProducts[];
  onClose: () => void;
}

export default function ProductsMegaMenu({ categories, onClose }: ProductsMegaMenuProps) {
  const [activeSlug, setActiveSlug] = useState<string>(
    categories.length > 0 ? categories[0].slug : ''
  );

  const activeCategory = categories.find((c) => c.slug === activeSlug) || categories[0];

  if (!categories || categories.length === 0) return null;

  return (
    <div
      className="absolute top-full left-0 w-full bg-white shadow-xl border-b border-slate-200 z-50"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 min-h-[340px]">
          {/* COLUMN 1: Categories List (LEFT - 4 cols) */}
          <div className="col-span-4 border-r border-slate-200 pr-4 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Categories ({categories.length})</span>
            </div>

            <div className="space-y-0.5 max-h-[290px] overflow-y-auto pr-1 pt-1">
              {categories.map((cat) => {
                const isActive = cat.slug === (activeCategory?.slug || '');
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveSlug(cat.slug)}
                    onClick={() => setActiveSlug(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-navy text-white shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="pt-2 px-3">
              <Link
                href="/products"
                onClick={onClose}
                className="text-xs font-bold text-sherman-700 hover:text-sherman-900 inline-flex items-center gap-1"
              >
                <span>View All Products &amp; Brands</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* COLUMN 2: Products within selected Category (MIDDLE - 5 cols) */}
          <div className="col-span-5 border-r border-slate-200 pr-4">
            {activeCategory && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {activeCategory.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {activeCategory.description || 'Specialized Instrumentation & Components'}
                    </p>
                  </div>

                  <Link
                    href={`/products/${activeCategory.slug}`}
                    onClick={onClose}
                    className="text-xs font-semibold text-sherman-700 hover:underline flex-shrink-0"
                  >
                    View Category &rarr;
                  </Link>
                </div>

                <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                  {activeCategory.products && activeCategory.products.length > 0 ? (
                    activeCategory.products.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${activeCategory.slug}/${prod.slug}`}
                        onClick={onClose}
                        className="block p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-sherman-700">
                            {prod.name}
                          </span>
                          {prod.brandName && (
                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {prod.brandName}
                            </span>
                          )}
                        </div>
                        {prod.shortDescription && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {prod.shortDescription}
                          </p>
                        )}
                      </Link>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 p-4 border border-dashed rounded text-center">
                      Browse technical documentation and products for this category.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 3: Technical Support / Consultation (RIGHT - 3 cols) */}
          <div className="col-span-3 pl-2 flex flex-col justify-between">
            {activeCategory && (
              <div className="h-full flex flex-col justify-between bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="space-y-3">
                  <div className="relative h-28 w-full rounded overflow-hidden bg-slate-200 border border-slate-200">
                    <SafeImage
                      src={
                        activeCategory.image ||
                        '/images/original/flow-measurement_ed663c7d9abc4a20a139cafedc21f016.jpg'
                      }
                      fallbackSrc="/images/original/flow-measurement_ed663c7d9abc4a20a139cafedc21f016.jpg"
                      alt={activeCategory.name}
                      fill
                      className="object-cover"
                      sizes="250px"
                    />
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-xs text-slate-900">Technical Sizing &amp; Consulting</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Our application engineers assist with process parameters, documentation compliance, and EPC skid integration.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <Link
                    href={`/contact?subject=${encodeURIComponent('Enquiry: ' + activeCategory.name)}`}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold text-white bg-navy hover:bg-sherman-800 transition-colors"
                  >
                    <span>Request Technical Sizing</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
