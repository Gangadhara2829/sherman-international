import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  Target,
  Eye,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import SafeImage from '@/components/SafeImage';
import EnquiryCtaBanner from '@/components/EnquiryCtaBanner';
import {
  normalizeAboutContent,
  normalizeVisionMission,
  DEFAULT_ABOUT_CONTENT,
} from '@/lib/content';

export const metadata = {
  title: 'About Us | Sherman International (P) Limited',
  description:
    'Learn about Sherman International, our history as a strategic bridge for global OEMs in India, our Vision & Mission, and our technocrat engineering team.',
};

export default async function AboutPage() {
  const [aboutRecord, visionRecord] = await Promise.all([
    prisma.siteContent.findFirst({
      where: { key: { in: ['about_company', 'about_overview'] } },
    }),
    prisma.siteContent.findUnique({ where: { key: 'vision_mission' } }),
  ]);

  const about = normalizeAboutContent(aboutRecord);
  const visionMission = normalizeVisionMission(visionRecord);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">About Us</span>
        </nav>

        {/* Page Hero */}
        <div className="bg-navy text-white rounded-lg p-8 sm:p-14 mb-10 border border-slate-800">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded bg-white/10 border border-white/15 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              About Sherman International
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Strategic Engineering Channel Partner in India
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Connecting global engineering excellence with Indian industry through representation, distribution, custom system integration, and turnkey execution.
            </p>
          </div>
        </div>

        {/* Main Company Story */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 sm:p-12 mb-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {about.title || 'A Strategic Bridge for Leading Global Manufacturers'}
              </h2>

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {about.content || DEFAULT_ABOUT_CONTENT.content}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-80 rounded bg-slate-900 border border-slate-200 overflow-hidden">
                <SafeImage
                  src={about.image || DEFAULT_ABOUT_CONTENT.image}
                  alt="Sherman Engineering Environment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600 text-center font-medium">
                Headquartered in New Delhi, India • Serving Core Industrial Sectors
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Vision */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 sm:p-10 space-y-4 shadow-xs">
            <div className="p-2.5 bg-slate-100 text-navy rounded w-fit border border-slate-200">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900">
              Our Vision
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {visionMission.vision}
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 sm:p-10 space-y-4 shadow-xs">
            <div className="p-2.5 bg-slate-100 text-navy rounded w-fit border border-slate-200">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900">
              Our Mission
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {visionMission.mission}
            </p>
          </div>
        </div>

        {/* EPC Documentation & Support Section */}
        <div className="bg-navy text-white rounded-lg p-8 sm:p-12 mb-12 border border-slate-800">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Project Execution & EPC Support
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              EPC Contractor Documentation & Portal Integration
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              In addition to representing world-class manufacturers, Sherman India takes pride in project execution expertise. Our experienced engineering teams have worked on multiple portals for leading EPC contractors, supporting them in executing their projects with all required drawings, datasheets, inspection test plans (ITP), and regulatory certifications.
            </p>
          </div>
        </div>

        <EnquiryCtaBanner />
      </div>
    </div>
  );
}
