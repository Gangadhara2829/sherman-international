import React from 'react';
import prisma from '@/lib/prisma';
import BrandsManagerClient from './BrandsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage() {
  let brands: any[] = [];
  try {
    brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { displayOrder: 'asc' },
    });
  } catch (err) {
    console.warn('Brands query warning:', err);
  }

  return <BrandsManagerClient initialBrands={brands} />;
}
