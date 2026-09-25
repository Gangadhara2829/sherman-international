import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';
import { DEFAULT_SERVICE_PLACEHOLDER } from '@/lib/image';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image?: string | null;
}

interface ServicesSectionProps {
  services: ServiceItem[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Engineering Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">
              Core Engineering &amp; Lifecycle Services
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Comprehensive turnkey services supporting project developers, plant owners, and EPC contractors across India.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-sherman-700 self-start md:self-auto transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Corporate Services Grid with Authentic Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group rounded-lg border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                  <SafeImage
                    src={service.image || '/images/services/installation-and-commissioning.jpg'}
                    fallbackSrc={DEFAULT_SERVICE_PLACEHOLDER}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="font-bold text-base text-navy group-hover:text-sherman-800 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-sherman-700 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
