'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Building2, X, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import { DEFAULT_BRAND_PLACEHOLDER, getImageUrl } from '@/lib/image';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  websiteUrl: string | null;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export default function BrandsManagerClient({
  initialBrands,
}: {
  initialBrands: BrandItem[];
}) {
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setLogo('');
    setWebsiteUrl('');
    setDescription('');
    setDisplayOrder(brands.length + 1);
    setIsActive(true);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (brand: BrandItem) => {
    setEditingId(brand.id);
    setName(brand.name);
    setSlug(brand.slug);
    setLogo(brand.logo || '');
    setWebsiteUrl(brand.websiteUrl || '');
    setDescription(brand.description || '');
    setDisplayOrder(brand.displayOrder);
    setIsActive(brand.isActive);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Brand name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name,
      slug: slug || slugify(name),
      logo,
      websiteUrl,
      description,
      displayOrder: Number(displayOrder),
      isActive,
    };

    try {
      const url = editingId ? `/api/brands/${editingId}` : '/api/brands';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save brand');

      if (editingId) {
        setBrands((prev) =>
          prev.map((b) => (b.id === editingId ? { ...b, ...data } : b))
        );
      } else {
        setBrands((prev) => [...prev, data]);
      }

      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, brandName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${brandName}"? Linked products will remain safe and their brand reference will be cleared.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete brand');
      }
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting brand');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sherman-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>OEM Partnerships</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Global Brands & Principals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage represented global OEM brands, manufacturers, logos, and partner catalogs.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-24">Logo</th>
              <th className="py-3 px-4">Brand / Principal</th>
              <th className="py-3 px-4">Website</th>
              <th className="py-3 px-4 text-center">Products</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Order</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-20 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1">
                    <img
                      src={getImageUrl(brand.logo, DEFAULT_BRAND_PLACEHOLDER)}
                      alt={brand.name}
                      className="max-h-8 max-w-[70px] object-contain"
                    />
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 text-sm">{brand.name}</div>
                  <div className="text-slate-500 text-[11px] line-clamp-1">
                    {brand.description || 'No description provided'}
                  </div>
                </td>

                <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                  {brand.websiteUrl ? (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sherman-700 hover:underline flex items-center gap-1"
                    >
                      <span className="line-clamp-1 max-w-[150px]">{brand.websiteUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    '—'
                  )}
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-sherman-50 text-sherman-800 font-bold">
                    {brand._count?.products ?? 0}
                  </span>
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      brand.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {brand.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>

                <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                  {brand.displayOrder}
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/brands/${brand.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sherman-700 hover:bg-slate-100 transition-colors"
                      title="Preview Brand Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openEdit(brand)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-sherman-700 hover:bg-slate-100 font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(brand.id, brand.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Brand Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingId ? 'Edit Brand Details' : 'Add New OEM Brand'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand / OEM Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. ZEECO"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="zeeco"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              {/* Brand Logo Upload */}
              <ImageUpload
                value={logo}
                onChange={(url) => setLogo(url)}
                folder="brands"
                label="Brand Logo"
                helperText="Upload official partner logo (SVG, PNG, WEBP, JPG)"
                fallback={DEFAULT_BRAND_PLACEHOLDER}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://www.zeeco.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of partner capabilities and technical domains..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="brandActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-sherman-600"
                  />
                  <label htmlFor="brandActive" className="text-xs font-bold text-slate-800">
                    Active on Website
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Create Brand'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
