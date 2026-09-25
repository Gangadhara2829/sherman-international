'use client';

import React, { useState } from 'react';
import { Copy, Check, Upload, Image as ImageIcon, Search } from 'lucide-react';
import SafeImage from '@/components/SafeImage';

export default function AdminMediaPage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const sampleAssets = [
    {
      name: 'Combustion & Flame Scanner Visual',
      category: 'Product / Hero',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fluid Control & Flow Dividers',
      category: 'Product',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dynamic Balancing Machinery',
      category: 'Product',
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vibration Monitoring System',
      category: 'Product',
      url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Process Switches & Instrumentation',
      category: 'Product',
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Precision Flow Measurement Meters',
      category: 'Product',
      url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fused Sight Glass & Process Technology',
      category: 'Product',
      url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Railway OHE Cantilevers & Electrification',
      category: 'Product',
      url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Oil & Gas Sector Background',
      category: 'Industry',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Power & Thermal Generation Plant',
      category: 'Industry',
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'System Integration & Electronics Skids',
      category: 'Service',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'EPC Turnkey Project Execution',
      category: 'Service',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filtered = sampleAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Media &amp; Asset Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Optimized high-resolution images for products, brands, services, and industry showcases.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search media assets by name or category (e.g. Combustion, Industry, Flow)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-xs outline-none bg-transparent"
        />
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((asset, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <SafeImage
                  src={asset.url}
                  alt={asset.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-navy/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white">
                  {asset.category}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{asset.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 line-clamp-1 truncate">
                  {asset.url}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => handleCopy(asset.url)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-sherman-50 text-slate-700 hover:text-sherman-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedUrl === asset.url ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Image URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
