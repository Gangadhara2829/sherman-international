import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileText,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductDetailActions from './ProductDetailActions';
import { DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface ProductDetailPageProps {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, brand: true },
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Sherman International`,
    description:
      product.shortDescription ||
      `Technical specifications and details for ${product.name} supplied by Sherman International.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, brand: true },
  });

  if (!product || product.category.slug !== params.category) {
    notFound();
  }

  // Parse JSON fields safely
  let specs: { label: string; value: string }[] = [];
  try {
    if (product.specifications) {
      const parsed = JSON.parse(product.specifications);
      if (Array.isArray(parsed)) {
        specs = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        specs = Object.entries(parsed).map(([k, v]) => ({
          label: k,
          value: String(v),
        }));
      }
    }
  } catch (e) {
    specs = [];
  }

  let features: string[] = [];
  try {
    if (product.features) {
      features = JSON.parse(product.features);
    }
  } catch (e) {
    features = [];
  }

  let applications: string[] = [];
  try {
    if (product.applications) {
      applications = JSON.parse(product.applications);
    }
  } catch (e) {
    applications = [];
  }

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    include: { category: true, brand: true },
    take: 3,
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-slate-900 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/products/${product.category.slug}`}
            className="hover:text-slate-900 transition-colors"
          >
            {product.category.name}
          </Link>
          {product.brand && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href={`/brands/${product.brand.slug}`}
                className="hover:text-slate-900 transition-colors"
              >
                {product.brand.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Overview Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT: Product Image */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-80 sm:h-96 w-full rounded bg-slate-100 border border-slate-200 overflow-hidden">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  fallbackSrc={DEFAULT_PRODUCT_PLACEHOLDER}
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              {/* Verified Partner Stamp */}
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Direct OEM Supply & Warranty
                </span>
                <span className="font-mono text-[10px] text-slate-500">Sherman Certified</span>
              </div>
            </div>

            {/* RIGHT: Product Information & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category & Brand badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200">
                  {product.category.name}
                </span>

                {product.brand && (
                  <Link
                    href={`/brands/${product.brand.slug}`}
                    className="px-2.5 py-1 rounded bg-navy text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-sherman-900 transition-colors"
                  >
                    <span>Brand: {product.brand.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Main Title */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-base text-slate-700 font-medium leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Full Description text */}
              <div className="text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line border-t border-b border-slate-200 py-4">
                {product.description}
              </div>

              {/* Direct Enquiry Actions */}
              <ProductDetailActions
                productName={product.name}
                categoryName={product.category.name}
                productId={product.id}
              />
            </div>
          </div>
        </div>

        {/* Specifications & Features & Applications Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Technical Specifications (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <FileText className="w-5 h-5 text-navy" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Technical Specifications
                </h3>
              </div>

              {specs.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {specs.map((spec, i) => (
                    <div
                      key={i}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm"
                    >
                      <span className="font-semibold text-slate-700 sm:w-1/2">
                        {spec.label}
                      </span>
                      <span className="text-slate-900 font-mono sm:w-1/2 text-left sm:text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4">
                  Datasheet specifications are customized to client installation parameters. Please request a full technical datasheet from Sherman International.
                </p>
              )}
            </div>

            {/* Key Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <ShieldCheck className="w-5 h-5 text-navy" />
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Key Features & Engineering Benefits
                  </h3>
                </div>

                <ul className="space-y-2.5">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Applications & Brand Info (Col 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Target Industrial Applications */}
            {applications.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Tag className="w-5 h-5 text-navy" />
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Industrial Applications
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Principal OEM Representation Box */}
            {product.brand && (
              <div className="bg-navy text-white rounded-lg border border-slate-800 p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                    Global Principal OEM
                  </span>
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>

                <h4 className="font-display text-xl font-bold text-white">
                  {product.brand.name}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.brand.description ||
                    'Represented in India by Sherman International (P) Limited.'}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/brands/${product.brand.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                  >
                    <span>View all {product.brand.name} equipment in India</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="font-display text-2xl font-bold text-slate-900">
              Related Solutions in {product.category.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.category.slug}/${rel.slug}`}
                  className="group bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors p-5 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 w-full rounded bg-slate-100 overflow-hidden border border-slate-100">
                      <SafeImage
                        src={rel.image}
                        alt={rel.name}
                        fill
                        className="object-cover"
                        fallbackSrc={DEFAULT_PRODUCT_PLACEHOLDER}
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                    <h4 className="font-bold text-base text-slate-900 group-hover:text-navy transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy">
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

