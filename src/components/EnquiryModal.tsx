'use client';

import React, { createContext, useContext, useState } from 'react';
import { X, Send, CheckCircle2, Phone, Mail, Building, User, MessageSquare, Loader2, ShieldCheck } from 'lucide-react';

interface EnquiryContextType {
  openEnquiry: (productName?: string, categoryName?: string, productId?: string) => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [productId, setProductId] = useState<string | undefined>(undefined);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openEnquiry = (prodName?: string, catName?: string, prodId?: string) => {
    setProductName(prodName || '');
    setCategoryName(catName || '');
    setProductId(prodId);
    setSuccess(false);
    setError(null);
    setIsOpen(true);
  };

  const closeEnquiry = () => {
    setIsOpen(false);
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your Name, Email, and Message details.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          productId,
          productName: productName || 'General Engineering Enquiry',
          categoryName: categoryName || undefined,
          message,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit enquiry');
      }

      setSuccess(true);
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Sherman International, I would like to enquire about: ${
      productName || 'Engineering Solutions'
    }. Name: ${name || 'Prospective Client'}, Company: ${company || 'N/A'}`
  );

  return (
    <EnquiryContext.Provider value={{ openEnquiry, closeEnquiry }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-navy text-white p-6 relative border-b border-slate-800">
              <button
                onClick={closeEnquiry}
                className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Sherman Engineering Direct Enquiry</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {productName ? `Enquire: ${productName}` : 'Request Techno-Commercial Proposal'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Our application engineering team in New Delhi will review your technical requirements and respond promptly.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {success ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Enquiry Submitted Successfully</h4>
                    <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                      Thank you for contacting Sherman International (P) Limited. Our engineering desk has received your request and will contact you shortly at <span className="font-semibold text-slate-800">{email || 'your email'}</span>.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={closeEnquiry}
                      className="px-5 py-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors border border-slate-200"
                    >
                      Close
                    </button>
                    <a
                      href={`https://wa.me/919810024890?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-xs"
                    >
                      <span>Connect on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {error}
                    </div>
                  )}

                  {productName && (
                    <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Selected Solution:</span>
                        <div className="font-bold text-slate-900">{productName}</div>
                      </div>
                      {categoryName && (
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold text-[10px] uppercase">
                          {categoryName}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company / Organization
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Bharat Petroleum / NTPC"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Business Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone / Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Technical Requirement / Quantity / Scope <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe your operating parameters, quantities, pressure/temperature ratings, or specific questions..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <a
                      href={`https://wa.me/919810024890?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5"
                    >
                      <span>Direct WhatsApp Desk</span>
                    </a>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-navy hover:bg-sherman-900 text-white font-semibold text-sm transition-colors disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Direct communication with Sherman International (P) Ltd.</span>
              <span className="font-semibold text-slate-700">admin@sherman-india.com</span>
            </div>
          </div>
        </div>
      )}
    </EnquiryContext.Provider>
  );
}

