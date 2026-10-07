import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, Cpu, FileText, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WhyShermanSection() {
  const trustPoints = [
    {
      title: 'Strategic Channel Partnership',
      description: 'Exclusive representation and techno-commercial distribution for world-renowned instrumentation and engineering brands.',
      icon: <Award className="w-5 h-5 text-amber-300" />,
      image: '/images/why-sherman/channel-partnership.jpg',
      alt: 'Industrial Engineering Channel Partnership',
    },
    {
      title: 'Technocrat & Engineering Depth',
      description: 'Our core team of seasoned technocrats provides expert technical consultation, application engineering, and dynamic testing.',
      icon: <Cpu className="w-5 h-5 text-amber-300" />,
      image: '/images/why-sherman/technocrat-depth.jpg',
      alt: 'Engineering Application Depth and Dynamic Balancing Lab',
    },
    {
      title: 'EPC Portal & Documentation Compliance',
      description: 'Extensive experience submitting vendor datasheets, drawings, and testing certifications across EPC contractor portals.',
      icon: <FileText className="w-5 h-5 text-amber-300" />,
      image: '/images/why-sherman/epc-compliance.jpg',
      alt: 'EPC Contractor Documentation and Project Review',
    },
    {
      title: 'End-to-End System Integration',
      description: 'Full packaging, skid integration, communication protocol conversion (Modbus, Profibus), and FAT/SAT trials.',
      icon: <Wrench className="w-5 h-5 text-amber-300" />,
      image: '/images/why-sherman/system-integration.jpg',
      alt: 'Industrial Automation and System Integration Skid',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: Trust Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs font-bold uppercase tracking-wider">
              <span>Why Partner With Sherman</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              An Established Engineering Partner for Core Industrial Sectors
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Serving key industrial sectors across Oil &amp; Gas, Power, Petrochemicals, Steel, and Railways, Sherman International acts as a vital bridge between global precision engineering and industrial requirements.
            </p>

            <div className="p-6 rounded-lg bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Core Value Delivery
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Prompt enquiry turnaround with direct technical assistance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Rigorous quality standards, ATEX / ISO / RDSO verified equipment.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>On-site commissioning assistance and genuine OEM spare parts supply.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-navy hover:bg-sherman-900 text-white text-sm font-semibold transition-colors"
              >
                <span>Read About Our Capabilities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Grid of Visual Trust Pillars with High-Quality Industrial Backgrounds */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="group relative min-h-[220px] rounded-lg overflow-hidden border border-slate-800 shadow-md flex flex-col justify-end p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Background Image */}
                <Image
                  src={point.image}
                  alt={point.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Multi-layered Readability Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/40 z-10" />

                {/* Card Content */}
                <div className="relative z-20 space-y-2.5">
                  <div className="p-2 rounded bg-white/10 backdrop-blur-md border border-white/20 w-fit">
                    {point.icon}
                  </div>
                  <h3 className="font-display font-bold text-base text-white leading-snug">
                    {point.title}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


