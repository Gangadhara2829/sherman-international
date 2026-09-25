import React from 'react';
import prisma from '@/lib/prisma';
import CategoriesManagerClient from './CategoriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.productCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { displayOrder: 'asc' },
    });
  } catch (err) {
    console.warn('Categories query warning:', err);
  }

  return <CategoriesManagerClient initialCategories={categories} />;
}
