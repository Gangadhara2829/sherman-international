import prisma from '@/lib/prisma';
export * from './partners-types';
import { PartnerItem, PartnersPageHeader, DEFAULT_PARTNERS_HEADER } from './partners-types';

/**
 * Fetch all partners from persistent SiteContent storage.
 * Strictly returns only partners explicitly managed through Our Partners Management.
 * Does NOT import or merge manufacturer brands.
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

  // Strictly return empty list when no separate partners have been added
  return [];
}

/**
 * Fetch Our Partners page heading and introductory description.
 */
export async function getPartnersPageHeader(): Promise<PartnersPageHeader> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { key: 'our_partners' },
    });
    if (record) {
      let intro = DEFAULT_PARTNERS_HEADER.intro;
      if (record.metadata) {
        try {
          const meta = JSON.parse(record.metadata);
          if (meta.intro) intro = meta.intro;
        } catch {}
      } else if (record.subtitle) {
        intro = record.subtitle;
      }
      return {
        heading: record.title?.trim() || DEFAULT_PARTNERS_HEADER.heading,
        intro: intro.trim(),
      };
    }
  } catch (err) {
    console.warn('[Partners] Failed to fetch partners header:', err);
  }
  return DEFAULT_PARTNERS_HEADER;
}

/**
 * Persistently save page heading and introductory text for Our Partners.
 */
export async function savePartnersPageHeader(
  heading: string,
  intro: string
): Promise<boolean> {
  try {
    const existing = await prisma.siteContent.findUnique({
      where: { key: 'our_partners' },
    });
    let existingMeta: any = {};
    if (existing?.metadata) {
      try {
        existingMeta = JSON.parse(existing.metadata);
      } catch {}
    }
    const updatedMeta = { ...existingMeta, intro: intro.trim() };

    await prisma.siteContent.upsert({
      where: { key: 'our_partners' },
      create: {
        key: 'our_partners',
        section: 'partners',
        title: heading.trim(),
        subtitle: intro.trim(),
        content: '[]',
        metadata: JSON.stringify(updatedMeta),
      },
      update: {
        title: heading.trim(),
        subtitle: intro.trim(),
        metadata: JSON.stringify(updatedMeta),
      },
    });

    return true;
  } catch (err) {
    console.error('[Partners] Failed to save partners header:', err);
    return false;
  }
}

/**
 * Save complete partners array persistently to SiteContent
 */
export async function savePartners(items: PartnerItem[]): Promise<boolean> {
  try {
    const sorted = [...items].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );

    const existing = await prisma.siteContent.findUnique({
      where: { key: 'our_partners' },
    });

    await prisma.siteContent.upsert({
      where: { key: 'our_partners' },
      create: {
        key: 'our_partners',
        section: 'partners',
        title: DEFAULT_PARTNERS_HEADER.heading,
        subtitle: DEFAULT_PARTNERS_HEADER.intro,
        content: JSON.stringify(sorted),
        metadata: JSON.stringify({ intro: DEFAULT_PARTNERS_HEADER.intro }),
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
