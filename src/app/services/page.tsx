import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import SafeImage from '@/components/SafeImage';
import EnquiryCtaBanner from '@/components/EnquiryCtaBanner';
import { DEFAULT_SERVICE_PLACEHOLDER } from '@/lib/image';

export const metadata = {
  title: 'Engineering Services & Solutions | Sherman International',
  description:
    'Comprehensive engineering services including sales & marketing representation, installation & commissioning, system integration, after-sales support, project management, and turnkey EPC contracting.',
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">Services</span>
        </nav>

        {/* Page Hero */}
        <div className="mb-16 border-b border-slate-200 pb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            SERVICES
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
            Engineering Services &amp; Solutions
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            From initial techno-commercial specification and EPC contractor documentation to on-site testing, commissioning, and routine predictive maintenance, Sherman delivers end-to-end industrial execution across India.
          </p>
        </div>

        {/* Alternating Editorial Services Stream */}
        <div className="space-y-20 lg:space-y-28 mb-24">
          {services.map((service, index) => {
            const isEven = index % 2 === 1; // 0: Image Left, 1: Image Right, 2: Image Left, 3: Image Right, etc.

            return (
              <section
                key={service.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* IMAGE COLUMN */}
                <div
                  className={`lg:col-span-6 w-full ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group block relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-xs"
                  >
                    <SafeImage
                      src={
                        service.image ||
                        '/images/services/installation-and-commissioning.jpg'
                      }
                      fallbackSrc={DEFAULT_SERVICE_PLACEHOLDER}
                      alt={service.name}
                      fill
                      priority={index < 2}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    />
                  </Link>
                </div>

                {/* CONTENT COLUMN */}
                <div
                  className={`lg:col-span-6 space-y-4 lg:space-y-5 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy leading-tight">
                    {service.name}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.fullDescription || service.shortDescription}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="group inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-sherman-700 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <EnquiryCtaBanner />
      </div>
    </div>
  );
}
