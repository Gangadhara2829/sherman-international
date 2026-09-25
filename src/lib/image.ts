/**
 * Centralized Image Utility & Fallback Architecture
 * Safely handles local paths, uploaded assets, external URLs, and missing images.
 */

export const DEFAULT_PRODUCT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' width='100%25' height='100%25'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Cpath d='M160 110h80v80h-80z' fill='%23cbd5e1'/%3E%3Cpath d='M175 125h50v50h-50z' fill='%2394a3b8'/%3E%3Ctext x='50%25' y='75%25' font-family='sans-serif' font-size='13' font-weight='600' fill='%2364748b' text-anchor='middle'%3ESHERMAN ENGINEERING%3C/text%3E%3C/svg%3E";

export const DEFAULT_BRAND_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 120' width='100%25' height='100%25'%3E%3Crect width='300' height='120' fill='%23ffffff'/%3E%3Crect x='10' y='10' width='280' height='100' rx='8' fill='%23f8fafc' stroke='%23e2e8f0' stroke-width='1.5' stroke-dasharray='4 4'/%3E%3Ctext x='50%25' y='55%25' font-family='sans-serif' font-size='14' font-weight='700' fill='%2364748b' text-anchor='middle'%3EPRINCIPAL LOGO%3C/text%3E%3C/svg%3E";

export const DEFAULT_CLIENT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 100' width='100%25' height='100%25'%3E%3Crect width='240' height='100' fill='%23ffffff'/%3E%3Ctext x='50%25' y='55%25' font-family='sans-serif' font-size='13' font-weight='700' fill='%2394a3b8' text-anchor='middle'%3ECLIENT LOGO%3C/text%3E%3C/svg%3E";

export const DEFAULT_INDUSTRY_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%25' height='100%25'%3E%3Crect width='600' height='400' fill='%230b192c'/%3E%3Cpath d='M250 150h100v100h-100z' fill='%231e3e62'/%3E%3Ctext x='50%25' y='70%25' font-family='sans-serif' font-size='18' font-weight='700' fill='%23f1f5f9' text-anchor='middle'%3EINDUSTRY SECTOR%3C/text%3E%3C/svg%3E";

export const DEFAULT_SERVICE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' width='100%25' height='100%25'%3E%3Crect width='600' height='400' fill='%23f8fafc'/%3E%3Cpath d='M260 160h80v80h-80z' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='70%25' font-family='sans-serif' font-size='16' font-weight='700' fill='%23475569' text-anchor='middle'%3EENGINEERING SERVICE%3C/text%3E%3C/svg%3E";

/**
 * Universal Image Resolver
 * Safely resolves an image path, URL, or image object with fallbacks.
 *
 * Rules:
 * - local /images/... -> return unchanged
 * - local /uploads/... -> return unchanged
 * - valid https URL -> return URL
 * - valid http URL -> return URL
 * - data URIs -> return URI
 * - object with url/src/path -> extract and recursively resolve
 * - empty, null, undefined, blob:, or local file paths (C:\...) -> return fallback
 */
export function resolveImageSrc(
  image: any,
  fallback: string = DEFAULT_PRODUCT_PLACEHOLDER
): string {
  if (!image) return fallback;

  // If object, extract url, src, or path
  if (typeof image === 'object') {
    const candidate = image.url || image.src || image.path || image.image;
    if (candidate && typeof candidate === 'string') {
      return resolveImageSrc(candidate, fallback);
    }
    return fallback;
  }

  if (typeof image !== 'string') {
    return fallback;
  }

  const trimmed = image.trim();
  if (trimmed.length === 0 || trimmed === 'null' || trimmed === 'undefined' || trimmed === '[object Object]') {
    return fallback;
  }

  // Filter out invalid temporary blob URLs or local filesystem paths
  if (trimmed.startsWith('blob:') || /^[a-zA-Z]:\\/.test(trimmed) || /^\/\/[a-zA-Z]:/.test(trimmed)) {
    return fallback;
  }

  // Local relative path (starts with /)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Data URI
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Absolute URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Relative path without leading slash (e.g. "uploads/...", "images/...")
  if (trimmed.startsWith('uploads/') || trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  return trimmed;
}

/**
 * Alias for backward compatibility across codebase
 */
export const getImageUrl = resolveImageSrc;

/**
 * Validates if an image file has an allowed extension and mime type.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
  ];

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (.${ext}). Allowed formats: JPG, JPEG, PNG, WEBP, SVG.`,
    };
  }

  const maxSizeInMB = 10;
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeInMB}MB limit. Please choose a smaller image.`,
    };
  }

  return { valid: true };
}
