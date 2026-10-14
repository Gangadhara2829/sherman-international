import React from 'react';
import { getGalleryItems, getGalleryCategories } from '@/lib/gallery';
import GalleryManagerClient from './GalleryManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems({ includeUnpublished: true }),
    getGalleryCategories(),
  ]);

  return <GalleryManagerClient initialItems={items} initialCategories={categories} />;
}
