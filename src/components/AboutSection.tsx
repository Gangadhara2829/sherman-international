import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

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
  const defaultContent = `Sherman International Pvt. Ltd. is a trusted and forward-looking engineering solutions provider, acting as a strategic bridge between leading global manufacturers and the Indian industry. We specialize in representation, distribution, system integration, customization, and turnkey project execution across a wide range of industrial applications.

Backed by a team of experienced and innovative technocrats, we work in close collaboration with our principals to deliver high-performance solutions that enhance operational efficiency, reduce costs, and ensure the highest standards of safety and reliability. Our expertise extends beyond product supply to include technical consulting, system optimization, auditing, and after-sales support—enabling our customers to achieve sustainable and long-term success.

With a proven track record, Sherman has built strong partnerships with some of India's most prominent industrial organizations. Our commitment to quality, precision, and customer satisfaction makes us a preferred partner for advanced engineering solutions.`;

  const displayContent = content || defaultContent;
  const paragraphs = displayContent.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section Eyebrow & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sherman-700">
              <span className="w-2 h-2 rounded-full bg-sherman-600 inline-block" />
              <span>Corporate Profile &amp; Engineering Competencies</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed border-l-2 border-sherman-600 pl-4 py-0.5">
              {subtitle}
            </p>
          </div>

          {/* Narrative Content with Strong Corporate Readability */}
          <div className="space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed text-left">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-slate-700 font-normal">
                {para}
              </p>
            ))}
          </div>

          {/* Corporate Action Link */}
          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-sherman-700 transition-colors group"
            >
              <span>Read more about our vision, mission and capabilities</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

