import React from 'react';
import prisma from '@/lib/prisma';
import BrandsManagerClient from './BrandsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { displayOrder: 'asc' },
  });

  return <BrandsManagerClient initialBrands={brands} />;
}
