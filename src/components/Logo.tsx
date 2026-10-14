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
          <div className="relative flex items-center">
            <Image
              src={isLight ? '/images/sherman-wordmark-light.png' : '/images/sherman-wordmark.png'}
              alt="SHERMAN"
              width={884}
              height={166}
              className="h-[22px] sm:h-[24px] w-auto object-contain"
              priority
            />
          </div>
          <span
            className={`text-[8.5px] sm:text-[9px] font-extrabold tracking-[0.16em] uppercase mt-1 ${
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

