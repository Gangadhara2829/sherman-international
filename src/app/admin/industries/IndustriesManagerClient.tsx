'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Factory, X, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import { DEFAULT_INDUSTRY_PLACEHOLDER, getImageUrl } from '@/lib/image';

interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription: string | null;
  image: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export default function IndustriesManagerClient({
  initialIndustries,
}: {
  initialIndustries: IndustryItem[];
}) {
  const [industries, setIndustries] = useState<IndustryItem[]>(initialIndustries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setFullDescription('');
    setImage('');
    setDisplayOrder(industries.length + 1);
    setIsPublished(true);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (ind: IndustryItem) => {
    setEditingId(ind.id);
    setName(ind.name);
    setSlug(ind.slug);
    setDescription(ind.description);
    setFullDescription(ind.fullDescription || '');
    setImage(ind.image || '');
    setDisplayOrder(ind.displayOrder);
    setIsPublished(ind.isPublished);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Name and short description are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      fullDescription,
      image,
      displayOrder: Number(displayOrder),
      isPublished,
    };

    try {
      const url = editingId ? `/api/industries/${editingId}` : '/api/industries';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save industry');

      if (editingId) {
        setIndustries((prev) =>
          prev.map((i) => (i.id === editingId ? { ...i, ...data.industry } : i))
        );
      } else {
        setIndustries((prev) => [...prev, data.industry]);
      }

      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, indName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${indName}"?`)) return;

    try {
      const res = await fetch(`/api/industries/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete industry');
      }
      setIndustries((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting industry');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sherman-700 uppercase tracking-wider mb-1">
            <Factory className="w-4 h-4" />
            <span>Industrial Reach</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Target Industries & Sectors
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage industry application sectors, background hero graphics, and case domains.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Industry</span>
        </button>
      </div>

      {/* Industries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-24">Image</th>
              <th className="py-3 px-4">Industry Sector</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Order</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {industries.map((ind) => (
              <tr key={ind.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-20 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={getImageUrl(ind.image, DEFAULT_INDUSTRY_PLACEHOLDER)}
                      alt={ind.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 text-sm">{ind.name}</div>
                  <div className="text-slate-500 text-[11px] line-clamp-1">
                    {ind.description}
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  /{ind.slug}
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ind.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {ind.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </td>

                <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                  {ind.displayOrder}
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/industries/${ind.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sherman-700 hover:bg-slate-100 transition-colors"
                      title="Preview Industry Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openEdit(ind)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-sherman-700 hover:bg-slate-100 font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(ind.id, ind.name)}
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

      {/* Industry Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingId ? 'Edit Industry Sector' : 'Add New Industry Sector'}
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
                  Industry Sector Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Power Generation & Energy"
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
                  placeholder="power-generation"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary for homepage industry card"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Description & Application Overview
                </label>
                <textarea
                  rows={3}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed explanation of solutions and equipment supplied to this sector..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              {/* Industry Image Upload */}
              <ImageUpload
                value={image}
                onChange={(url) => setImage(url)}
                folder="industries"
                label="Sector Background Image"
                helperText="Upload industrial sector photo (JPG, PNG, WEBP, SVG)"
                fallback={DEFAULT_INDUSTRY_PLACEHOLDER}
              />

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
                    id="indPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-sherman-600"
                  />
                  <label htmlFor="indPublished" className="text-xs font-bold text-slate-800">
                    Publish on Website
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
                  <span>{editingId ? 'Save Changes' : 'Create Industry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
