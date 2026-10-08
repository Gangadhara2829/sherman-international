'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminModal from '@/components/admin/AdminModal';
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
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

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
    setIsDirty(false);
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
    setIsDirty(false);
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
      name: name.trim(),
      slug: slug ? slugify(slug) : slugify(name),
      logo: logo.trim(),
      websiteUrl: websiteUrl ? websiteUrl.trim() : null,
      description: description.trim(),
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

      // Correctly extract brand entity from response
      const savedBrand = data.brand || data;

      if (editingId) {
        setBrands((prev) =>
          prev.map((b) => (b.id === editingId ? { ...b, ...savedBrand } : b))
        );
        showToast(`Brand "${savedBrand.name}" updated successfully!`);
      } else {
        setBrands((prev) => [...prev, savedBrand]);
        showToast(`Brand "${savedBrand.name}" created successfully!`);
      }

      setIsDirty(false);
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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete brand');
      }
      setBrands((prev) => prev.filter((b) => b.id !== id));
      showToast(`Brand "${brandName}" deleted successfully.`);
    } catch (err: any) {
      alert(err.message || 'Error deleting brand');
    }
  };

  const handleToggleStatus = async (brand: BrandItem) => {
    const updatedStatus = !brand.isActive;
    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update brand status');

      setBrands((prev) =>
        prev.map((b) => (b.id === brand.id ? { ...b, isActive: updatedStatus } : b))
      );
      showToast(`Brand "${brand.name}" is now ${updatedStatus ? 'Active' : 'Hidden'}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sherman-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>OEM Partnerships</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Global Brands &amp; Principals
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
                  <button
                    onClick={() => handleToggleStatus(brand)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      brand.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle visibility"
                  >
                    {brand.isActive ? 'Active' : 'Hidden'}
                  </button>
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
                      title="Delete Brand"
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
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Brand Details' : 'Add New OEM Brand'}
        subtitle="Manage brand identity, official manufacturer logo, website, and portfolio summary."
        isEditing={Boolean(editingId)}
        loading={loading}
        error={error}
        isDirty={isDirty}
        onSubmit={handleSave}
        saveLabel={editingId ? 'Save Changes' : 'Create Brand'}
        savingLabel={editingId ? 'Saving Changes...' : 'Creating Brand...'}
      >
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
              setIsDirty(true);
              if (!editingId) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. ZEECO"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsDirty(true);
            }}
            placeholder="zeeco"
            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        {/* Brand Logo Upload */}
        <ImageUpload
          value={logo}
          onChange={(url) => {
            setLogo(url);
            setIsDirty(true);
          }}
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
            onChange={(e) => {
              setWebsiteUrl(e.target.value);
              setIsDirty(true);
            }}
            placeholder="https://www.zeeco.com"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Overview of partner capabilities and technical domains..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => {
                setDisplayOrder(Number(e.target.value));
                setIsDirty(true);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Visibility Status
            </label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="brandActive"
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.target.checked);
                  setIsDirty(true);
                }}
                className="w-4 h-4 rounded text-sherman-600 focus:ring-sherman-500 cursor-pointer"
              />
              <label htmlFor="brandActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                Active on Website
              </label>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
