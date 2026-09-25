import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';
import { DEFAULT_INDUSTRY_PLACEHOLDER } from '@/lib/image';

interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
}

interface IndustriesSectionProps {
  industries: IndustryItem[];
}

export default function IndustriesSection({ industries }: IndustriesSectionProps) {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Industrial Sectors
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Industries Served
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Delivering verified industrial instrumentation, combustion controls, dynamic balancing machines, and railway catenary fittings across India's core sectors.
            </p>
          </div>

          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sherman-700 hover:text-sherman-900 self-start md:self-auto"
          >
            <span>View All Industries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind) => (
            <Link
              key={ind.id}
              href={`/industries/${ind.slug}`}
              className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-900 border-b border-slate-100">
                  <SafeImage
                    src={
                      ind.image ||
                      '/images/industries/oil-gas.jpg'
                    }
                    fallbackSrc={DEFAULT_INDUSTRY_PLACEHOLDER}
                    alt={ind.name}
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-sm text-white">
                      {ind.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sherman-700">
                <span>View Applications</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
