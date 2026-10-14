'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
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
  subtitle = "Trusted by leading public sector undertakings, energy corporations, and industrial leaders across India",
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
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 border-y border-slate-200/90 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sherman-700 mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sherman-600 inline-block animate-pulse" />
              <span>Representative Client Partnerships</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sherman-600 cursor-pointer"
              aria-label="Previous client logos"
              title="Previous logos"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sherman-600 cursor-pointer"
              aria-label="Next client logos"
              title="Next logos"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative group py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Subtle edge fade overlays for infinite scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          {/* Continuous Horizontal Scrolling Track */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-8 sm:gap-12 md:gap-16 overflow-x-auto py-4 scrollbar-none select-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Animated Marquee Flex Strip */}
            <div
              className={`flex items-center gap-8 sm:gap-12 md:gap-16 flex-shrink-0 animate-marquee ${
                isHovered || isPaused ? 'pause-animation' : ''
              }`}
            >
              {duplicatedClients.map((client, idx) => {
                const logoSrc = getImageUrl(client.logo, DEFAULT_CLIENT_PLACEHOLDER);

                const logoElement = (
                  <div className="relative flex items-center justify-center w-[200px] sm:w-[240px] md:w-[270px] lg:w-[290px] h-[90px] sm:h-[110px] md:h-[125px] transition-transform duration-300 ease-out group-hover/logo:scale-110">
                    <img
                      src={logoSrc}
                      alt={client.name ? `${client.name} Logo` : 'Client Logo'}
                      loading="lazy"
                      className="w-auto h-auto max-w-[190px] sm:max-w-[230px] md:max-w-[260px] lg:max-w-[280px] max-h-[85px] sm:max-h-[105px] md:max-h-[115px] lg:max-h-[120px] object-contain object-center transition-all duration-300 drop-shadow-none"
                      style={{
                        opacity: 1,
                        filter: 'none',
                        mixBlendMode: 'multiply',
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
                    className="group/logo flex-shrink-0 flex items-center justify-center cursor-default"
                    title={client.name}
                  >
                    {client.websiteUrl ? (
                      <a
                        href={client.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sherman-500 rounded-lg p-1"
                        aria-label={`Visit ${client.name} website`}
                      >
                        {logoElement}
                        <span className="sr-only">{client.name}</span>
                      </a>
                    ) : (
                      <div className="inline-flex items-center justify-center p-1">
                        {logoElement}
                      </div>
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
          animation: marquee 42s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 32s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

