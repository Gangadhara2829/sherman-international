import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';
import EnquiryCtaBanner from '@/components/EnquiryCtaBanner';

interface IndustryDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: IndustryDetailPageProps) {
  const industry = await prisma.industry.findUnique({
    where: { slug: params.slug },
  });

  if (!industry) return { title: 'Industry Not Found' };

  return {
    title: `${industry.name} Engineering Solutions | Sherman International`,
    description: industry.description,
  };
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const industry = await prisma.industry.findUnique({
    where: { slug: params.slug },
  });

  if (!industry) {
    notFound();
  }

  const allIndustries = await prisma.industry.findMany({
    where: { isPublished: true, id: { not: industry.id } },
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
          <Link href="/industries" className="hover:text-slate-900 transition-colors">
            Industries
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{industry.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-navy text-white rounded-lg p-8 sm:p-12 mb-10 border border-slate-800">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded bg-white/10 border border-white/15 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sector Specialization
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {industry.name}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              {industry.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-8 sm:p-10 space-y-6 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Sherman Solutions for {industry.name}
            </h2>

            <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
              {industry.fullDescription || industry.description}
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-3">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Why Industry Leaders Partner with Sherman
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Certified equipment meeting strict sector safety and ATEX ratings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Experienced technocrats ready for technical consultation, sizing, and integration.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>Prompt on-site installation, commissioning, FAT/SAT trials, and spare parts supply.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Other Industries Served
              </h4>
              <ul className="space-y-2 text-xs">
                {allIndustries.map((ind) => (
                  <li key={ind.id}>
                    <Link
                      href={`/industries/${ind.slug}`}
                      className="block p-3 rounded hover:bg-slate-50 border border-slate-200/60 text-slate-700 hover:text-navy font-semibold transition-colors"
                    >
                      {ind.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <EnquiryCtaBanner />
      </div>
    </div>
  );
}

