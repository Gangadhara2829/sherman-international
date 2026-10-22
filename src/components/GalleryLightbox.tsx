'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { GalleryItem } from '@/lib/gallery-types';
import { getImageUrl, DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const isOpen = currentIndex !== null && items[currentIndex] !== undefined;
  const currentItem = isOpen ? items[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIndex);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(nextIndex);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  const imgSrc = getImageUrl(currentItem.imageUrl, DEFAULT_PRODUCT_PLACEHOLDER);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md transition-all select-none"
      onClick={onClose}
    >
      {/* Top Bar with Counter and Close Button */}
      <div
        className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between text-white z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-200">
            {currentIndex + 1} / {items.length}
          </div>
          {currentItem.category && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sherman-600/30 text-sherman-300 border border-sherman-500/30 text-xs font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              <span>{currentItem.category}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close lightbox"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
            title="Previous (Left arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next image"
            title="Next (Right arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full px-4 sm:px-16 flex flex-col items-center justify-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl">
          <img
            src={imgSrc}
            alt={currentItem.altText || currentItem.title}
            className="max-h-[70vh] max-w-full w-auto h-auto object-contain rounded-xl select-none"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_PRODUCT_PLACEHOLDER;
            }}
          />
        </div>

        {/* Captions and Details - only rendered if title or caption exists */}
        {Boolean((currentItem.title && currentItem.title.trim()) || (currentItem.caption && currentItem.caption.trim())) && (
          <div className="mt-4 text-center max-w-2xl px-4 space-y-1.5">
            {currentItem.title && currentItem.title.trim() && (
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {currentItem.title.trim()}
              </h2>
            )}
            {currentItem.caption && currentItem.caption.trim() && (
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                {currentItem.caption.trim()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
