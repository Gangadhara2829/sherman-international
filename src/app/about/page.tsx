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
  History,
  ArrowRight,
  FileText,
  Wrench,
  Layers,
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
    'Learn about Sherman International, our history as a strategic bridge for global OEMs, our Vision & Mission, and our technocrat engineering team.',
};

export default async function AboutPage() {
  const [aboutRecord, visionRecord, historyRecord] = await Promise.all([
    prisma.siteContent.findFirst({
      where: { key: { in: ['about_company', 'about_overview'] } },
    }),
    prisma.siteContent.findUnique({ where: { key: 'vision_mission' } }),
    prisma.siteContent.findUnique({ where: { key: 'company_history' } }),
  ]);

  const about = normalizeAboutContent(aboutRecord);
  const visionMission = normalizeVisionMission(visionRecord);

  // Parse milestones if present or use authentic defaults
  let milestones = [
    {
      year: '1973',
      title: "Foundation as 'Sherman Corporation'",
      description:
        "Began as a proprietorship with the aim of representing global manufacturers for the evolving Indian Process Industry.",
    },
    {
      year: '1980',
      title: "Evolution to 'Sherman International Private Limited'",
      description:
        "Evolved from a product provider to a comprehensive solution provider, reflecting our commitment to the evolving industry.",
    },
    {
      year: '1998',
      title: '25 Years of Industrial Service',
      description:
        'Celebrated 25 years of delivering quality engineering service to the Indian process and energy industries.',
    },
    {
      year: '2022',
      title: '50 Years of Engineering Excellence',
      description:
        'Celebrated 50 years of trusted representation, turnkey skid integration, and technological partnerships.',
    },
  ];

  if (historyRecord && historyRecord.content) {
    try {
      const parsed = JSON.parse(historyRecord.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        milestones = parsed;
      }
    } catch (e) {}
  }

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

            {/* Approved Narrative Paragraphs */}
            <div className="space-y-5 text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
              <p>{para1}</p>
              <p>{para2}</p>
            </div>

            {/* Trusted Track Record Section */}
            <div className="p-6 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h2 className="font-bold text-base sm:text-lg text-white">
                  Trusted Track Record &amp; Industrial Partnerships
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {para3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* SECTION 2: Our Core Capabilities & Engineering Pillars */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="max-w-3xl mb-8 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-[#061d43] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Approach &amp; Technocrat Depth
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Combining global manufacturing precision with hands-on Indian engineering support and documentation compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-colors space-y-3">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 w-fit text-[#061d43] shadow-xs">
                <Award className="w-5 h-5 text-[#061d43]" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Strategic Representation</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Direct authorized channel distribution for world-renowned instrumentation and process engineering OEMs.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-colors space-y-3">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 w-fit text-[#061d43] shadow-xs">
                <Cpu className="w-5 h-5 text-[#061d43]" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Application Engineering</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Expert technical consultation, custom skid engineering, process parameter verification, and dynamic testing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-colors space-y-3">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 w-fit text-[#061d43] shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-[#061d43]" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Lifecycle Support</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                On-site installation and commissioning assistance, FAT/SAT trials, troubleshooting, and genuine OEM spare parts supply.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Project & Engineering Expertise (EPC Contractor Portal Integration) */}
        <section className="bg-[#061d43] text-white rounded-2xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Project &amp; Engineering Expertise</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                EPC Contractor Documentation &amp; Portal Integration
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                In addition to representing world-class manufacturers, Sherman takes pride in project execution expertise. Our experienced engineering teams have worked on multiple portals for leading EPC contractors, supporting them in executing their projects with all required drawings, datasheets, inspection test plans (ITP), and regulatory certifications.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span>Drawings &amp; GA</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Vendor Drawings &amp; General Arrangement Layouts
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Cpu className="w-4 h-4 flex-shrink-0" />
                  <span>Calculations</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Process Datasheets &amp; Engineering Calculations
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>ITP &amp; MTRs</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Inspection Test Plans &amp; Material Test Reports
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Statutory Approvals</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  ATEX, PESO, CE &amp; RDSO Documentation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Our Vision & Our Mission (Distinct Relevant Industrial Backgrounds) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* OUR VISION */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4 group min-h-[320px]">
            {/* Background Image */}
            <SafeImage
              src="/images/about/vision-bg.jpg"
              fallbackSrc="/images/why-sherman/system-integration.jpg"
              alt="Sherman Industrial Vision - Future & Engineering Growth"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Dark Navy Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#061d43]/92 via-[#061d43]/88 to-[#061d43]/95 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 text-amber-400 rounded-lg border border-white/15 backdrop-blur-xs">
                  <Eye className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Guiding Principle
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Our Vision
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {visionMission.vision}
              </p>
            </div>
          </div>

          {/* OUR MISSION */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4 group min-h-[320px]">
            {/* Background Image */}
            <SafeImage
              src="/images/about/mission-bg.jpg"
              fallbackSrc="/images/why-sherman/technocrat-depth.jpg"
              alt="Sherman Industrial Mission - Engineering Solutions & Customer Execution"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Dark Navy Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#061d43]/92 via-[#061d43]/88 to-[#061d43]/95 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 text-amber-400 rounded-lg border border-white/15 backdrop-blur-xs">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Core Commitment
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Our Mission
                  </h3>
                </div>
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {visionMission.mission}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: 50+ Years Engineering Heritage (Milestones) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="max-w-3xl mb-8 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-[#061d43] flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" />
              <span>50+ Years of Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Journey &amp; Corporate Heritage
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Serving India&apos;s process and energy sectors continuously since 1973.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="text-xl font-black font-mono text-[#061d43]">
                    {m.year}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {m.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Bottom Technical Enquiry Banner */}
        <EnquiryCtaBanner />
      </div>
    </div>
  );
}
