'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_CLIENT_PLACEHOLDER, getImageUrl } from '@/lib/image';

export interface ProudlyServedClientItem {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

interface WeProudlyServeCarouselProps {
  clients: ProudlyServedClientItem[];
  title?: string;
  subtitle?: string;
}

export default function WeProudlyServeCarousel({
  clients,
  title = 'WE PROUDLY SERVE',
  subtitle = "Trusted by leading organizations across India's industrial and energy sectors",
}: WeProudlyServeCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Filter active clients only
  const activeClients = (clients || []).filter((c) => c && c.isActive !== false);

  if (!activeClients || activeClients.length === 0) return null;

  // Duplicate active clients array for seamless infinite marquee loop
  const duplicatedClients = [...activeClients, ...activeClients, ...activeClients];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-10 sm:py-12 bg-white border-y border-slate-200/90 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sherman-700 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sherman-600 inline-block" />
              <span>Representative Client Partnerships</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-sherman-600 cursor-pointer"
              aria-label="Previous client logos"
              title="Previous logos"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-sherman-600 cursor-pointer"
              aria-label="Next client logos"
              title="Next logos"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Subtle edge fade overlays for infinite scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Continuous Horizontal Scrolling Track */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-6 sm:gap-10 md:gap-12 overflow-x-auto py-2 scrollbar-none select-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Animated Marquee Flex Strip */}
            <div
              className={`flex items-center gap-6 sm:gap-10 md:gap-12 flex-shrink-0 animate-marquee ${
                isHovered || isPaused ? 'pause-animation' : ''
              }`}
            >
              {duplicatedClients.map((client, idx) => {
                const logoSrc = getImageUrl(client.logo, DEFAULT_CLIENT_PLACEHOLDER);

                const logoElement = (
                  <div className="brand-logo-container flex items-center justify-center min-h-[80px] sm:min-h-[90px] px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-lg transition-transform duration-200 hover:scale-105">
                    <img
                      src={logoSrc}
                      alt={client.name || 'Client Logo'}
                      loading="lazy"
                      className="brand-logo w-auto max-w-[130px] sm:max-w-[150px] md:max-w-[165px] h-[48px] sm:h-[58px] md:h-[65px] object-contain object-center"
                      style={{
                        opacity: 1,
                        filter: 'none',
                        mixBlendMode: 'normal',
                      }}
                      onError={(e) => {
                        console.warn(
                          `[WeProudlyServe] Failed to load logo for "${client.name}" from "${client.logo}". Falling back safely.`
                        );
                        const target = e.currentTarget;
                        if (target.src !== DEFAULT_CLIENT_PLACEHOLDER) {
                          target.src = DEFAULT_CLIENT_PLACEHOLDER;
                        }
                      }}
                    />
                  </div>
                );

                return (
                  <div
                    key={`${client.id}-${idx}`}
                    className="flex-shrink-0 flex items-center justify-center min-w-[130px] sm:min-w-[160px] md:min-w-[180px]"
                  >
                    {client.websiteUrl ? (
                      <a
                        href={client.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-sherman-500 rounded-lg inline-block"
                        title={client.name}
                      >
                        {logoElement}
                      </a>
                    ) : (
                      <div title={client.name}>{logoElement}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 25s;
          }
        }
      `}</style>
    </section>
  );
}
