import prisma from '@/lib/prisma';
import { GalleryItem, DEFAULT_GALLERY_CATEGORIES } from './gallery-types';

export * from './gallery-types';

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Turbines & Compressors Revamping',
    caption: 'Specialized engineering retrofits, rotor dynamic balancing, and comprehensive overhauling of critical process turbomachinery.',
    altText: 'Industrial Turbines and Compressors Revamping Services',
    imageUrl: '/images/services/turbines-and-compressors-revamping.jpg',
    category: 'Engineering',
    displayOrder: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gal-2',
    title: 'High-Precision Coriolis Mass Flow Meter',
    caption: 'Continuous high-accuracy mass flow measurement for liquids and gases in custody transfer and process control.',
    altText: 'Coriolis Mass Flow Meter Industrial Instrumentation',
    imageUrl: '/images/products/coriolis-mass-flow-meter.jpg',
    category: 'Equipment',
    displayOrder: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Condition Monitoring & Vibration Diagnostics',
    caption: 'Advanced sensor arrays and multi-channel vibration monitoring for real-time asset protection and predictive maintenance.',
    altText: 'Condition Monitoring and Predictive Vibration Diagnostics',
    imageUrl: '/images/services/condition-monitoring-analysis.jpg',
    category: 'Engineering',
    displayOrder: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gal-4',
    title: 'Automated Loop & System Integration Facility',
    caption: 'Comprehensive turnkey electrical, instrumentation, and control system integration facility.',
    altText: 'Sherman Industrial System Integration and Assembly Facility',
    imageUrl: '/images/why-sherman/system-integration.jpg',
    category: 'Facilities',
    displayOrder: 4,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gal-5',
    title: 'Fail-Safe Combustion & Flame Sensing',
    caption: 'Industrial burner monitoring systems, UV/IR flame detection, and high-energy spark ignition hardware.',
    altText: 'Combustion Control and Flame Scanner Systems',
    imageUrl: '/images/products/flame-scanner.jpg',
    category: 'Equipment',
    displayOrder: 5,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gal-6',
    title: 'Railway Electrification & OHE Assembly',
    caption: 'Heavy-duty 25kV traction fittings, catenary section insulators, and overhead electrification hardware.',
    altText: 'Railway Electrification and 25kV OHE Hardware',
    imageUrl: '/images/products/ohe-accessories.jpg',
    category: 'Projects',
    displayOrder: 6,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gal-7',
    title: 'Turnkey EPC & Field Commissioning',
    caption: 'Full lifecycle engineering contracting, on-site supervision, calibration, and loop testing across India.',
    altText: 'Turnkey EPC Contracting and Industrial Commissioning',
    imageUrl: '/images/services/epc-and-turnkey-contracting.jpg',
    category: 'Projects',
    displayOrder: 7,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gal-8',
    title: 'API 610 Heavy-Duty Process Pumps',
    caption: 'Robust pumping technologies engineered for high-temperature, high-pressure, and hazardous process duties.',
    altText: 'Industrial Process Pump Technology and Fluid Transfer',
    imageUrl: '/images/products/pump-technology.jpg',
    category: 'Equipment',
    displayOrder: 8,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Fallback storage helper using siteContent model
 */
async function getFallbackGalleryItems(): Promise<GalleryItem[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { key: 'gallery_items_data' },
    });
    if (record?.content) {
      const parsed = JSON.parse(record.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Gallery] Fallback siteContent read warning:', err);
  }
  return INITIAL_GALLERY_ITEMS;
}

async function saveFallbackGalleryItems(items: GalleryItem[]): Promise<void> {
  try {
    await prisma.siteContent.upsert({
      where: { key: 'gallery_items_data' },
      update: {
        section: 'gallery',
        title: 'Gallery Items Data',
        content: JSON.stringify(items),
      },
      create: {
        key: 'gallery_items_data',
        section: 'gallery',
        title: 'Gallery Items Data',
        content: JSON.stringify(items),
      },
    });
  } catch (err) {
    console.error('[Gallery] Fallback siteContent save error:', err);
  }
}

/**
 * Get all gallery items with filtering and safe fallback
 */
export async function getGalleryItems(options?: {
  category?: string;
  includeUnpublished?: boolean;
}): Promise<GalleryItem[]> {
  const { category, includeUnpublished = false } = options || {};

  try {
    // 1. Try native GalleryItem table in Prisma
    const whereClause: any = {};
    if (!includeUnpublished) {
      whereClause.isPublished = true;
    }
    if (category && category !== 'ALL') {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }

    const items = await (prisma as any).galleryItem.findMany({
      where: whereClause,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    if (items && items.length > 0) {
      return items;
    }

    // If table exists but empty, initialize with authentic default items if admin
    if (items && items.length === 0 && includeUnpublished) {
      // Seed table
      for (const initial of INITIAL_GALLERY_ITEMS) {
        await (prisma as any).galleryItem.create({
          data: {
            title: initial.title,
            caption: initial.caption,
            altText: initial.altText,
            imageUrl: initial.imageUrl,
            category: initial.category,
            displayOrder: initial.displayOrder,
            isPublished: initial.isPublished,
          },
        }).catch(() => null);
      }
      return (prisma as any).galleryItem.findMany({
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      });
    }

    if (items && items.length === 0 && !includeUnpublished) {
      // Check fallback
      const fallbackItems = await getFallbackGalleryItems();
      let filtered = fallbackItems;
      if (!includeUnpublished) {
        filtered = filtered.filter((i) => i.isPublished);
      }
      if (category && category !== 'ALL') {
        filtered = filtered.filter(
          (i) => i.category?.toLowerCase() === category.toLowerCase()
        );
      }
      return filtered.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return items;
  } catch (err) {
    // 2. Safe fallback when GalleryItem table is not yet migrated on the active connection
    console.warn('[Gallery] Direct GalleryItem query fallback:', (err as any)?.message || err);
    let items = await getFallbackGalleryItems();
    if (!includeUnpublished) {
      items = items.filter((i) => i.isPublished);
    }
    if (category && category !== 'ALL') {
      items = items.filter(
        (i) => i.category?.toLowerCase() === category.toLowerCase()
      );
    }
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

/**
 * Get single gallery item
 */
export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  try {
    const item = await (prisma as any).galleryItem.findUnique({
      where: { id },
    });
    if (item) return item;
  } catch (err) {
    // ignore
  }

  const fallbackItems = await getFallbackGalleryItems();
  return fallbackItems.find((i) => i.id === id) || null;
}

/**
 * Create a new gallery item
 */
export async function createGalleryItem(data: {
  title?: string | null;
  caption?: string | null;
  altText?: string | null;
  imageUrl: string;
  category?: string | null;
  displayOrder?: number;
  isPublished?: boolean;
}): Promise<GalleryItem> {
  const safeTitle = data.title ? data.title.trim() : '';
  try {
    const created = await (prisma as any).galleryItem.create({
      data: {
        title: safeTitle,
        caption: data.caption ? data.caption.trim() : null,
        altText: data.altText ? data.altText.trim() : null,
        imageUrl: data.imageUrl.trim(),
        category: data.category ? data.category.trim() : 'GENERAL',
        displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : 0,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      },
    });
    return created;
  } catch (err) {
    console.warn('[Gallery] Direct create fallback to siteContent:', (err as any)?.message);
  }

  // Fallback to siteContent store
  const items = await getFallbackGalleryItems();
  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: safeTitle,
    caption: data.caption ? data.caption.trim() : null,
    altText: data.altText ? data.altText.trim() : null,
    imageUrl: data.imageUrl.trim(),
    category: data.category ? data.category.trim() : 'GENERAL',
    displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : items.length + 1,
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  await saveFallbackGalleryItems(updated);
  return newItem;
}

/**
 * Update a gallery item
 */
export async function updateGalleryItem(
  id: string,
  data: Partial<GalleryItem>
): Promise<GalleryItem> {
  try {
    const updated = await (prisma as any).galleryItem.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title ? data.title.trim() : '' }),
        ...(data.caption !== undefined && { caption: data.caption ? data.caption.trim() : null }),
        ...(data.altText !== undefined && { altText: data.altText ? data.altText.trim() : null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl.trim() }),
        ...(data.category !== undefined && { category: data.category && data.category.trim() ? data.category.trim() : 'General' }),
        ...(data.displayOrder !== undefined && { displayOrder: Number(data.displayOrder) || 0 }),
        ...(data.isPublished !== undefined && { isPublished: Boolean(data.isPublished) }),
      },
    });
    return updated;
  } catch (err) {
    console.warn('[Gallery] Direct update fallback to siteContent:', (err as any)?.message);
  }

  // Fallback update
  const items = await getFallbackGalleryItems();
  let found = false;
  const updatedItems = items.map((item) => {
    if (item.id === id) {
      found = true;
      return {
        ...item,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });

  if (!found) {
    throw new Error('Gallery item not found');
  }

  await saveFallbackGalleryItems(updatedItems);
  return updatedItems.find((i) => i.id === id)!;
}

/**
 * Delete a gallery item
 */
export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    await (prisma as any).galleryItem.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    console.warn('[Gallery] Direct delete fallback to siteContent:', (err as any)?.message);
  }

  // Fallback delete
  const items = await getFallbackGalleryItems();
  const filtered = items.filter((item) => item.id !== id);
  await saveFallbackGalleryItems(filtered);
  return true;
}


/**
 * Get all available gallery categories
 */
export async function getGalleryCategories(): Promise<string[]> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { key: 'gallery_categories' },
    });
    if (record?.content) {
      const parsed = JSON.parse(record.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Gallery] Error loading categories:', err);
  }

  // Derive categories from existing items
  const items = await getGalleryItems({ includeUnpublished: true });
  const itemCategories = items
    .map((i) => i.category?.trim())
    .filter((c): c is string => Boolean(c && c.length > 0));

  const merged = Array.from(new Set([...DEFAULT_GALLERY_CATEGORIES, ...itemCategories]));
  return merged;
}

/**
 * Save gallery categories list
 */
export async function saveGalleryCategories(categories: string[]): Promise<string[]> {
  const cleaned = Array.from(
    new Set(categories.map((c) => c.trim()).filter((c) => c.length > 0))
  );

  try {
    await prisma.siteContent.upsert({
      where: { key: 'gallery_categories' },
      update: {
        section: 'gallery',
        title: 'Gallery Categories',
        content: JSON.stringify(cleaned),
      },
      create: {
        key: 'gallery_categories',
        section: 'gallery',
        title: 'Gallery Categories',
        content: JSON.stringify(cleaned),
      },
    });
  } catch (err) {
    console.error('[Gallery] Error saving categories:', err);
  }
  return cleaned;
}

/**
 * Add a new category
 */
export async function addGalleryCategory(name: string): Promise<string[]> {
  const current = await getGalleryCategories();
  const trimmed = name.trim();
  if (!trimmed) return current;

  // Case-insensitive check
  const exists = current.some((c) => c.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    return current;
  }

  const updated = [...current, trimmed];
  return saveGalleryCategories(updated);
}

/**
 * Rename an existing category and update all items using it
 */
export async function renameGalleryCategory(
  oldName: string,
  newName: string
): Promise<string[]> {
  const trimmedOld = oldName.trim();
  const trimmedNew = newName.trim();
  if (!trimmedNew || trimmedOld.toLowerCase() === trimmedNew.toLowerCase()) {
    return getGalleryCategories();
  }

  const current = await getGalleryCategories();
  const updatedCategories = current.map((c) =>
    c.toLowerCase() === trimmedOld.toLowerCase() ? trimmedNew : c
  );

  // Update in database items
  try {
    await (prisma as any).galleryItem.updateMany({
      where: { category: { equals: trimmedOld, mode: 'insensitive' } },
      data: { category: trimmedNew },
    });
  } catch (e) {
    // fallback
  }

  // Update in fallback siteContent items
  const fallbackItems = await getFallbackGalleryItems();
  let modifiedFallback = false;
  const updatedItems = fallbackItems.map((item) => {
    if (item.category?.toLowerCase() === trimmedOld.toLowerCase()) {
      modifiedFallback = true;
      return { ...item, category: trimmedNew };
    }
    return item;
  });
  if (modifiedFallback) {
    await saveFallbackGalleryItems(updatedItems);
  }

  return saveGalleryCategories(updatedCategories);
}

/**
 * Delete a category and reassign its items to 'General'
 */
export async function deleteGalleryCategory(name: string): Promise<string[]> {
  const trimmed = name.trim();
  const current = await getGalleryCategories();
  const remaining = current.filter(
    (c) => c.toLowerCase() !== trimmed.toLowerCase()
  );

  const fallbackCategory = remaining.includes('General') ? 'General' : remaining[0] || 'General';

  // Reassign items using this category to fallbackCategory
  try {
    await (prisma as any).galleryItem.updateMany({
      where: { category: { equals: trimmed, mode: 'insensitive' } },
      data: { category: fallbackCategory },
    });
  } catch (e) {
    // fallback
  }

  const fallbackItems = await getFallbackGalleryItems();
  let modifiedFallback = false;
  const updatedItems = fallbackItems.map((item) => {
    if (item.category?.toLowerCase() === trimmed.toLowerCase()) {
      modifiedFallback = true;
      return { ...item, category: fallbackCategory };
    }
    return item;
  });
  if (modifiedFallback) {
    await saveFallbackGalleryItems(updatedItems);
  }

  return saveGalleryCategories(remaining.length > 0 ? remaining : ['General']);
}

