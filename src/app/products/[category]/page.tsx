import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductCatalogClient from '../ProductCatalogClient';

interface CategoryPageProps {
  params: { category: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await prisma.productCategory.findUnique({
    where: { slug: params.category },
  });

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Solutions & Equipment | Sherman International`,
    description:
      category.description ||
      `Explore high-performance ${category.name} instrumentation and engineering solutions distributed by Sherman International.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.productCategory.findUnique({
    where: { slug: params.category },
    include: {
      products: {
        where: { isPublished: true },
        include: { category: true, brand: true },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      },
    },
  });

  if (!category) {
    notFound();
  }

  const allCategories = await prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  const allBrands = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-slate-900 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{category.name}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className="rounded-lg bg-navy text-white p-8 sm:p-12 mb-10 border border-slate-800">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded bg-white/10 border border-white/15 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Category Portfolio
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {category.description ||
                'High-reliability engineering equipment, sizing support, and direct principal distribution from Sherman International.'}
            </p>
          </div>
        </div>

        {/* Filterable Products in this category */}
        <ProductCatalogClient
          initialProducts={category.products}
          categories={allCategories}
          brands={allBrands}
        />
      </div>
    </div>
  );
}

