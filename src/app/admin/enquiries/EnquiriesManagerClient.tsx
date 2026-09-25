'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  Trash2,
  Download,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import EnquiryStatusUpdater from '../EnquiryStatusUpdater';

interface EnquiryItem {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  productName: string | null;
  categoryName: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string | Date;
  product?: { name: string; slug: string; category: { slug: string } } | null;
}

export default function EnquiriesManagerClient({
  initialEnquiries,
}: {
  initialEnquiries: EnquiryItem[];
}) {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(
    enquiries.length > 0 ? enquiries[0] : null
  );

  const filtered = enquiries.filter((e) => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchSearch =
      !search.trim() ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(search.toLowerCase())) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.productName && e.productName.toLowerCase().includes(search.toLowerCase())) ||
      e.message.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Product', 'Status', 'Message'];
    const rows = enquiries.map((e) => [
      e.id,
      new Date(e.createdAt).toISOString(),
      `"${e.name.replace(/"/g, '""')}"`,
      `"${(e.company || '').replace(/"/g, '""')}"`,
      e.email,
      e.phone || '',
      `"${(e.productName || '').replace(/"/g, '""')}"`,
      e.status,
      `"${e.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sherman_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Customer Quotation & Sizing Enquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            All leads submitted across product pages, category catalogs, and the contact desk.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by customer name, company, email, or product..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-sherman-600 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
        >
          <option value="all">All Statuses ({enquiries.length})</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      {/* Enquiries Dual-Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Enquiries List (Col 1-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-h-[700px] flex flex-col">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700 bg-slate-50 flex items-center justify-between">
            <span>Enquiries List</span>
            <span className="text-[10px] text-slate-500">{filtered.length} found</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching enquiries found
              </div>
            ) : (
              filtered.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                return (
                  <button
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`w-full text-left p-4 transition-colors block ${
                      isSelected
                        ? 'bg-sherman-50/80 border-l-4 border-sherman-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {enq.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {formatDate(enq.createdAt)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium truncate mb-1">
                      {enq.company || enq.email}
                    </div>

                    <div className="text-xs font-semibold text-sherman-800 truncate mb-1.5">
                      {enq.productName || 'General Inquiry'}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase">
                        {enq.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Enquiry Details Card (Col 6-12) */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">
                    Enquiry Reference: <span className="font-mono text-slate-600">{selectedEnquiry.id.slice(0, 8)}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                    {selectedEnquiry.name}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <EnquiryStatusUpdater
                    id={selectedEnquiry.id}
                    currentStatus={selectedEnquiry.status}
                  />

                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Badge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Target Product / Equipment
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedEnquiry.productName || 'General Engineering Inquiry'}
                </div>
                {selectedEnquiry.categoryName && (
                  <div className="text-xs text-sherman-700 font-medium">
                    Category: {selectedEnquiry.categoryName}
                  </div>
                )}
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-500 block">Organization:</span>
                  <span className="text-slate-900 font-semibold">{selectedEnquiry.company || 'Not Specified'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-500 block">Email Address:</span>
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Sherman International - Regarding your enquiry for ${selectedEnquiry.productName || 'Engineering Solutions'}`}
                    className="text-sherman-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{selectedEnquiry.email}</span>
                    <Mail className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-500 block">Phone Number:</span>
                  <span className="text-slate-900 font-semibold">{selectedEnquiry.phone || 'Not Specified'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-500 block">Fast Response:</span>
                  {selectedEnquiry.phone ? (
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^\d]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.name)},%20thank%20you%20for%20contacting%20Sherman%20International%20regarding%20${encodeURIComponent(selectedEnquiry.productName || 'our engineering solutions')}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      Reply via WhatsApp →
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No phone provided</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Customer Message / Sizing Scope:
                </span>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Sherman International - Technical Proposal for ${selectedEnquiry.productName || 'Equipment'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-xs"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email Quotation</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select an enquiry from the left to view full customer details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
