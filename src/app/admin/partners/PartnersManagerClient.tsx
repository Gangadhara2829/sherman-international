'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Building2,
  Loader2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Search,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminModal from '@/components/admin/AdminModal';
import { PartnerItem } from '@/lib/partners';
import { DEFAULT_BRAND_PLACEHOLDER, getImageUrl } from '@/lib/image';

interface PartnersManagerClientProps {
  initialPartners: PartnerItem[];
}

export default function PartnersManagerClient({
  initialPartners,
}: PartnersManagerClientProps) {
  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setError(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setLogo('');
    setWebsiteUrl('');
    setDescription('');
    setDisplayOrder(partners.length + 1);
    setIsActive(true);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (item: PartnerItem) => {
    setEditingId(item.id);
    setName(item.name);
    setLogo(item.logo || '');
    setWebsiteUrl(item.websiteUrl || '');
    setDescription(item.description || '');
    setDisplayOrder(item.displayOrder);
    setIsActive(item.isActive);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Partner brand name is required.');
      return;
    }
    if (!logo.trim()) {
      setError('Partner logo is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      logo: logo.trim(),
      websiteUrl: websiteUrl ? websiteUrl.trim() : null,
      description: description ? description.trim() : null,
      displayOrder: Number(displayOrder) || 1,
      isActive,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/partners/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update partner');

        setPartners((prev) =>
          prev
            .map((p) => (p.id === editingId ? { ...p, ...data } : p))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
        showSuccess(`Partner "${payload.name}" updated successfully.`);
      } else {
        const res = await fetch('/api/admin/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add partner');

        setPartners((prev) =>
          [...prev, data].sort((a, b) => a.displayOrder - b.displayOrder)
        );
        showSuccess(`Partner "${payload.name}" added successfully.`);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving partner.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete partner');

      setPartners((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      showSuccess('Partner removed successfully.');
    } catch (err: any) {
      setError(err.message || 'Error deleting partner.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (partner: PartnerItem) => {
    try {
      const updatedStatus = !partner.isActive;
      const res = await fetch(`/api/admin/partners/${partner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      if (res.ok) {
        setPartners((prev) =>
          prev.map((p) => (p.id === partner.id ? { ...p, isActive: updatedStatus } : p))
        );
        showSuccess(`Partner "${partner.name}" ${updatedStatus ? 'enabled' : 'hidden'}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const newPartners = [...partners];
    const temp = newPartners[index];
    newPartners[index] = newPartners[targetIndex];
    newPartners[targetIndex] = temp;

    // Reassign sequential displayOrder
    const reordered = newPartners.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setPartners(reordered);

    try {
      await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reordered),
      });
      showSuccess('Display order saved.');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Our Partners Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage official OEM manufacturer brand logos, representative descriptions, and display orders shown on the public Our Partners page.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Partner</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partners by brand name..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sherman-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Partners: <strong className="text-slate-800 font-bold">{partners.length}</strong> (Active: {partners.filter((p) => p.isActive).length})
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4 w-28">Logo</th>
                <th className="py-3 px-4">Partner Brand</th>
                <th className="py-3 px-4">Website / Link</th>
                <th className="py-3 px-4 w-24 text-center">Status</th>
                <th className="py-3 px-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No partners found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((item, index) => {
                  const logoSrc = getImageUrl(item.logo, DEFAULT_BRAND_PLACEHOLDER);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        !item.isActive ? 'opacity-60 bg-slate-50/30' : ''
                      }`}
                    >
                      {/* Order Controls */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-bold text-slate-700 w-5">
                            {item.displayOrder}
                          </span>
                          <button
                            type="button"
                            disabled={index === partners.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Logo Preview */}
                      <td className="py-3 px-4">
                        <div className="w-20 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1 overflow-hidden">
                          <img
                            src={logoSrc}
                            alt={item.name}
                            className="max-h-8 max-w-[72px] object-contain"
                          />
                        </div>
                      </td>

                      {/* Brand Info */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {item.description}
                          </div>
                        )}
                      </td>

                      {/* Website */}
                      <td className="py-3 px-4">
                        {item.websiteUrl ? (
                          <a
                            href={item.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sherman-700 hover:text-sherman-900 font-medium inline-flex items-center gap-1 text-[11px]"
                          >
                            <span className="truncate max-w-[160px]">{item.websiteUrl}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            item.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {item.isActive ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                            title="Edit Partner"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                            title="Delete Partner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this partner record? This action will remove the partner logo and info from the public Our Partners page.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete Partner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Partner Brand' : 'Add New Partner Brand'}
        subtitle="Enter partner details, upload or replace logo, and configure public visibility."
        loading={loading}
        error={error}
        onSubmit={handleSave}
        saveLabel={editingId ? 'Save Changes' : 'Publish Partner'}
        savingLabel={editingId ? 'Saving Changes...' : 'Publishing Partner...'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Partner Brand Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ZEECO, Scherzinger, CEMB"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
            />
          </div>

          <div>
            <ImageUpload
              value={logo}
              onChange={(url) => setLogo(url)}
              folder="brands"
              label="Partner Brand Logo *"
              helperText="Upload transparent PNG, SVG, or WEBP (Max 10MB)"
              required
              aspectRatio="contain"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Website URL (Optional)
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.example.com"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Optional Representative Text / Specialty
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dynamic Balancing Machines & Vibration Monitoring"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="relative inline-flex items-center cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sherman-700"></div>
                <span className="ml-3 text-xs font-bold text-slate-700">
                  {isActive ? 'Visible' : 'Hidden'}
                </span>
              </label>
            </div>
          </div>

          {/* Live Preview Card */}
          {name && logo && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Card Preview on Public Grid
              </div>
              <div className="max-w-[200px] mx-auto bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center">
                <div className="h-16 w-full flex items-center justify-center p-1 bg-slate-50 rounded-lg">
                  <img
                    src={getImageUrl(logo, DEFAULT_BRAND_PLACEHOLDER)}
                    alt={name}
                    className="max-h-14 max-w-full object-contain"
                  />
                </div>
                <div className="font-bold text-xs text-slate-900 mt-2 text-center truncate w-full">
                  {name}
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
