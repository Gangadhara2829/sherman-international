import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [products, categories, brands, services] = await Promise.all([
      prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { shortDescription: { contains: query } },
          ],
        },
        include: { category: true, brand: true },
        take: 8,
      }),
      prisma.productCategory.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: 4,
      }),
      prisma.brand.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: 4,
      }),
      prisma.service.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query } },
            { shortDescription: { contains: query } },
          ],
        },
        take: 4,
      }),
    ]);

    const results = [
      ...products.map((p) => ({
        type: 'product' as const,
        id: p.id,
        title: p.name,
        subtitle: p.brand?.name ? `${p.brand.name} • ${p.category.name}` : p.category.name,
        url: `/products/${p.category.slug}/${p.slug}`,
      })),
      ...categories.map((c) => ({
        type: 'category' as const,
        id: c.id,
        title: c.name,
        subtitle: c.description || undefined,
        url: `/products/${c.slug}`,
      })),
      ...brands.map((b) => ({
        type: 'brand' as const,
        id: b.id,
        title: b.name,
        subtitle: b.description || 'Represented OEM Brand',
        url: `/brands/${b.slug}`,
      })),
      ...services.map((s) => ({
        type: 'service' as const,
        id: s.id,
        title: s.name,
        subtitle: s.shortDescription,
        url: `/services/${s.slug}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
