import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import Logo from './Logo';
import { DEFAULT_CONTACT_INFO, NormalizedContactInfo } from '@/lib/content';

export interface FooterCategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface FooterServiceItem {
  id: string;
  name: string;
  slug: string;
}

interface FooterProps {
  categories?: FooterCategoryItem[];
  services?: FooterServiceItem[];
  contact?: NormalizedContactInfo;
}

export default function Footer({ categories = [], services = [], contact }: FooterProps) {
  const activeContact = contact || DEFAULT_CONTACT_INFO;
  const defaultProductLinks = [
    { label: 'Flow Measurement', href: '/products/flow-measurement' },
    { label: 'Process Switches', href: '/products/process-switches' },
    { label: 'Balancing Machine', href: '/products/balancing-machine' },
    { label: 'Process Technology', href: '/products/process-technology' },
    { label: 'Vibration Monitoring', href: '/products/vibration-monitoring-system' },
    { label: 'Combustion Control', href: '/products/combustion-control' },
    { label: 'Fluid Control', href: '/products/fluid-control' },
    { label: 'Railway OHE Fittings', href: '/products/ohe-fittings-and-accessories' },
  ];

  const defaultServiceLinks = [
    { label: 'Sales and Marketing', href: '/services/sales-and-marketing' },
    { label: 'Installation & Commissioning', href: '/services/installation-and-commissioning' },
    { label: 'System Integration', href: '/services/system-integration' },
    { label: 'After Sales Support', href: '/services/after-sales-support' },
    { label: 'Project Management', href: '/services/project-management' },
    { label: 'EPC & Turnkey Contracting', href: '/services/epc-and-turnkey-contracting' },
  ];

  const productLinks =
    categories && categories.length > 0
      ? categories.map((c) => ({
          label: c.name,
          href: `/products/${c.slug}`,
        }))
      : defaultProductLinks;

  const serviceLinks =
    services && services.length > 0
      ? services.map((s) => ({
          label: s.name,
          href: `/services/${s.slug}`,
        }))
      : defaultServiceLinks;

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Sherman', href: '/about' },
    { label: 'All Products', href: '/products' },
    { label: 'Our Partners', href: '/our-partners' },
    { label: 'Represented Brands', href: '/brands' },
    { label: 'Industries Served', href: '/industries' },
    { label: 'Engineering Services', href: '/services' },
    { label: 'Corporate Gallery', href: '/gallery' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="bg-navy-deep text-slate-300 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Company Brief (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="light" />

            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              {activeContact.description || DEFAULT_CONTACT_INFO.description}
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sherman-400 mt-0.5 flex-shrink-0" />
                <span className="break-words leading-relaxed">
                  {activeContact.address || DEFAULT_CONTACT_INFO.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sherman-400 flex-shrink-0" />
                <a
                  href={`mailto:${activeContact.enquiryEmail || activeContact.email || DEFAULT_CONTACT_INFO.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {activeContact.enquiryEmail || activeContact.email || DEFAULT_CONTACT_INFO.email}
                </a>
              </div>
              {activeContact.technicalSupportEmail &&
                activeContact.technicalSupportEmail !== (activeContact.enquiryEmail || activeContact.email) && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-sherman-400 flex-shrink-0" />
                    <a
                      href={`mailto:${activeContact.technicalSupportEmail}`}
                      className="hover:text-white transition-colors break-all"
                      title="Technical Support Desk"
                    >
                      {activeContact.technicalSupportEmail} (Support)
                    </a>
                  </div>
                )}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sherman-400 flex-shrink-0" />
                <a
                  href={`tel:${(activeContact.phone || DEFAULT_CONTACT_INFO.phone).replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {activeContact.phone || DEFAULT_CONTACT_INFO.phone}
                </a>
              </div>
              {activeContact.phoneSecondary &&
                activeContact.phoneSecondary !== activeContact.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-sherman-400 flex-shrink-0" />
                    <a
                      href={`tel:${activeContact.phoneSecondary.replace(/\s+/g, '')}`}
                      className="hover:text-white transition-colors"
                    >
                      {activeContact.phoneSecondary}
                    </a>
                  </div>
                )}
            </div>
          </div>

          {/* Product Categories (Col 5-7) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Product Solutions
            </h4>
            <ul className="space-y-1.5 text-xs">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services (Col 8-10) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Engineering Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links (Col 11-12) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-navy-deep/90 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <span className="text-slate-400 font-semibold">Sherman International (P) Limited</span>. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>ISO Compliant Solutions</span>
            <span>•</span>
            <span>New Delhi, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
