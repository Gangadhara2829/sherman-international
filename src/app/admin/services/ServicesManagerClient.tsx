'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Wrench, X, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import { DEFAULT_SERVICE_PLACEHOLDER, getImageUrl } from '@/lib/image';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string | null;
  capabilities: string | null;
  image?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export default function ServicesManagerClient({
  initialServices,
}: {
  initialServices: ServiceItem[];
}) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [capabilitiesText, setCapabilitiesText] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setShortDescription('');
    setFullDescription('');
    setCapabilitiesText('');
    setImage('');
    setDisplayOrder(services.length + 1);
    setIsPublished(true);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (svc: ServiceItem) => {
    setEditingId(svc.id);
    setName(svc.name);
    setSlug(svc.slug);
    setShortDescription(svc.shortDescription);
    setFullDescription(svc.fullDescription || '');
    setImage(svc.image || '');

    let caps: string[] = [];
    try {
      if (svc.capabilities) caps = JSON.parse(svc.capabilities);
    } catch (e) {}
    setCapabilitiesText(caps.join('\n'));

    setDisplayOrder(svc.displayOrder);
    setIsPublished(svc.isPublished);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDescription.trim()) {
      setError('Name and short description are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const capsArray = capabilitiesText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      name,
      slug: slug || slugify(name),
      shortDescription,
      fullDescription,
      capabilities: capsArray,
      image,
      displayOrder: Number(displayOrder),
      isPublished,
    };

    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save service');

      if (editingId) {
        setServices((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...data.service } : s))
        );
      } else {
        setServices((prev) => [...prev, data.service]);
      }

      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, svcName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${svcName}"?`)) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete service');
      }
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting service');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sherman-700 uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            <span>Engineering Expertise</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Lifecycle Engineering Services
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage comprehensive engineering service offerings, technical scopes, and deliverables.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-24">Image</th>
              <th className="py-3 px-4">Service Domain</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Order</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((svc) => (
              <tr key={svc.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-20 h-12 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={getImageUrl(svc.image, DEFAULT_SERVICE_PLACEHOLDER)}
                      alt={svc.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 text-sm">{svc.name}</div>
                  <div className="text-slate-500 text-[11px] line-clamp-1">
                    {svc.shortDescription}
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  /{svc.slug}
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      svc.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {svc.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </td>

                <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                  {svc.displayOrder}
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/services/${svc.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sherman-700 hover:bg-slate-100 transition-colors"
                      title="Preview Service Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openEdit(svc)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-sherman-700 hover:bg-slate-100 font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(svc.id, svc.name)}
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

      {/* Service Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingId ? 'Edit Engineering Service' : 'Add New Service Offering'}
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
                  Service Domain Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Installation & Commissioning"
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
                  placeholder="installation-and-commissioning"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Summary for homepage card"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Service Description
                </label>
                <textarea
                  rows={3}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed description of engineering methodology..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Capabilities & Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={capabilitiesText}
                  onChange={(e) => setCapabilitiesText(e.target.value)}
                  placeholder="Strategic principal representation&#10;Technical bid preparation&#10;Customized service contracts"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 outline-none"
                />
              </div>

              {/* Service Image Upload */}
              <ImageUpload
                value={image}
                onChange={(url) => setImage(url)}
                folder="services"
                label="Service Graphic Asset"
                helperText="Upload engineering photo (JPG, PNG, WEBP, SVG)"
                fallback={DEFAULT_SERVICE_PLACEHOLDER}
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
                    id="svcPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-sherman-600"
                  />
                  <label htmlFor="svcPublished" className="text-xs font-bold text-slate-800">
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
                  <span>{editingId ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
