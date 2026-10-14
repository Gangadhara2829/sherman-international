'use client';

import React from 'react';
import Link from 'next/link';
import { Images, ArrowRight, Maximize2, Tag } from 'lucide-react';
import { GalleryItem } from '@/lib/gallery-types';
import { getImageUrl, DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface GallerySectionProps {
  items: GalleryItem[];
}

export default function GallerySection({ items }: GallerySectionProps) {
  // If no items, do not render
  if (!items || items.length === 0) return null;

  // Take first 4 items for clean home page showcase
  const previewItems = items.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sherman-700 mb-2 flex items-center gap-2">
              <Images className="w-4 h-4 text-sherman-600" />
              <span>Engineering Infrastructure &amp; Projects</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              Corporate Gallery
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal leading-relaxed">
              Explore authentic photographs of our industrial instrumentation, balancing systems, engineering facilities, and on-site commissioning across India.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-sherman-600 text-slate-800 hover:text-sherman-700 text-xs font-bold uppercase tracking-wider transition-all self-start md:self-auto group shadow-2xs hover:shadow-xs"
          >
            <span>View Full Gallery ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewItems.map((item) => {
            const imgSrc = getImageUrl(item.imageUrl, DEFAULT_PRODUCT_PLACEHOLDER);

            return (
              <Link
                key={item.id}
                href="/gallery"
                className="group relative bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 overflow-hidden flex flex-col transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={item.altText || item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PRODUCT_PLACEHOLDER;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {item.category && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-navy-deep/80 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Tag className="w-2.5 h-2.5 text-amber-400" />
                      <span>{item.category}</span>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-sherman-700 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
