'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { Search, ArrowRight, MessageSquare, Package } from 'lucide-react';
import { useEnquiry } from '@/components/EnquiryModal';
import { DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  image: string | null;
  isFeatured: boolean;
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string } | null;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
}

interface ProductCatalogClientProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  brands: BrandItem[];
}

export default function ProductCatalogClient({
  initialProducts,
  categories,
  brands,
}: ProductCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { openEnquiry } = useEnquiry();

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchCategory =
        selectedCategory === 'all' || (p.category && p.category.slug === selectedCategory);
      const matchBrand =
        selectedBrand === 'all' || (p.brand && p.brand.slug === selectedBrand);
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDescription &&
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchBrand && matchSearch;
    });
  }, [initialProducts, selectedCategory, selectedBrand, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search + Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product models, technologies, keywords..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:bg-white focus:border-navy focus:ring-1 focus:ring-navy outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 outline-none focus:border-navy cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700 outline-none focus:border-navy cursor-pointer"
          >
            <option value="all">All Brands ({brands.length})</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1.5"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span>{' '}
          engineered solutions
        </span>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            No products match your filter
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or contact our engineering desk for specific unlisted models or custom sizing requirements.
          </p>
          <button
            onClick={() => openEnquiry()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-navy text-white text-xs font-semibold hover:bg-sherman-900 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Submit Custom Requirement</span>
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors duration-200 overflow-hidden flex flex-col justify-between group shadow-xs"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                <SafeImage
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-cover"
                  fallbackSrc={DEFAULT_PRODUCT_PLACEHOLDER}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/95 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-xs">
                    {prod.category?.name || 'General Product'}
                  </span>
                  {prod.brand && (
                    <span className="px-2 py-0.5 rounded bg-navy text-[10px] font-bold text-amber-300 uppercase tracking-wider shadow-xs">
                      {prod.brand.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-2.5">
                <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-navy transition-colors leading-snug">
                  {prod.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prod.shortDescription || 'Precision engineered instrumentation backed by Sherman International.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0">
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <Link
                  href={`/products/${prod.category?.slug || 'all'}/${prod.slug}`}
                  className="flex-1 text-center py-2 px-3 rounded bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Technical Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => openEnquiry(prod.name, prod.category?.name || 'General Product', prod.id)}
                  className="py-2 px-3.5 rounded bg-navy hover:bg-sherman-900 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enquire</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

