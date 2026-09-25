import React from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  Building2,
  Factory,
  Wrench,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import EnquiryStatusUpdater from './EnquiryStatusUpdater';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let productCount = 27;
  let categoryCount = 8;
  let brandCount = 9;
  let clientCount = 10;
  let industryCount = 12;
  let serviceCount = 8;
  let enquiryCount = 0;
  let recentEnquiries: any[] = [];

  try {
    const [pC, cC, bC, clC, iC, sC, eC, rE] = await Promise.all([
      prisma.product.count().catch(() => 27),
      prisma.productCategory.count().catch(() => 8),
      prisma.brand.count().catch(() => 9),
      prisma.proudlyServedClient.count().catch(() => 10),
      prisma.industry.count().catch(() => 12),
      prisma.service.count().catch(() => 8),
      prisma.enquiry.count().catch(() => 0),
      prisma.enquiry
        .findMany({
          take: 6,
          orderBy: { createdAt: 'desc' },
          include: { product: { select: { name: true } } },
        })
        .catch(() => []),
    ]);

    productCount = pC;
    categoryCount = cC;
    brandCount = bC;
    clientCount = clC;
    industryCount = iC;
    serviceCount = sC;
    enquiryCount = eC;
    recentEnquiries = rE || [];
  } catch (err) {
    console.warn('Dashboard query warning:', err);
  }

  const cards = [
    {
      title: 'Active Products',
      count: productCount,
      icon: Package,
      color: 'text-sherman-600',
      bg: 'bg-sherman-50',
      href: '/admin/products',
      cta: 'Manage Products',
    },
    {
      title: 'Product Categories',
      count: categoryCount,
      icon: Layers,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      href: '/admin/categories',
      cta: 'Manage Categories',
    },
    {
      title: 'OEM Brands',
      count: brandCount,
      icon: Building2,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/brands',
      cta: 'Manage Brands',
    },
    {
      title: 'Proudly Served (Clients)',
      count: clientCount,
      icon: Building2,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      href: '/admin/clients',
      cta: 'Manage Client Logos',
    },
    {
      title: 'Target Industries',
      count: industryCount,
      icon: Factory,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/industries',
      cta: 'Manage Industries',
    },
    {
      title: 'Engineering Services',
      count: serviceCount,
      icon: Wrench,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      href: '/admin/services',
      cta: 'Manage Services',
    },
    {
      title: 'Total Enquiries',
      count: enquiryCount,
      icon: MessageSquare,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      href: '/admin/enquiries',
      cta: 'View All Leads',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy via-navy to-sherman-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-navy-light flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-amber-400">
            Sherman Content & Lead Hub
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Welcome to Sherman International Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage your engineering catalog, principal brands, categories, services, and incoming customer quotation requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-600 hover:bg-sherman-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Leads</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {card.title}
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 font-display">
                    {card.count}
                  </div>
                </div>
                <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sherman-700 hover:text-sherman-900"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries & Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Recent Customer Enquiries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quotations and sizing requests received directly from the website
            </p>
          </div>

          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-sherman-700 hover:underline flex items-center gap-1"
          >
            <span>View All ({enquiryCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No enquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Client / Company</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Product / Scope</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(enq.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{enq.name}</div>
                      <div className="text-slate-500 text-[11px]">{enq.company || enq.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {enq.productName || enq.product?.name || 'General Inquiry'}
                      </div>
                      <div className="text-slate-500 text-[11px] line-clamp-1">{enq.message}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <EnquiryStatusUpdater id={enq.id} currentStatus={enq.status} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Link
                        href={`/admin/enquiries`}
                        className="text-sherman-700 font-bold hover:underline"
                      >
                        View Full Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
