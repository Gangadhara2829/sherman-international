'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEnquiry } from './EnquiryModal';
import { DEFAULT_HERO_CONTENT } from '@/lib/content';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
}

export default function HeroSection({
  title = DEFAULT_HERO_CONTENT.title,
  subtitle = DEFAULT_HERO_CONTENT.subtitle,
  content = DEFAULT_HERO_CONTENT.content,
}: HeroSectionProps) {
  const { openEnquiry } = useEnquiry();

  return (
    <section
      className="relative w-full overflow-hidden text-white bg-[#041426] border-b border-slate-800"
      style={{
        backgroundImage: "url('/images/hero-industrial-background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 1. SUBTLE READABILITY OVERLAY GRADIENT (PRESERVES FULL BACKGROUND VISIBILITY) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(4, 20, 38, 0.82) 0%, rgba(4, 20, 38, 0.58) 42%, rgba(4, 20, 38, 0.25) 75%, rgba(4, 20, 38, 0.15) 100%)',
        }}
      />

      {/* Subtle top/bottom edge shade for seamless boundary blending */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#041426]/40 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#041426]/60 to-transparent pointer-events-none z-0" />

      {/* 2. MAIN HERO CONTENT CONTAINER (Left-Aligned, Max-Width 850px) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 min-h-[700px] lg:min-h-[760px] flex items-center z-10">
        <div className="w-full max-w-[850px] space-y-6 sm:space-y-7">
          {/* Top Eyebrow */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest text-[#D9A82E] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#D9A82E] inline-block" />
            <span>SHERMAN INTERNATIONAL (P) LIMITED</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] font-extrabold tracking-tight text-white leading-[1.08] font-display">
            {title}
          </h1>

          {/* Subheadline */}
          <div className="border-l-2 border-[#D9A82E] pl-4 py-0.5">
            <p className="text-base sm:text-lg lg:text-xl text-[#D7E0EA] font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-[720px] font-normal">
            {content}
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[6px] text-xs sm:text-sm font-bold text-white bg-[#1769AA] hover:bg-[#13588f] shadow-md transition-all duration-200 group cursor-pointer"
            >
              <span>Explore Industrial Products</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={() => openEnquiry()}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[6px] text-xs sm:text-sm font-bold text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              <span>Request Technical Sizing</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
