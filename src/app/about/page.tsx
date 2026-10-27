import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  Target,
  Eye,
  CheckCircle2,
  FileCheck2,
  Building2,
  Award,
  Cpu,
  ArrowRight,
  FileText,
  Wrench,
  Layers,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import SafeImage from '@/components/SafeImage';
import EnquiryCtaBanner from '@/components/EnquiryCtaBanner';
import AboutStatsSection from '@/components/AboutStatsSection';
import FormattedContent, { isRichHtml } from '@/components/FormattedContent';
import {
  normalizeCompleteAboutPage,
} from '@/lib/content';

export const metadata = {
  title: 'About Us | Sherman International (P) Limited',
  description:
    'Learn about Sherman International, our history as a strategic bridge for global OEMs, our Vision & Mission, and our technocrat engineering team.',
};
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  const aboutRecords = await prisma.siteContent.findMany({
    where: {
      OR: [
        { section: 'about' },
        {
          key: {
            in: [
              'about_hero',
              'about_company',
              'about_overview',
              'about_expertise',
              'about_approach',
              'about_closing',
              'about_stats',
              'vision_mission',
            ],
          },
        },
      ],
    },
  });

  const aboutData = normalizeCompleteAboutPage(aboutRecords);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">About Us</span>
          </nav>
        </div>
      </div>

      {/* SECTION 1: ABOUT SHERMAN HERO/PROFILE (Full-Width Industrial Background with Navy Overlay) */}
      <section className="relative overflow-hidden bg-[#061d43] text-white py-14 sm:py-20 border-b border-slate-800 shadow-md">
        {/* Full-width realistic industrial engineering background */}
        <SafeImage
          src="/images/about/about-hero-bg.jpg"
          fallbackSrc="/images/original/home_1c3412a0fec94c2197c237bebf94896a.jpg"
          alt="Sherman International Industrial Process Engineering Facility"
          fill
          className="object-cover object-center pointer-events-none"
          priority
          sizes="100vw"
        />

        {/* Dark navy overlay / gradient for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061d43]/95 via-[#061d43]/90 to-[#061d43]/85 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-8">
            {/* Direct Heading — No Eyebrow / No Tagline */}
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {aboutData.hero.title}
              </h1>
              <div className="border-l-4 border-amber-500 pl-4 py-1">
                <p className="text-lg sm:text-xl font-bold text-amber-400">
                  {aboutData.hero.subtitle}
                </p>
              </div>
            </div>

            <div className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-3xl">
              <FormattedContent content={aboutData.hero.lead} variant="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* REDESIGNED ABOUT SHERMAN EDITORIAL CONTENT SECTION */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 lg:p-16 shadow-xs">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* SUBTOPIC 1: Trusted Engineering Solutions Provider */}
            <div className="space-y-5">
              <div className="border-l-4 border-sherman-600 pl-4 py-0.5">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {aboutData.overview.heading}
                </h2>
              </div>
              <div className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <FormattedContent content={aboutData.overview.content} />
              </div>
            </div>

            {/* SUBTOPIC 2: Project & Engineering Expertise */}
            <div className="space-y-5 pt-6 border-t border-slate-100">
              <div className="border-l-4 border-amber-500 pl-4 py-0.5">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {aboutData.expertise.heading}
                </h2>
              </div>
              <div className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <FormattedContent content={aboutData.expertise.content} />
              </div>
            </div>

            {/* SUBTOPIC 3: Our Approach */}
            <div className="space-y-5 pt-6 border-t border-slate-100">
              <div className="border-l-4 border-sherman-600 pl-4 py-0.5">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {aboutData.approach.heading}
                </h2>
              </div>
              <div className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <FormattedContent content={aboutData.approach.content} />
              </div>
            </div>

            {/* PROMINENT CONCLUDING BRAND STATEMENT */}
            <div className="pt-8 border-t border-slate-200">
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#061d43] via-[#092557] to-[#0c3172] text-white shadow-md border border-slate-800">
                <div className="font-display text-xl sm:text-2xl font-black text-amber-400 tracking-wide text-center sm:text-left">
                  {aboutData.closing.statement}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Animated Company Statistics (Some Cool Facts — Numbers Speak for Themselves) */}
        <AboutStatsSection stats={aboutData.stats} />

        {/* SECTION 4: Our Vision & Our Mission (Distinct Relevant Industrial Backgrounds) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* OUR VISION */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 group min-h-[320px] bg-[#020a17]">
            {/* Background Image - Subdued industrial texture with luminosity blend to eliminate bright pipe glare */}
            <SafeImage
              src="/images/about/vision-bg.jpg"
              fallbackSrc="/images/why-sherman/system-integration.jpg"
              alt="Sherman Industrial Vision - Future & Engineering Growth"
              fill
              className="object-cover opacity-25 mix-blend-luminosity transition-transform duration-700 group-hover:scale-105 group-hover:opacity-30"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* High-Density Deep Navy Scrim for 100% Pristine White Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020914]/95 via-[#031127]/90 to-[#020813]/98 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-400/30 backdrop-blur-md shadow-xs">
                  <Eye className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    {aboutData.visionMission.visionEyebrow}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {aboutData.visionMission.visionTitle}
                  </h3>
                </div>
              </div>
              <div className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed">
                <FormattedContent content={aboutData.visionMission.vision} variant="dark" />
              </div>
            </div>

            {/* Decorative Accent Anchor */}
            <div className="relative z-10 pt-2">
              <div className="h-1 w-12 bg-amber-400/80 rounded-full" />
            </div>
          </div>

          {/* OUR MISSION */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 group min-h-[320px] bg-[#020a17]">
            {/* Background Image - Subdued industrial texture with luminosity blend to eliminate blueprint glare */}
            <SafeImage
              src="/images/about/mission-bg.jpg"
              fallbackSrc="/images/why-sherman/technocrat-depth.jpg"
              alt="Sherman Industrial Mission - Engineering Solutions & Customer Execution"
              fill
              className="object-cover opacity-25 mix-blend-luminosity transition-transform duration-700 group-hover:scale-105 group-hover:opacity-30"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* High-Density Deep Navy Scrim for 100% Pristine White Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020914]/95 via-[#031127]/90 to-[#020813]/98 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-400/30 backdrop-blur-md shadow-xs">
                  <Target className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    {aboutData.visionMission.missionEyebrow}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {aboutData.visionMission.missionTitle}
                  </h3>
                </div>
              </div>
              <div className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed">
                <FormattedContent content={aboutData.visionMission.mission} variant="dark" />
              </div>
            </div>

            {/* Decorative Accent Anchor */}
            <div className="relative z-10 pt-2">
              <div className="h-1 w-12 bg-amber-400/80 rounded-full" />
            </div>
          </div>
        </section>

        {/* Bottom Technical Enquiry Banner */}
        <EnquiryCtaBanner />
      </div>
    </div>
  );
}
