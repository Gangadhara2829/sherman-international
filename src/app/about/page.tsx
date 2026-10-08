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
import FormattedContent, { isRichHtml } from '@/components/FormattedContent';
import {
  normalizeAboutContent,
  normalizeVisionMission,
  DEFAULT_ABOUT_CONTENT,
} from '@/lib/content';

export const metadata = {
  title: 'About Us | Sherman International (P) Limited',
  description:
    'Learn about Sherman International, our history as a strategic bridge for global OEMs, our Vision & Mission, and our technocrat engineering team.',
};
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  const [aboutRecord, visionRecord] = await Promise.all([
    prisma.siteContent.findFirst({
      where: { key: { in: ['about_company', 'about_overview'] } },
    }),
    prisma.siteContent.findUnique({ where: { key: 'vision_mission' } }),
  ]);

  const about = normalizeAboutContent(aboutRecord);
  const visionMission = normalizeVisionMission(visionRecord);

  const paragraphs = (about.content || DEFAULT_ABOUT_CONTENT.content)
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  const para1 =
    paragraphs[0] ||
    'Sherman International Pvt. Ltd. is a trusted and forward-looking engineering solutions provider, acting as a strategic bridge between leading global manufacturers and the Indian industry. We specialize in representation, distribution, system integration, customization, and turnkey project execution across a wide range of industrial applications.';

  const para2 =
    paragraphs[1] ||
    'Backed by a team of experienced and innovative technocrats, we work in close collaboration with our principals to deliver high-performance solutions that enhance operational efficiency, reduce costs, and ensure the highest standards of safety and reliability. Our expertise extends beyond product supply to include technical consulting, system optimization, auditing, and after-sales support—enabling our customers to achieve sustainable and long-term success.';

  const para3 =
    paragraphs[2] ||
    "With a proven track record, Sherman has built strong partnerships with some of India's most prominent industrial organizations. Our commitment to quality, precision, and customer satisfaction makes us a preferred partner for advanced engineering solutions.";

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
                {about.title || 'About Sherman'}
              </h1>
              <div className="border-l-4 border-amber-500 pl-4 py-1">
                <p className="text-lg sm:text-xl font-bold text-amber-400">
                  {about.subtitle || 'Trusted Engineering Solutions Provider'}
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-3xl">
              Industrial technology and solutions company working with leading global technology providers to bring advanced products, engineering expertise, and application-driven solutions to customers across the industrial sector.
            </p>
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
                  Trusted Engineering Solutions Provider
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <p>
                  Sherman is an industrial technology and solutions company, working with leading global technology providers to bring advanced products, engineering expertise, and application-driven solutions to customers across the industrial sector.
                </p>
                <p>
                  Our portfolio spans flow measurement, process control, analytical instrumentation, combustion technology, automation, and other critical industrial applications. Through our strong relationships with internationally recognized technology companies, we provide access to proven technologies and high-quality products, backed by the technical expertise required to apply them effectively.
                </p>
                <p>
                  At Sherman, we believe that delivering the right solution goes beyond supplying equipment. Our team brings together professionals with strong technical and industry experience, enabling us to understand our customers’ applications, processes, and project requirements. We provide technical and pre-sales support to help identify solutions that are technically appropriate, operationally reliable, and commercially sound.
                </p>
                <p>
                  Our involvement continues beyond the point of supply. Through comprehensive after-sales support and service, we work closely with our customers to ensure reliable operation, long-term performance, and maximum value from their investments.
                </p>
              </div>
            </div>

            {/* SUBTOPIC 2: Project & Engineering Expertise */}
            <div className="space-y-5 pt-6 border-t border-slate-100">
              <div className="border-l-4 border-amber-500 pl-4 py-0.5">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Project &amp; Engineering Expertise
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <p>
                  Sherman also brings significant expertise in project execution and engineering support, particularly in collaboration with EPC contractors and industrial project organizations.
                </p>
                <p>
                  Our experienced teams have supported projects through various EPC portals and execution platforms, managing and coordinating the required technical drawings, documentation, submissions, and project deliverables. This experience allows us to effectively bridge technology, engineering requirements, and project execution.
                </p>
              </div>
            </div>

            {/* SUBTOPIC 3: Our Approach */}
            <div className="space-y-5 pt-6 border-t border-slate-100">
              <div className="border-l-4 border-sherman-600 pl-4 py-0.5">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Our Approach
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <p>
                  Sherman brings together expertise from multiple industrial disciplines to develop technically robust, application-focused, and commercially viable solutions.
                </p>
                <p>
                  We take the time to understand the complete requirement—whether it is a process challenge, a specific application, a project specification, or a broader system requirement—and then bring together the appropriate technologies, products, and expertise to address it.
                </p>
                <p>
                  Our strength lies in combining global technology, local expertise, engineering understanding, and project experience to create meaningful value for our customers.
                </p>
                <p>
                  With established relationships across the global industrial technology ecosystem and a strong focus on technical excellence, project execution, and customer support, Sherman is committed to being a dependable technology and solutions company for the industries we serve.
                </p>
              </div>
            </div>

            {/* PROMINENT CONCLUDING BRAND STATEMENT */}
            <div className="pt-8 border-t border-slate-200">
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#061d43] via-[#092557] to-[#0c3172] text-white shadow-md border border-slate-800">
                <div className="font-display text-xl sm:text-2xl font-black text-amber-400 tracking-wide text-center sm:text-left">
                  Sherman — Technology. Expertise. Solutions.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Our Vision & Our Mission (Distinct Relevant Industrial Backgrounds) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* OUR VISION */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4 group min-h-[340px] bg-[#031127]">
            {/* Background Image */}
            <SafeImage
              src="/images/about/vision-bg.jpg"
              fallbackSrc="/images/why-sherman/system-integration.jpg"
              alt="Sherman Industrial Vision - Future & Engineering Growth"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Enhanced High-Contrast Dark Navy Overlay for Maximum Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#031229]/95 via-[#041836]/90 to-[#020b19]/98 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-400/30 backdrop-blur-md shadow-xs">
                  <Eye className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400 drop-shadow-xs">
                    Guiding Principle
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                    Our Vision
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed drop-shadow-xs">
                {visionMission.vision}
              </p>
            </div>
          </div>

          {/* OUR MISSION */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-lg p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4 group min-h-[340px] bg-[#031127]">
            {/* Background Image */}
            <SafeImage
              src="/images/about/mission-bg.jpg"
              fallbackSrc="/images/why-sherman/technocrat-depth.jpg"
              alt="Sherman Industrial Mission - Engineering Solutions & Customer Execution"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Enhanced High-Contrast Dark Navy Overlay for Maximum Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#031229]/95 via-[#041836]/90 to-[#020b19]/98 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-400/30 backdrop-blur-md shadow-xs">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400 drop-shadow-xs">
                    Core Commitment
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                    Our Mission
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed drop-shadow-xs">
                {visionMission.mission}
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Technical Enquiry Banner */}
        <EnquiryCtaBanner />
      </div>
    </div>
  );
}
