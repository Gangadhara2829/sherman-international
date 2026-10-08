'use client';

import React, { useState } from 'react';
import { Copy, Check, Upload, Image as ImageIcon, Search, Plus, CheckCircle2 } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminModal from '@/components/admin/AdminModal';

interface MediaItem {
  name: string;
  category: string;
  url: string;
}

export default function AdminMediaPage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState('Product');
  const [toast, setToast] = useState<string | null>(null);

  const [assets, setAssets] = useState<MediaItem[]>([
    {
      name: 'Process Engineering Refinery Facility',
      category: 'About / Hero',
      url: '/images/about/about-hero-bg.jpg',
    },
    {
      name: 'Precision Flow Instrumentation & Automation',
      category: 'Vision / Technology',
      url: '/images/about/vision-bg.jpg',
    },
    {
      name: 'Technocrat Machinery Assembly & Integration',
      category: 'Mission / Engineering',
      url: '/images/about/mission-bg.jpg',
    },
    {
      name: 'Industrial Channel Partnership',
      category: 'About / Strategic',
      url: '/images/why-sherman/channel-partnership.jpg',
    },
    {
      name: 'EPC Compliance & Turnkey Solutions',
      category: 'Service / Turnkey',
      url: '/images/why-sherman/epc-compliance.jpg',
    },
    {
      name: 'Combustion & Flame Scanner Visual',
      category: 'Product / Combustion',
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
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Image URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) return;

    const newAsset: MediaItem = {
      name: assetName.trim() || 'Uploaded Media Asset',
      category: assetCategory,
      url: uploadedUrl,
    };

    setAssets([newAsset, ...assets]);
    setShowUploadModal(false);
    setUploadedUrl('');
    setAssetName('');
    showToast('Asset added to library and ready to copy!');
  };

  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Media &amp; Asset Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and copy URLs for high-resolution graphics across products, brands, services, and website showcases.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search media assets by name, category, or path..."
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
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#061d43]/85 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-white">
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

      {/* Upload Asset Modal with Viewport Constraints */}
      <AdminModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Image Asset"
        subtitle="Upload a file to persistent server storage and generate a reusable image path."
        onSubmit={handleAddAsset}
        saveLabel="Add to Media Library"
      >
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Asset Label / Name
          </label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="e.g. Flame Scanner Inspection Skid"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Category / Tag
          </label>
          <select
            value={assetCategory}
            onChange={(e) => setAssetCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none bg-white"
          >
            <option value="Product">Product</option>
            <option value="Brand">Brand</option>
            <option value="Category">Category</option>
            <option value="Service">Service</option>
            <option value="Industry">Industry</option>
            <option value="General">General</option>
          </select>
        </div>

        <ImageUpload
          value={uploadedUrl}
          onChange={(url) => setUploadedUrl(url)}
          folder="general"
          label="Upload Local Image"
          helperText="Upload JPG, PNG, WEBP, SVG to persistent storage"
          required={true}
        />
      </AdminModal>
    </div>
  );
}
