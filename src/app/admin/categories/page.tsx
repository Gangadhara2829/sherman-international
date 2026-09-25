import React from 'react';
import prisma from '@/lib/prisma';
import CategoriesManagerClient from './CategoriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.productCategory.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { displayOrder: 'asc' },
  });

  return <CategoriesManagerClient initialCategories={categories} />;
}
