'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/lib/gallery-types';
import { getImageUrl, DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';
import GalleryLightbox from '@/components/GalleryLightbox';
import { Maximize2, Tag, Layers } from 'lucide-react';

interface GalleryGridClientProps {
  initialItems: GalleryItem[];
  availableCategories?: string[];
}

export default function GalleryGridClient({
  initialItems,
  availableCategories,
}: GalleryGridClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories, combining configured categories and item categories
  const categories = [
    'ALL',
    ...Array.from(
      new Set([
        ...(availableCategories || []),
        ...initialItems
          .map((i) => i.category?.trim())
          .filter((c): c is string => Boolean(c && c.length > 0)),
      ])
    ),
  ];

  const filteredItems = initialItems.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <>
      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10 sm:mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sherman-700 text-white shadow-sm ring-2 ring-sherman-700 ring-offset-2'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Photographs Available</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no published photographs in this category. Check back soon for updates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            const imgSrc = getImageUrl(item.imageUrl, DEFAULT_PRODUCT_PLACEHOLDER);

            return (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300/80 overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={item.altText || item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PRODUCT_PLACEHOLDER;
                    }}
                  />

                  {/* Gradient Scrim for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Category Pill */}
                  {item.category && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-navy-deep/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Tag className="w-2.5 h-2.5 text-amber-400" />
                      <span>{item.category}</span>
                    </div>
                  )}

                  {/* Expand Zoom Indicator */}
                  <div className="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Content - ONLY rendered if title or caption is present */}
                {Boolean((item.title && item.title.trim()) || (item.caption && item.caption.trim())) && (
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center space-y-1.5 border-t border-slate-100">
                    {item.title && item.title.trim() && (
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-sherman-700 transition-colors line-clamp-1">
                        {item.title.trim()}
                      </h3>
                    )}
                    {item.caption && item.caption.trim() && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                        {item.caption.trim()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Dialog */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
}
