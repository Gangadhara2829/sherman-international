import React from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Represented Global Principals & Brands | Sherman International',
  description:
    'Sherman International is the trusted strategic channel partner in India for world-class OEMs including ZEECO, Scherzinger, CEMB, Metrix, and Mid-West Instrument.',
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: { isPublished: true },
        select: { id: true, name: true, slug: true, category: { select: { slug: true } } },
      },
    },
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
          <span className="font-semibold text-slate-800">Brands</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs font-bold uppercase tracking-wider">
            <span>Principals & Partners</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Global Engineering Brands Represented by Sherman
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            We act as a strategic bridge in India, representing world-class manufacturers in flow measurement, process switches, combustion technology, fluid control, vibration analysis, and high-precision balancing machinery.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors p-6 flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-navy transition-colors">
                    {brand.name}
                  </h3>
                  {brand.websiteUrl && (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-slate-50 text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
                      title="Visit OEM Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {brand.description ||
                    'Internationally certified OEM engineering solutions distributed across the Indian industrial market.'}
                </p>

                {brand.products.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Key Equipment:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.category.slug}/${p.slug}`}
                          className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:underline"
                >
                  <span>Explore Brand Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  Authorized
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

