import React from 'react';
import prisma from '@/lib/prisma';
import ProductEditorForm from '../ProductEditorForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.productCategory.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { displayOrder: 'asc' } }),
  ]);

  return <ProductEditorForm categories={categories} brands={brands} />;
}
