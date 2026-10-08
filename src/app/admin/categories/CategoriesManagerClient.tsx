'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Layers, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminModal from '@/components/admin/AdminModal';
import { DEFAULT_PRODUCT_PLACEHOLDER, getImageUrl } from '@/lib/image';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export default function CategoriesManagerClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
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
    setDescription('');
    setImage('');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setError(null);
    setIsDirty(false);
    setShowModal(true);
  };

  const openEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setDisplayOrder(cat.displayOrder);
    setIsActive(cat.isActive);
    setError(null);
    setIsDirty(false);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      slug: slug ? slugify(slug) : slugify(name),
      description: description.trim(),
      image: image.trim(),
      displayOrder: Number(displayOrder),
      isActive,
    };

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save category');

      const savedCategory = data.category || data;

      if (editingId) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...savedCategory } : c))
        );
        showToast(`Category "${savedCategory.name}" updated successfully!`);
      } else {
        setCategories((prev) => [...prev, savedCategory]);
        showToast(`Category "${savedCategory.name}" created successfully!`);
      }

      setIsDirty(false);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast(`Category "${catName}" deleted successfully.`);
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    }
  };

  const handleToggleStatus = async (cat: CategoryItem) => {
    const updatedStatus = !cat.isActive;
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update category status');

      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: updatedStatus } : c))
      );
      showToast(`Category "${cat.name}" is now ${updatedStatus ? 'Active' : 'Disabled'}.`);
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
            <Layers className="w-4 h-4" />
            <span>Product Taxonomy</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Product Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage main engineering classifications, display ordering, and banner visuals.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-20">Banner</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-center">Products</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Order</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-16 h-10 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                    <img
                      src={getImageUrl(cat.image, DEFAULT_PRODUCT_PLACEHOLDER)}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 text-sm">{cat.name}</div>
                  <div className="text-slate-500 text-[11px] line-clamp-1">
                    {cat.description || 'No description provided'}
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  /{cat.slug}
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-sherman-50 text-sherman-800 font-bold">
                    {cat._count?.products ?? 0}
                  </span>
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      cat.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle active status"
                  >
                    {cat.isActive ? 'Active' : 'Disabled'}
                  </button>
                </td>

                <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                  {cat.displayOrder}
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/products/${cat.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sherman-700 hover:bg-slate-100 transition-colors"
                      title="Preview Category"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-sherman-700 hover:bg-slate-100 font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      title="Delete Category"
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

      {/* Responsive Viewport-Bounded AdminModal with Sticky Header & Sticky Footer */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Product Category' : 'Add New Category'}
        subtitle="Configure category name, slug, summary, banner visual, and display priority."
        isEditing={Boolean(editingId)}
        loading={loading}
        error={error}
        isDirty={isDirty}
        onSubmit={handleSave}
        saveLabel={editingId ? 'Save Changes' : 'Create Category'}
        savingLabel={editingId ? 'Saving Changes...' : 'Creating Category...'}
      >
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Category Name <span className="text-rose-500">*</span>
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
            placeholder="e.g. Flow Measurement"
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
            placeholder="flow-measurement"
            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
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
            placeholder="Short description displayed on category catalog and mega menu"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
          />
        </div>

        {/* Category Banner Image Upload */}
        <ImageUpload
          value={image}
          onChange={(url) => {
            setImage(url);
            setIsDirty(true);
          }}
          folder="categories"
          label="Category Banner Image"
          helperText="Upload category visual (JPG, PNG, WEBP, SVG)"
          fallback={DEFAULT_PRODUCT_PLACEHOLDER}
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
              Visibility Status
            </label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="catActive"
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.target.checked);
                  setIsDirty(true);
                }}
                className="w-4 h-4 rounded text-sherman-600 focus:ring-sherman-500 cursor-pointer"
              />
              <label htmlFor="catActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                Active on Site
              </label>
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
