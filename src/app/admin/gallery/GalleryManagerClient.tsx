'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Images,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Search,
  ExternalLink,
  Tag,
  FolderPlus,
  Save,
  Check,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminModal from '@/components/admin/AdminModal';
import { getImageUrl, DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';
import { GalleryItem, DEFAULT_GALLERY_CATEGORIES } from '@/lib/gallery-types';

interface GalleryManagerClientProps {
  initialItems: GalleryItem[];
  initialCategories?: string[];
}

export default function GalleryManagerClient({
  initialItems,
  initialCategories = DEFAULT_GALLERY_CATEGORIES,
}: GalleryManagerClientProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Category management modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryOldName, setEditingCategoryOldName] = useState<string | null>(null);
  const [editingCategoryNewName, setEditingCategoryNewName] = useState('');
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Inline category add in photo modal
  const [showInlineNewCategory, setShowInlineNewCategory] = useState(false);
  const [inlineCategoryName, setInlineCategoryName] = useState('');

  // Photograph Form states
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const openAdd = () => {
    setEditingId(null);
    setTitle('');
    setCaption('');
    setAltText('');
    setImageUrl('');
    setCategory(categories[0] || 'Engineering');
    setDisplayOrder(items.length + 1);
    setIsPublished(true);
    setShowInlineNewCategory(false);
    setInlineCategoryName('');
    setError(null);
    setShowModal(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCaption(item.caption || '');
    setAltText(item.altText || '');
    setImageUrl(item.imageUrl || '');
    setCategory(item.category || categories[0] || 'Engineering');
    setDisplayOrder(item.displayOrder);
    setIsPublished(item.isPublished);
    setShowInlineNewCategory(false);
    setInlineCategoryName('');
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Image title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please select or upload an image.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title: title.trim(),
      caption: caption ? caption.trim() : null,
      altText: altText.trim() || title.trim(),
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      displayOrder: Number(displayOrder),
      isPublished,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/gallery/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update gallery image');

        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...data } : item))
        );
        showSuccess('Gallery photograph updated successfully.');
      } else {
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create gallery item');

        setItems((prev) => [...prev, data]);
        showSuccess('New gallery photograph published successfully.');
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete gallery item');
      }

      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteConfirmId(null);
      showSuccess('Gallery record removed successfully.');
    } catch (err: any) {
      setError(err.message || 'Delete operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (item: GalleryItem) => {
    const nextState = !item.isPublished;
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: nextState }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPublished: nextState } : i))
      );
      showSuccess(
        `Photograph ${nextState ? 'published to' : 'hidden from'} public gallery.`
      );
    } catch (err: any) {
      alert(err.message || 'Error toggling publish state.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedItems.length) return;

    const itemA = sortedItems[index];
    const itemB = sortedItems[targetIndex];

    const newOrderA = itemB.displayOrder;
    const newOrderB = itemA.displayOrder === itemB.displayOrder
      ? (direction === 'up' ? itemB.displayOrder + 1 : itemB.displayOrder - 1)
      : itemA.displayOrder;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemA.id) return { ...i, displayOrder: newOrderA };
        if (i.id === itemB.id) return { ...i, displayOrder: newOrderB };
        return i;
      })
    );

    try {
      await Promise.all([
        fetch(`/api/admin/gallery/${itemA.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: newOrderA }),
        }),
        fetch(`/api/admin/gallery/${itemB.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: newOrderB }),
        }),
      ]);
      showSuccess('Display sequence updated.');
    } catch (e) {
      console.error('Order reorder failed:', e);
    }
  };

  // Category Actions
  const handleAddCategory = async (catName: string, selectAfterAdd = false) => {
    const trimmed = catName.trim();
    if (!trimmed) return;

    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const res = await fetch('/api/admin/gallery/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');

      setCategories(data.categories);
      setNewCategoryName('');
      setInlineCategoryName('');
      setShowInlineNewCategory(false);
      if (selectAfterAdd) {
        setCategory(trimmed);
      }
      showSuccess(`Category "${trimmed}" added successfully.`);
    } catch (err: any) {
      setCategoryError(err.message || 'Failed to add category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedNew.toLowerCase() === oldName.toLowerCase()) {
      setEditingCategoryOldName(null);
      return;
    }

    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const res = await fetch('/api/admin/gallery/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName: trimmedNew }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to rename category');

      setCategories(data.categories);
      // Update local items category if affected
      setItems((prev) =>
        prev.map((item) =>
          item.category?.toLowerCase() === oldName.toLowerCase()
            ? { ...item, category: trimmedNew }
            : item
        )
      );
      if (selectedCategory.toLowerCase() === oldName.toLowerCase()) {
        setSelectedCategory(trimmedNew);
      }
      if (category.toLowerCase() === oldName.toLowerCase()) {
        setCategory(trimmedNew);
      }
      setEditingCategoryOldName(null);
      showSuccess(`Category renamed to "${trimmedNew}".`);
    } catch (err: any) {
      setCategoryError(err.message || 'Failed to rename category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const res = await fetch('/api/admin/gallery/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      setCategories(data.categories);
      const fallbackCat = data.categories.includes('General') ? 'General' : data.categories[0] || 'General';

      // Update local items category
      setItems((prev) =>
        prev.map((item) =>
          item.category?.toLowerCase() === catName.toLowerCase()
            ? { ...item, category: fallbackCat }
            : item
        )
      );
      if (selectedCategory.toLowerCase() === catName.toLowerCase()) {
        setSelectedCategory('ALL');
      }
      if (category.toLowerCase() === catName.toLowerCase()) {
        setCategory(fallbackCat);
      }
      setDeleteCategoryConfirm(null);
      showSuccess(`Category "${catName}" removed. Any associated photos moved to "${fallbackCat}".`);
    } catch (err: any) {
      setCategoryError(err.message || 'Failed to delete category');
    } finally {
      setCategoryLoading(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => a.displayOrder - b.displayOrder);

  // Category filter list (ALL + categories)
  const filterCategories = ['ALL', ...categories];

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sherman-700 uppercase tracking-wider mb-1">
            <Images className="w-4 h-4 text-sherman-600" />
            <span>Corporate Imagery Portfolio</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Gallery Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage authenticated company photographs, engineering installations, industrial equipment, and custom categories.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>Preview Public Gallery</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={() => {
              setCategoryError(null);
              setNewCategoryName('');
              setEditingCategoryOldName(null);
              setShowCategoryModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Add, rename or remove gallery categories"
          >
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photograph</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, caption, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sherman-600 focus:bg-white transition-all"
          />
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sherman-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {sortedItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Images className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No gallery photographs found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search or category filter.'
              : 'Add your first company photograph to showcase Sherman projects and facilities.'}
          </p>
          {!searchQuery && (
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sherman-700 text-white text-xs font-bold hover:bg-sherman-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photograph</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedItems.map((item, index) => {
            const imgSrc = getImageUrl(item.imageUrl, DEFAULT_PRODUCT_PLACEHOLDER);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Image Preview Container */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PRODUCT_PLACEHOLDER;
                      }}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-navy-deep/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Tag className="w-2.5 h-2.5 text-amber-400" />
                      <span>{item.category || 'General'}</span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        item.isPublished
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-amber-500/90 text-white'
                      }`}
                    >
                      {item.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{item.displayOrder}
                      </span>
                    </div>

                    {item.caption && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Reordering Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move up in order"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === sortedItems.length - 1}
                      className="p-1.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Move down in order"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTogglePublished(item)}
                      className={`p-1.5 rounded transition-colors ${
                        item.isPublished
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-amber-600 hover:bg-amber-50'
                      }`}
                      title={item.isPublished ? 'Hide from public' : 'Publish to gallery'}
                    >
                      {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded text-sherman-700 hover:bg-sherman-50 transition-colors"
                      title="Edit details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete photograph"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Add / Edit Photograph */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Gallery Photograph' : 'Add Gallery Photograph'}
        subtitle="Manage authentic company photographs, categories, and industrial installations."
        isEditing={Boolean(editingId)}
        loading={loading}
        error={error}
        onSubmit={handleSave}
        saveLabel={editingId ? 'Save Changes' : 'Create Photograph'}
        savingLabel={editingId ? 'Saving Changes...' : 'Creating Photograph...'}
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Photograph Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!altText) setAltText(e.target.value);
              }}
              placeholder="e.g. Turbine Dynamic Balancing Rig"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sherman-600 focus:outline-none"
            />
          </div>

          {/* Category & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowInlineNewCategory(!showInlineNewCategory)}
                  className="text-[11px] font-bold text-sherman-700 hover:text-sherman-800 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showInlineNewCategory ? 'Cancel' : 'Add New Category'}</span>
                </button>
              </div>

              {!showInlineNewCategory ? (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sherman-600 focus:outline-none bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inlineCategoryName}
                    onChange={(e) => setInlineCategoryName(e.target.value)}
                    placeholder="Type new category..."
                    className="flex-1 px-3 py-1.5 border border-amber-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    disabled={categoryLoading || !inlineCategoryName.trim()}
                    onClick={() => handleAddCategory(inlineCategoryName, true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sherman-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Caption / Descriptive Context (Optional)
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Brief professional description of this industrial equipment, project, or facility..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sherman-600 focus:outline-none"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alternative Text (Accessibility &amp; SEO)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive text for screen readers..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sherman-600 focus:outline-none"
            />
          </div>

          {/* Image Upload Component */}
          <div className="pt-2">
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              folder="gallery"
              label="Photograph File / Source *"
              helperText="Upload JPG, PNG, or WEBP (Max 10MB) or enter an external image URL."
              aspectRatio="video"
              required
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sherman-700"></div>
              <span className="ml-3 text-xs font-bold text-slate-700">
                {isPublished ? 'Published to Public Gallery' : 'Saved as Draft (Hidden)'}
              </span>
            </label>
          </div>

          {/* Live Preview Box */}
          {imageUrl && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Public Card Live Preview
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(imageUrl, DEFAULT_PRODUCT_PLACEHOLDER)}
                  alt="preview"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-200 bg-white"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">{title || 'Untitled Photograph'}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{caption || 'No caption'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminModal>

      {/* Dedicated Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-2xl shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Manage Gallery Categories</h3>
                  <p className="text-xs text-slate-500">Add, rename, or remove categories</p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {categoryError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                {categoryError}
              </div>
            )}

            {/* Add New Category Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Add New Category
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Field Operations, Certifications..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory(newCategoryName);
                    }
                  }}
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-sherman-600 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={categoryLoading || !newCategoryName.trim()}
                  onClick={() => handleAddCategory(newCategoryName)}
                  className="px-4 py-2 bg-sherman-700 hover:bg-sherman-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {categoryLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* List of Existing Categories */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Existing Categories ({categories.length})
              </label>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {categories.map((cat) => {
                  const isEditing = editingCategoryOldName === cat;
                  const count = items.filter(
                    (i) => i.category?.toLowerCase() === cat.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={cat}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between gap-3 text-xs"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingCategoryNewName}
                            onChange={(e) => setEditingCategoryNewName(e.target.value)}
                            className="flex-1 px-2.5 py-1 border border-sherman-400 rounded-lg text-xs focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameCategory(cat, editingCategoryNewName);
                              } else if (e.key === 'Escape') {
                                setEditingCategoryOldName(null);
                              }
                            }}
                          />
                          <button
                            type="button"
                            disabled={categoryLoading || !editingCategoryNewName.trim()}
                            onClick={() => handleRenameCategory(cat, editingCategoryNewName)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            title="Save Rename"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategoryOldName(null)}
                            className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{cat}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              {count} {count === 1 ? 'photo' : 'photos'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryOldName(cat);
                                setEditingCategoryNewName(cat);
                              }}
                              className="p-1.5 rounded-lg text-sherman-700 hover:bg-sherman-50 transition-colors"
                              title="Rename Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCategoryConfirm(cat)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Dialog */}
      {deleteCategoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-slate-900">
                Delete Category &ldquo;{deleteCategoryConfirm}&rdquo;?
              </h3>
              <p className="text-xs text-slate-500">
                Any photographs currently assigned to &ldquo;{deleteCategoryConfirm}&rdquo; will be safely moved to &ldquo;General&rdquo;.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCategoryConfirm(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={categoryLoading}
                onClick={() => handleDeleteCategory(deleteCategoryConfirm)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {categoryLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Photograph Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Delete Photograph?</h3>
              <p className="text-xs text-slate-500">
                This image will be permanently removed from the public gallery. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
