import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductCatalogClient from '@/app/products/ProductCatalogClient';

interface BrandDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BrandDetailPageProps) {
  const brand = await prisma.brand.findUnique({
    where: { slug: params.slug },
  });

  if (!brand) return { title: 'Brand Not Found' };

  return {
    title: `${brand.name} Engineering Solutions & Equipment in India | Sherman`,
    description:
      brand.description ||
      `Official representation and technical supply of ${brand.name} products in India by Sherman International.`,
  };
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const brand = await prisma.brand.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isPublished: true },
        include: { category: true, brand: true },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      },
    },
  });

  if (!brand) {
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
          <Link href="/brands" className="hover:text-slate-900 transition-colors">
            Brands
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{brand.name}</span>
        </nav>

        {/* Brand Banner */}
        <div className="bg-navy text-white rounded-lg p-8 sm:p-12 mb-10 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {brand.logo && (
                <div className="w-28 h-16 bg-white rounded-xl p-2 flex items-center justify-center shadow-md flex-shrink-0">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-h-12 max-w-[96px] object-contain"
                  />
                </div>
              )}
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 px-2.5 py-1 rounded bg-white/10 border border-white/15 inline-flex items-center gap-1.5">
                  Brand & Manufacturer Profile
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                  {brand.name}
                </h1>
                {brand.description && (
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>

            {brand.websiteUrl && (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-xs flex-shrink-0"
              >
                <span>Visit Global OEM Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Brand Products */}
        <ProductCatalogClient
          initialProducts={brand.products}
          categories={allCategories}
          brands={allBrands}
        />
      </div>
    </div>
  );
}

