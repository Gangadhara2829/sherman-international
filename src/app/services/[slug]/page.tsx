import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import SafeImage from '@/components/SafeImage';
import EnquiryCtaBanner from '@/components/EnquiryCtaBanner';
import { DEFAULT_SERVICE_PLACEHOLDER } from '@/lib/image';

interface ServiceDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.name} | Sherman International Services`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });

  if (!service) {
    notFound();
  }

  let caps: string[] = [];
  try {
    if (service.capabilities) caps = JSON.parse(service.capabilities);
  } catch (e) {}

  const allServices = await prisma.service.findMany({
    where: { isPublished: true, id: { not: service.id } },
    take: 5,
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
          <Link href="/services" className="hover:text-slate-900 transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{service.name}</span>
        </nav>

        {/* Hero Banner with Title & Description */}
        <div className="bg-navy text-white rounded-lg p-8 sm:p-12 mb-10 border border-slate-800">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded bg-white/10 border border-white/15 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sherman Engineering Service
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {service.name}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Service Overview (Col 1-8) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs">
            {/* Large Service Image */}
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <SafeImage
                src={
                  service.image ||
                  '/images/services/installation-and-commissioning.jpg'
                }
                fallbackSrc={DEFAULT_SERVICE_PLACEHOLDER}
                alt={service.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Service Scope &amp; Execution
              </h2>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                {service.fullDescription ? (
                  service.fullDescription
                ) : service.shortDescription ? (
                  service.shortDescription
                ) : (
                  <p>
                    Sherman International (P) Limited provides comprehensive technical services for industrial clients across India. Our technocrat engineering team delivers hands-on support from preliminary sizing and documentation up to on-site testing and lifelong maintenance.
                  </p>
                )}
              </div>
            </div>

            {caps.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Key Capabilities &amp; Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caps.map((cap, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Service Enquiry Card */}
            <div className="bg-navy text-white rounded-lg p-6 space-y-4 border border-slate-800">
              <h4 className="font-display font-bold text-lg text-white">
                Require This Service?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with Sherman International's engineering team for site visits, vendor audit representation, or technical consulting.
              </p>
              <Link
                href={`/contact?subject=${encodeURIComponent('Service Enquiry: ' + service.name)}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-xs transition-colors"
              >
                <span>Request Service Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Other Services */}
            {allServices.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-xs">
                <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Other Engineering Services
                </h4>
                <div className="space-y-2">
                  {allServices.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="block p-2.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 text-xs font-semibold text-slate-700 hover:text-sherman-700 transition-colors"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <EnquiryCtaBanner />
      </div>
    </div>
  );
}
