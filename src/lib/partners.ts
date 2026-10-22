import prisma from '@/lib/prisma';

export interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string | null;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all partners from persistent SiteContent storage.
 * If not yet seeded, seeds authentic Sherman principal partners.
 */
export async function getPartners(options?: {
  includeInactive?: boolean;
}): Promise<PartnerItem[]> {
  const includeInactive = options?.includeInactive ?? false;

  try {
    const record = await prisma.siteContent.findUnique({
      where: { key: 'our_partners' },
    });

    if (record?.content) {
      const parsed: PartnerItem[] = JSON.parse(record.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let items = parsed;
        if (!includeInactive) {
          items = items.filter((p) => p.isActive !== false);
        }
        return items.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      }
    }
  } catch (err) {
    console.warn('[Partners] Failed to fetch partners from siteContent:', err);
  }

  // Initial seeding from existing authentic Brand records
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true, logo: { not: null } },
      orderBy: { displayOrder: 'asc' },
    });

    if (brands && brands.length > 0) {
      const initialPartners: PartnerItem[] = brands.map((b, idx) => ({
        id: `partner-${b.id || idx + 1}`,
        name: b.name,
        logo: b.logo || '',
        websiteUrl: b.websiteUrl || null,
        description: b.description || 'Authorized OEM Partner & Global Principal',
        displayOrder: idx + 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Persist so admin can edit independently of brand records
      await savePartners(initialPartners);

      return includeInactive
        ? initialPartners
        : initialPartners.filter((p) => p.isActive !== false);
    }
  } catch (err) {
    console.warn('[Partners] Failed to seed initial partners from brands:', err);
  }

  return [];
}

/**
 * Save complete partners array persistently to SiteContent
 */
export async function savePartners(items: PartnerItem[]): Promise<boolean> {
  try {
    const sorted = [...items].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );

    await prisma.siteContent.upsert({
      where: { key: 'our_partners' },
      create: {
        key: 'our_partners',
        section: 'partners',
        title: 'Our Partners & Global Principals',
        subtitle: 'Strategic OEM Partnerships Delivering Global Industrial Engineering Solutions',
        content: JSON.stringify(sorted),
      },
      update: {
        content: JSON.stringify(sorted),
      },
    });

    return true;
  } catch (err) {
    console.error('[Partners] Failed to save partners:', err);
    throw new Error('Failed to save partners data to persistent storage');
  }
}

/**
 * Add a new partner
 */
export async function createPartner(data: {
  name: string;
  logo: string;
  websiteUrl?: string | null;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}): Promise<PartnerItem> {
  const partners = await getPartners({ includeInactive: true });

  const newItem: PartnerItem = {
    id: `partner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    logo: data.logo.trim(),
    websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : null,
    description: data.description ? data.description.trim() : null,
    displayOrder:
      data.displayOrder !== undefined ? Number(data.displayOrder) : partners.length + 1,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  partners.push(newItem);
  await savePartners(partners);
  return newItem;
}

/**
 * Update an existing partner
 */
export async function updatePartner(
  id: string,
  data: Partial<PartnerItem>
): Promise<PartnerItem | null> {
  const partners = await getPartners({ includeInactive: true });
  const index = partners.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = partners[index];
  const updated: PartnerItem = {
    ...current,
    ...(data.name !== undefined && { name: data.name.trim() }),
    ...(data.logo !== undefined && { logo: data.logo.trim() }),
    ...(data.websiteUrl !== undefined && {
      websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : null,
    }),
    ...(data.description !== undefined && {
      description: data.description ? data.description.trim() : null,
    }),
    ...(data.displayOrder !== undefined && {
      displayOrder: Number(data.displayOrder),
    }),
    ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    updatedAt: new Date().toISOString(),
  };

  partners[index] = updated;
  await savePartners(partners);
  return updated;
}

/**
 * Delete a partner
 */
export async function deletePartner(id: string): Promise<boolean> {
  const partners = await getPartners({ includeInactive: true });
  const filtered = partners.filter((p) => p.id !== id);
  if (filtered.length === partners.length) return false;

  await savePartners(filtered);
  return true;
}
