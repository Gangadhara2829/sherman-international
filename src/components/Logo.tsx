import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
}

export default function Logo({ variant = 'dark', className = '', showText = true }: LogoProps) {
  const isLight = variant === 'light';

  return (
    <Link href="/" className={`inline-flex items-center gap-3.5 group select-none ${className}`}>
      {/* Official Sherman Emblem Logo - Clean Integration without box container */}
      <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/images/sherman-logo.png"
          alt="Sherman International (P) Limited"
          width={40}
          height={40}
          className="object-contain w-auto h-10 max-h-10 max-w-10"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-start">
            <span
              className={`font-black text-[22px] tracking-tight leading-none uppercase ${
                isLight ? 'text-white' : 'text-[#061d43]'
              }`}
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.015em',
              }}
            >
              SHERMAN
            </span>
            <span
              className={`text-[8px] font-black leading-none ml-0.5 mt-[-1px] ${
                isLight ? 'text-slate-300' : 'text-[#061d43]'
              }`}
            >
              TM
            </span>
          </div>
          <span
            className={`text-[9px] font-extrabold tracking-[0.16em] uppercase mt-1 ${
              isLight ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            INTERNATIONAL (P) LIMITED
          </span>
        </div>
      )}
    </Link>
  );
}

