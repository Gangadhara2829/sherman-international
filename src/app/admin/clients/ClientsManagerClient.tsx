'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Building2,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Search,
  HelpCircle,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { DEFAULT_CLIENT_PLACEHOLDER, getImageUrl } from '@/lib/image';

interface ClientItem {
  id: string;
  name: string;
  logo: string;
  websiteUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function ClientsManagerClient({
  initialClients,
}: {
  initialClients: ClientItem[];
}) {
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setLogo('');
    setWebsiteUrl('');
    setDisplayOrder(clients.length + 1);
    setIsActive(true);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (client: ClientItem) => {
    setEditingId(client.id);
    setName(client.name);
    setLogo(client.logo || '');
    setWebsiteUrl(client.websiteUrl || '');
    setDisplayOrder(client.displayOrder);
    setIsActive(client.isActive);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Brand / Company name is required.');
      return;
    }
    if (!logo.trim()) {
      setError('Logo image path or upload is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      logo: logo.trim(),
      websiteUrl: websiteUrl ? websiteUrl.trim() : null,
      displayOrder: Number(displayOrder),
      isActive,
    };

    try {
      const url = editingId ? `/api/admin/clients/${editingId}` : '/api/admin/clients';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save client logo');

      if (editingId) {
        setClients((prev) =>
          prev
            .map((c) => (c.id === editingId ? data : c))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
        showToast('Client logo updated successfully!');
      } else {
        setClients((prev) =>
          [...prev, data].sort((a, b) => a.displayOrder - b.displayOrder)
        );
        showToast('Client logo added to carousel successfully!');
      }

      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${clientName}" from the "We Proudly Serve" carousel?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete client');
      }

      setClients((prev) => prev.filter((c) => c.id !== id));
      showToast(`Removed "${clientName}" from carousel.`);
    } catch (err: any) {
      alert(err.message || 'Error deleting client');
    }
  };

  const handleToggleActive = async (client: ClientItem) => {
    const updatedStatus = !client.isActive;
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, isActive: updatedStatus } : c))
      );
      showToast(`${client.name} is now ${updatedStatus ? 'Active in Carousel' : 'Hidden from Carousel'}.`);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredClients.length) return;

    const currentItem = filteredClients[index];
    const targetItem = filteredClients[newIndex];

    const updatedCurrentOrder = targetItem.displayOrder;
    const updatedTargetOrder = currentItem.displayOrder;

    const updatedList = clients
      .map((c) => {
        if (c.id === currentItem.id) return { ...c, displayOrder: updatedCurrentOrder };
        if (c.id === targetItem.id) return { ...c, displayOrder: updatedTargetOrder };
        return c;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    setClients(updatedList);

    try {
      await fetch('/api/admin/clients/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: currentItem.id, displayOrder: updatedCurrentOrder },
            { id: targetItem.id, displayOrder: updatedTargetOrder },
          ],
        }),
      });
    } catch (err) {
      console.error('Failed to persist order:', err);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sherman-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Homepage & Marketing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            We Proudly Serve / Brands Carousel
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Manage client organization and enterprise customer logos displayed in the continuous scrolling &ldquo;We Proudly Serve&rdquo; banner on the homepage.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand / Client Logo</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Client Guidelines:</span> This section represents reputable companies Sherman has proudly served (e.g., IndianOil, ONGC, NTPC, Shell, BPCL, BHEL, HPCL, Adani, Nayara Energy). Only active logos with <span className="font-semibold text-emerald-800">Active</span> status will appear in the frontend horizontal scrolling carousel in real time.
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sherman-600 focus:border-transparent"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredClients.length} of {clients.length} brands
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <div className="text-sm font-bold text-slate-700">No client logos found</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No brands match your search "${searchQuery}".`
                : 'No logos have been added to the "We Proudly Serve" section yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4">Logo Preview</th>
                  <th className="py-3 px-4">Company / Brand Name</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Display Order with Up/Down buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono font-bold text-slate-700 w-5">
                          {client.displayOrder}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveOrder(index, 'up')}
                            disabled={index === 0}
                            className={`p-0.5 rounded hover:bg-slate-200 text-slate-600 ${
                              index === 0 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(index, 'down')}
                            disabled={index === filteredClients.length - 1}
                            className={`p-0.5 rounded hover:bg-slate-200 text-slate-600 ${
                              index === filteredClients.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Logo Preview */}
                    <td className="py-3 px-4">
                      <div className="w-24 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 relative overflow-hidden shadow-2xs">
                        <img
                          src={getImageUrl(client.logo, DEFAULT_CLIENT_PLACEHOLDER)}
                          alt={client.name}
                          className="max-h-10 max-w-[80px] object-contain"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {client.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                        {client.logo}
                      </div>
                    </td>

                    {/* Website */}
                    <td className="py-3 px-4">
                      {client.websiteUrl ? (
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sherman-700 hover:underline text-[11px] font-medium"
                        >
                          <span className="truncate max-w-[140px]">
                            {client.websiteUrl.replace(/^https?:\/\//, '')}
                          </span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(client)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          client.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle visibility"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            client.isActive ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        />
                        <span>{client.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(client)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Edit Logo"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id, client.name)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Delete Logo"
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
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sherman-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingId ? 'Edit Client Logo' : 'Add Client Brand / Logo'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand / Organization Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., IndianOil, ONGC, NTPC Limited"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                />
              </div>

              {/* Logo Upload */}
              <ImageUpload
                value={logo}
                onChange={(url) => setLogo(url)}
                folder="clients"
                label="Client / Organization Logo"
                helperText="Upload official client logo (PNG, SVG, WEBP, JPG)"
                required={true}
                fallback={DEFAULT_CLIENT_PLACEHOLDER}
              />

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://iocl.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                />
              </div>

              {/* Display Order & Active status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Visibility Status
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-2 text-xs font-bold text-slate-700">
                        {isActive ? 'Active' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Add to Carousel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
