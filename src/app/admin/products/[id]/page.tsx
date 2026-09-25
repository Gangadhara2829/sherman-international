import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductEditorForm from '../ProductEditorForm';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.productCategory.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { displayOrder: 'asc' } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductEditorForm
      initialProduct={product}
      categories={categories}
      brands={brands}
    />
  );
}
