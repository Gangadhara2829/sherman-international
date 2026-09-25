import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';
import { DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: {
    products: number;
  };
}

interface CategoryGridProps {
  categories: CategoryItem[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Industrial Catalogue
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Product Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Precision flow measurement, process switches, dynamic balancing machines, vibration diagnostics, and combustion control instrumentation.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sherman-700 hover:text-sherman-900 self-start md:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-100 border-b border-slate-100">
                  <SafeImage
                    src={
                      cat.image ||
                      '/images/original/flow-measurement_ed663c7d9abc4a20a139cafedc21f016.jpg'
                    }
                    fallbackSrc="/images/original/flow-measurement_ed663c7d9abc4a20a139cafedc21f016.jpg"
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-sherman-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description || 'Specialized industrial equipment and technical support.'}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sherman-700">
                <span>Explore Range</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
