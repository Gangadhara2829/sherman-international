'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Factory, CheckCircle2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminModal from '@/components/admin/AdminModal';
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
    setDescription('');
    setFullDescription('');
    setImage('');
    setDisplayOrder(industries.length + 1);
    setIsPublished(true);
    setError(null);
    setIsDirty(false);
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
    setIsDirty(false);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Name and short summary are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      slug: slug ? slugify(slug) : slugify(name),
      description: description.trim(),
      fullDescription: fullDescription.trim(),
      image: image.trim(),
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

      const savedIndustry = data.industry || data;

      if (editingId) {
        setIndustries((prev) =>
          prev.map((i) => (i.id === editingId ? { ...i, ...savedIndustry } : i))
        );
        showToast(`Industry "${savedIndustry.name}" updated successfully!`);
      } else {
        setIndustries((prev) => [...prev, savedIndustry]);
        showToast(`Industry "${savedIndustry.name}" created successfully!`);
      }

      setIsDirty(false);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, indName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${indName}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/industries/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete industry');
      }
      setIndustries((prev) => prev.filter((i) => i.id !== id));
      showToast(`Industry "${indName}" deleted successfully.`);
    } catch (err: any) {
      alert(err.message || 'Error deleting industry');
    }
  };

  const handleToggleStatus = async (ind: IndustryItem) => {
    const updatedStatus = !ind.isPublished;
    try {
      const res = await fetch(`/api/industries/${ind.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: updatedStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update industry status');

      setIndustries((prev) =>
        prev.map((i) => (i.id === ind.id ? { ...i, isPublished: updatedStatus } : i))
      );
      showToast(`Industry "${ind.name}" is now ${updatedStatus ? 'Published' : 'Hidden'}.`);
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
            <Factory className="w-4 h-4" />
            <span>Industrial Reach</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Target Industries &amp; Sectors
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
                  <button
                    onClick={() => handleToggleStatus(ind)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      ind.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle published status"
                  >
                    {ind.isPublished ? 'Published' : 'Hidden'}
                  </button>
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
                      title="Delete Industry"
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
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Industry Sector' : 'Add New Industry Sector'}
        subtitle="Configure industry sector name, slug, overview summary, and graphic visual."
        isEditing={Boolean(editingId)}
        loading={loading}
        error={error}
        isDirty={isDirty}
        onSubmit={handleSave}
        saveLabel={editingId ? 'Save Changes' : 'Create Industry'}
        savingLabel={editingId ? 'Saving Changes...' : 'Creating Industry...'}
      >
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
              setIsDirty(true);
              if (!editingId) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Power Generation & Energy"
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
            placeholder="power-generation"
            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
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
            onChange={(e) => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Summary for homepage industry card"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Full Description &amp; Application Overview
          </label>
          <textarea
            rows={3}
            value={fullDescription}
            onChange={(e) => {
              setFullDescription(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Detailed explanation of solutions and equipment supplied to this sector..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        {/* Industry Image Upload */}
        <ImageUpload
          value={image}
          onChange={(url) => {
            setImage(url);
            setIsDirty(true);
          }}
          folder="industries"
          label="Sector Background Image"
          helperText="Upload industrial sector photo (JPG, PNG, WEBP, SVG)"
          fallback={DEFAULT_INDUSTRY_PLACEHOLDER}
        />

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
              Publishing Status
            </label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="indPublished"
                checked={isPublished}
                onChange={(e) => {
                  setIsPublished(e.target.checked);
                  setIsDirty(true);
                }}
                className="w-4 h-4 rounded text-sherman-600 focus:ring-sherman-500 cursor-pointer"
              />
              <label htmlFor="indPublished" className="text-xs font-bold text-slate-800 cursor-pointer">
                Publish on Website
              </label>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
