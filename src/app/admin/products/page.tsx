import React from 'react';
import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductsTableClient from './ProductsTableClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];

  try {
    const [pList, cList, bList] = await Promise.all([
      prisma.product.findMany({
        include: { category: true, brand: true },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      }).catch(() => []),
      prisma.productCategory.findMany({ orderBy: { displayOrder: 'asc' } }).catch(() => []),
      prisma.brand.findMany({ orderBy: { displayOrder: 'asc' } }).catch(() => []),
    ]);
    products = pList || [];
    categories = cList || [];
    brands = bList || [];
  } catch (err) {
    console.warn('Admin products load warning:', err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Products & Instrumentation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, update, reorder, and configure technical specifications for products.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Products Table Client Component */}
      <ProductsTableClient
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
