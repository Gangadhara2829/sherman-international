import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductCatalogClient from './ProductCatalogClient';

export const metadata = {
  title: 'Products & Engineering Solutions | Sherman International',
  description:
    'Explore our comprehensive catalog of flow measurement devices, process switches, dynamic balancing machines, vibration monitors, and combustion control equipment.',
};

export default async function ProductsPage() {
  const [categories, brands, products] = await Promise.all([
    prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true, brand: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    }),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">Products</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs font-bold uppercase tracking-wider">
            <span>Portfolio</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered Products & Instrumentation
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Direct channel partner for leading global manufacturers. Sizing, technical consulting, system integration, and on-site after-sales support across India.
          </p>
        </div>

        {/* Client-side Filterable Catalog Component */}
        <ProductCatalogClient
          initialProducts={products}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
}

