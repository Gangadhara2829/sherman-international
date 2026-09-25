'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { resolveImageSrc, DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: any;
  fallbackSrc?: string;
  className?: string;
  alt: string;
}

/**
 * Universal SafeImage Component
 * Wraps Next.js Image with automatic URL normalization, domain safety, unoptimized mode for external hosts,
 * and resilient runtime error fallback.
 * Prevents missing images, unconfigured hosts, or broken links from ever crashing the application.
 */
export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_PRODUCT_PLACEHOLDER,
  alt,
  className = '',
  unoptimized,
  ...rest
}: SafeImageProps) {
  const initialResolved = resolveImageSrc(src, fallbackSrc);
  const [imgSrc, setImgSrc] = useState<string>(initialResolved);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextSrc = resolveImageSrc(src, fallbackSrc);
    setImgSrc(nextSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const isExternal =
    typeof imgSrc === 'string' &&
    (imgSrc.startsWith('http://') ||
      imgSrc.startsWith('https://') ||
      imgSrc.startsWith('data:image/') ||
      imgSrc.endsWith('.svg'));

  // Always mark external URLs or SVGs as unoptimized to prevent Next.js image domain runtime exceptions
  const shouldBeUnoptimized = unoptimized !== undefined ? unoptimized : isExternal;

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Sherman International Asset'}
      className={className}
      onError={handleError}
      unoptimized={shouldBeUnoptimized}
      {...rest}
    />
  );
}
