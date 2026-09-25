import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  content?: string;
}

export default function AboutSection({
  title = 'About Sherman International',
  subtitle = 'Strategic Bridge Between Leading Global Manufacturers and the Indian Industry',
  content,
}: AboutSectionProps) {
  const defaultContent =
    'Sherman International Pvt. Ltd. is a trusted and forward-looking engineering solutions provider, acting as a strategic bridge between leading global manufacturers and the Indian industry. We specialize in representation, distribution, system integration, customization, and turnkey project execution across a wide range of industrial applications.\n\nBacked by a team of experienced and innovative technocrats, we work in close collaboration with our principals to deliver high-performance solutions that enhance operational efficiency, reduce costs, and ensure the highest standards of safety and reliability.';

  const displayContent = content || defaultContent;

  const keyCapabilities = [
    {
      title: 'Principal Representation & Distribution',
      desc: 'Authorized techno-commercial representation for global technology leaders in combustion systems, fluid control, dynamic balancing, and vibration diagnostics.',
    },
    {
      title: 'Technocrat Application Engineering',
      desc: 'Experienced engineers specializing in technical sizing, process parameters verification, and custom skid design.',
    },
    {
      title: 'EPC Portal & Documentation Support',
      desc: 'Extensive experience managing vendor documentation schedules (VDS), datasheets, inspection test plans (ITP), and regulatory compliance.',
    },
    {
      title: 'Comprehensive Lifecycle Support',
      desc: 'From initial technical consulting to on-site installation supervision, commissioning assistance, and genuine OEM spare parts supply.',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Company Narrative */}
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Company Overview
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {title}
            </h2>

            <p className="text-base text-sherman-800 font-medium leading-normal">
              {subtitle}
            </p>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              {displayContent.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sherman-700 hover:text-sherman-900"
              >
                <span>Read more about our vision, mission and capabilities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Key Capabilities Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keyCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="text-xs font-mono font-bold text-slate-400">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
