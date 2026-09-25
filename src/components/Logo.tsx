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
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Official Sherman Emblem Logo */}
      <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center p-1 rounded-xl bg-white shadow-xs border border-slate-200/80 group-hover:scale-105 transition-transform duration-300">
        <Image
          src="/images/sherman-logo.png"
          alt="Sherman International (P) Limited Logo"
          width={36}
          height={36}
          className="object-contain w-auto h-auto max-h-8 max-w-8"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-extrabold text-xl tracking-tight leading-none ${
                isLight ? 'text-white' : 'text-slate-900'
              }`}
            >
              SHERMAN
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                isLight
                  ? 'bg-white/15 text-amber-300 border border-white/20'
                  : 'bg-sherman-50 text-sherman-800 border border-sherman-200'
              }`}
            >
              India
            </span>
          </div>
          <span
            className={`text-[9.5px] font-semibold tracking-wider uppercase ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            International (P) Limited
          </span>
        </div>
      )}
    </Link>
  );
}
