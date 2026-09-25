'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import Logo from './Logo';
import ProductsMegaMenu from './ProductsMegaMenu';
import SearchModal from './SearchModal';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  products: {
    id: string;
    name: string;
    slug: string;
    brandName?: string | null;
    shortDescription?: string | null;
  }[];
}

interface HeaderProps {
  categories?: CategoryItem[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products', hasMegaMenu: true },
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      {/* Top Corporate Information Bar */}
      <div className="bg-navy text-slate-300 text-xs border-b border-navy-light/40 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center font-normal">
          <div className="text-slate-300">
            Strategic Channel Partner & Engineering Solutions Provider in India
          </div>

          <div className="flex items-center gap-6 text-[11.5px]">
            <a
              href="mailto:admin@sherman-india.com"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>admin@sherman-india.com</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href="tel:+911143501200"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+91 11 4350 1200</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin/login"
              className="text-slate-400 hover:text-white transition-colors font-medium"
            >
              Portal Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white border-b ${
          isScrolled ? 'border-slate-200 shadow-sm py-3' : 'border-slate-200/80 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              if (link.hasMegaMenu) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                  >
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors py-1 ${
                        isActive
                          ? 'text-sherman-700 border-b-2 border-sherman-700'
                          : 'text-slate-700 hover:text-slate-950'
                      }`}
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                          isMegaMenuOpen ? 'rotate-180 text-sherman-700' : ''
                        }`}
                      />
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors py-1 ${
                    isActive
                      ? 'text-sherman-700 border-b-2 border-sherman-700'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                  onMouseEnter={() => setIsMegaMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-2 border border-slate-200 text-xs px-2.5"
              aria-label="Search site"
              title="Search products and brands"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 text-xs">Search</span>
            </button>

            <Link
              href="/contact?type=enquiry"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold text-white bg-navy hover:bg-sherman-800 transition-colors"
            >
              <span>Request an Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-md"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-900 hover:bg-slate-100 rounded-md"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Products Mega Menu */}
        {isMegaMenuOpen && (
          <ProductsMegaMenu
            categories={categories}
            onClose={() => setIsMegaMenuOpen(false)}
          />
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-50 bg-white border-t border-slate-200 flex flex-col justify-between overflow-y-auto p-5">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 text-sm font-semibold rounded-md ${
                pathname === '/' ? 'bg-slate-100 text-sherman-800' : 'text-slate-800'
              }`}
            >
              Home
            </Link>

            <div className="py-2">
              <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Product Categories
              </div>
              <div className="divide-y divide-slate-100 mt-1 pl-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-md"
            >
              Services & Integration
            </Link>

            <Link
              href="/industries"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-md"
            >
              Industries Served
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-md"
            >
              About Sherman
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-md"
            >
              Contact Us
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-200 space-y-3 pb-8">
            <Link
              href="/contact?type=enquiry"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-md bg-navy text-white font-semibold text-center text-xs flex items-center justify-center gap-2"
            >
              <span>Request an Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="text-center text-xs text-slate-500">
              E-105, Himalaya House, 23, K.G. Marg, New Delhi 110001
            </div>
          </div>
        </div>
      )}

      {/* Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
