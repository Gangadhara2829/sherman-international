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
  Clock,
  ArrowRight,
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
    } catch (e) { }
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

      {/* Page Hero Banner */}
      <section className="bg-navy text-white py-12 sm:py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Corporate Profile &amp; Engineering Heritage</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              About Sherman International
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed pt-1">
              Acting as a strategic bridge between leading global manufacturers and Indian industry through authorized representation, distribution, system integration, and turnkey engineering solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* SECTION 1: About Sherman & Strategic Bridge (2-Column Editorial) */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Core Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-widest text-sherman-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sherman-600 inline-block" />
                  <span>Strategic Partner &amp; Solutions Provider</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {about.title || 'About Sherman'}
                </h2>
                <h3 className="text-sm sm:text-base font-semibold text-slate-600">
                  {about.subtitle || 'A Strategic Bridge for Leading Global Manufacturers'}
                </h3>
              </div>

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>{para1}</p>
                <p>{para2}</p>
              </div>

              <div className="pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    Trusted Track Record &amp; Industrial Partnerships
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {para3}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Industrial Visual Frame */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <SafeImage
                  src={about.image || '/images/why-sherman/channel-partnership.jpg'}
                  fallbackSrc="/images/why-sherman/channel-partnership.jpg"
                  alt="Sherman International Industrial Engineering Headquarters"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
              </div>

              {/* Verified Representation Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sherman-700" />
                  New Delhi Headquarters
                </span>
                <span className="text-slate-500 font-mono text-[11px]">Est. 1973</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Our Core Capabilities & Engineering Pillars */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-2xs">
          <div className="max-w-3xl mb-8 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-sherman-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sherman-600 inline-block" />
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
            <div className="p-6 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-3">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 w-fit text-navy shadow-2xs">
                <Award className="w-5 h-5 text-sherman-700" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Strategic Representation</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Direct authorized channel distribution for world-renowned instrumentation and engineering brands.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-3">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 w-fit text-navy shadow-2xs">
                <Cpu className="w-5 h-5 text-sherman-700" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Application Engineering</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Expert technical consultation, custom skid engineering, process parameter verification, and dynamic testing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-3">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 w-fit text-navy shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-sherman-700" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Lifecycle Support</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                On-site installation and commissioning assistance, FAT/SAT trials, troubleshooting, and genuine OEM spare parts supply.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Project & Engineering Expertise (EPC Contractor Portal Integration) */}
        <section className="bg-navy text-white rounded-2xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <FileCheck2 className="w-4 h-4" />
                <span>Project Execution &amp; EPC Portal Documentation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                EPC Contractor Documentation &amp; Portal Integration
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                In addition to representing world-class manufacturers, Sherman takes pride in project execution expertise. Our experienced engineering teams have worked on multiple portals for leading EPC contractors, supporting them in executing their projects with all required drawings, datasheets, inspection test plans (ITP), and regulatory certifications.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-2.5 text-xs text-slate-200">
              <div className="p-3 rounded-lg bg-white/10 border border-white/15 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Vendor Drawings &amp; General Arrangement (GA)</span>
              </div>
              <div className="p-3 rounded-lg bg-white/10 border border-white/15 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Process Datasheets &amp; Engineering Calculations</span>
              </div>
              <div className="p-3 rounded-lg bg-white/10 border border-white/15 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Inspection Test Plans (ITP) &amp; MTRs</span>
              </div>
              <div className="p-3 rounded-lg bg-white/10 border border-white/15 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>ATEX, PESO, CE &amp; RDSO Documentation</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Vision & Mission (2-Column Balanced Cards with Industrial Backgrounds) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Vision */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4 group min-h-[300px]">
            {/* Industrial Vision Background Image */}
            <SafeImage
              src="/images/about/vision-bg.jpg"
              fallbackSrc="/images/why-sherman/system-integration.jpg"
              alt="Sherman Industrial Vision - Advanced Process Engineering"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Subtle Navy / Dark Overlay for Enhanced Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#061d43]/90 via-[#061d43]/88 to-[#061d43]/95 pointer-events-none" />

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

          {/* Mission */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4 group min-h-[300px]">
            {/* Industrial Mission Background Image */}
            <SafeImage
              src="/images/about/mission-bg.jpg"
              fallbackSrc="/images/why-sherman/technocrat-depth.jpg"
              alt="Sherman Industrial Mission - Technocrat Engineering & Project Delivery"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Subtle Navy / Dark Overlay for Enhanced Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#061d43]/90 via-[#061d43]/88 to-[#061d43]/95 pointer-events-none" />

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
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-2xs">
          <div className="max-w-3xl mb-8 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-sherman-700 flex items-center gap-1.5">
              <History className="w-4 h-4 text-sherman-600" />
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
                className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="text-lg font-black font-mono text-sherman-700">
                    {m.year}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
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


