'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Wrench, CheckCircle2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminModal from '@/components/admin/AdminModal';
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
    setShortDescription('');
    setFullDescription('');
    setCapabilitiesText('');
    setImage('');
    setDisplayOrder(services.length + 1);
    setIsPublished(true);
    setError(null);
    setIsDirty(false);
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
    setCapabilitiesText(Array.isArray(caps) ? caps.join('\n') : '');

    setDisplayOrder(svc.displayOrder);
    setIsPublished(svc.isPublished);
    setError(null);
    setIsDirty(false);
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
      name: name.trim(),
      slug: slug ? slugify(slug) : slugify(name),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      capabilities: capsArray,
      image: image.trim(),
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

      const savedService = data.service || data;

      if (editingId) {
        setServices((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...savedService } : s))
        );
        showToast(`Service "${savedService.name}" updated successfully!`);
      } else {
        setServices((prev) => [...prev, savedService]);
        showToast(`Service "${savedService.name}" created successfully!`);
      }

      setIsDirty(false);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, svcName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${svcName}"? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete service');
      }
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast(`Service "${svcName}" deleted successfully.`);
    } catch (err: any) {
      alert(err.message || 'Error deleting service');
    }
  };

  const handleToggleStatus = async (svc: ServiceItem) => {
    const updatedStatus = !svc.isPublished;
    try {
      const res = await fetch(`/api/services/${svc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: updatedStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update service status');

      setServices((prev) =>
        prev.map((s) => (s.id === svc.id ? { ...s, isPublished: updatedStatus } : s))
      );
      showToast(`Service "${svc.name}" is now ${updatedStatus ? 'Published' : 'Hidden'}.`);
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
                  <button
                    onClick={() => handleToggleStatus(svc)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      svc.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {svc.isPublished ? 'Published' : 'Hidden'}
                  </button>
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
                      title="Delete Service"
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
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Engineering Service' : 'Add New Service Offering'}
        subtitle="Manage engineering service scope, deliverables, technical summary, and graphics."
        isEditing={Boolean(editingId)}
        loading={loading}
        error={error}
        isDirty={isDirty}
        onSubmit={handleSave}
        saveLabel={editingId ? 'Save Changes' : 'Create Service'}
        savingLabel={editingId ? 'Saving Changes...' : 'Creating Service...'}
      >
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
              setIsDirty(true);
              if (!editingId) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Installation & Commissioning"
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
            placeholder="installation-and-commissioning"
            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
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
            onChange={(e) => {
              setShortDescription(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Summary for homepage card"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Full Service Description
          </label>
          <textarea
            rows={3}
            value={fullDescription}
            onChange={(e) => {
              setFullDescription(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Detailed description of engineering methodology..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Capabilities &amp; Deliverables (One per line)
          </label>
          <textarea
            rows={3}
            value={capabilitiesText}
            onChange={(e) => {
              setCapabilitiesText(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Strategic principal representation&#10;Technical bid preparation&#10;Customized service contracts"
            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        {/* Service Image Upload */}
        <ImageUpload
          value={image}
          onChange={(url) => {
            setImage(url);
            setIsDirty(true);
          }}
          folder="services"
          label="Service Graphic Asset"
          helperText="Upload engineering photo (JPG, PNG, WEBP, SVG)"
          fallback={DEFAULT_SERVICE_PLACEHOLDER}
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
                id="svcPublished"
                checked={isPublished}
                onChange={(e) => {
                  setIsPublished(e.target.checked);
                  setIsDirty(true);
                }}
                className="w-4 h-4 rounded text-sherman-600 focus:ring-sherman-500 cursor-pointer"
              />
              <label htmlFor="svcPublished" className="text-xs font-bold text-slate-800 cursor-pointer">
                Publish on Website
              </label>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
