import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import SafeImage from '@/components/SafeImage';
import EnquiryCtaBanner from '@/components/EnquiryCtaBanner';
import { DEFAULT_INDUSTRY_PLACEHOLDER } from '@/lib/image';

export const metadata = {
  title: 'Industries We Power | Sherman International',
  description:
    'Sherman International provides certified instrumentation, flame detection, dynamic balancing, and fluid control solutions across Oil & Gas, Power, Petrochemicals, Steel, and Railways in India.',
};

export default async function IndustriesPage() {
  const industries = await prisma.industry.findMany({
    where: { isPublished: true },
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
          <span className="font-semibold text-slate-800">Industries</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs font-bold uppercase tracking-wider">
            <span>Sectors &amp; Applications</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Industrial Sectors We Power Across India
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Our engineered solutions and represented OEMs comply with rigorous sector requirements including hazardous area ATEX ratings, high vibration environments, and high-speed overhead railway standards.
          </p>
        </div>

        {/* Industries Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {industries.map((ind) => (
            <div
              key={ind.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden border-b border-slate-200">
                  <SafeImage
                    src={
                      ind.image ||
                      '/images/industries/oil-gas.jpg'
                    }
                    fallbackSrc={DEFAULT_INDUSTRY_PLACEHOLDER}
                    alt={ind.name}
                    fill
                    className="object-cover opacity-85"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4">
                    <h3 className="font-display font-bold text-lg text-white">
                      {ind.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ind.fullDescription || ind.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/industries/${ind.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:underline transition-colors"
                >
                  <span>Explore Industry Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <EnquiryCtaBanner />
      </div>
    </div>
  );
}
