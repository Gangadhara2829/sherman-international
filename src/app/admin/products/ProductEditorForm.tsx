'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';
import { DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/image';

interface ProductEditorFormProps {
  initialProduct?: any;
  categories: any[];
  brands: any[];
}

export default function ProductEditorForm({
  initialProduct,
  categories,
  brands,
}: ProductEditorFormProps) {
  const isEditing = Boolean(initialProduct);
  const router = useRouter();

  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || (categories.length > 0 ? categories[0].id : '')
  );
  const [brandId, setBrandId] = useState(initialProduct?.brandId || '');
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ''
  );
  const [description, setDescription] = useState(
    initialProduct?.description || ''
  );
  const [image, setImage] = useState(initialProduct?.image || '');
  const [isPublished, setIsPublished] = useState(
    initialProduct ? initialProduct.isPublished : true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialProduct ? initialProduct.isFeatured : false
  );
  const [displayOrder, setDisplayOrder] = useState(
    initialProduct ? initialProduct.displayOrder : 0
  );

  // Specifications
  let initialSpecs = [{ label: '', value: '' }];
  try {
    if (initialProduct?.specifications) {
      const parsed = JSON.parse(initialProduct.specifications);
      if (Array.isArray(parsed)) {
        initialSpecs = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        initialSpecs = Object.entries(parsed).map(([k, v]) => ({
          label: k,
          value: String(v),
        }));
      }
    }
  } catch (e) {}
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    initialSpecs.length > 0 ? initialSpecs : [{ label: '', value: '' }]
  );

  // Features
  let initialFeats = [''];
  try {
    if (initialProduct?.features) {
      initialFeats = JSON.parse(initialProduct.features);
    }
  } catch (e) {}
  const [features, setFeatures] = useState<string[]>(initialFeats);

  // Applications
  let initialApps = [''];
  try {
    if (initialProduct?.applications) {
      initialApps = JSON.parse(initialProduct.applications);
    }
  } catch (e) {}
  const [applications, setApplications] = useState<string[]>(initialApps);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  };

  // Spec helpers
  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const next = [...specs];
    next[index][field] = value;
    setSpecs(next);
  };
  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Feature helpers
  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (index: number, val: string) => {
    const next = [...features];
    next[index] = val;
    setFeatures(next);
  };
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Application helpers
  const addApplication = () => setApplications([...applications, '']);
  const updateApplication = (index: number, val: string) => {
    const next = [...applications];
    next[index] = val;
    setApplications(next);
  };
  const removeApplication = (index: number) => {
    setApplications(applications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !description.trim()) {
      setError('Please provide Product Name, Category, and Description.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const filteredSpecs = specs.filter((s) => s.label.trim() && s.value.trim());
    const filteredFeatures = features.filter((f) => f.trim());
    const filteredApps = applications.filter((a) => a.trim());

    const payload = {
      name,
      slug: slug || slugify(name),
      categoryId,
      brandId: brandId || null,
      shortDescription,
      description,
      image,
      specifications: filteredSpecs,
      features: filteredFeatures,
      applications: filteredApps,
      isPublished,
      isFeatured,
      displayOrder: Number(displayOrder),
    };

    try {
      const url = isEditing
        ? `/api/products/${initialProduct.id}`
        : '/api/products';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              {isEditing ? `Edit Product: ${initialProduct.name}` : 'Add New Product'}
            </h1>
            <p className="text-xs text-slate-500">
              Fill in product information, technical specifications, and principal OEM details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update Product' : 'Save & Publish'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Product saved successfully! Redirecting to products list...</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Primary Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              General Product Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. UV/IR Integrated Flame Scanner"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand / Principal OEM
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none cursor-pointer"
                >
                  <option value="">-- No Specific Brand / Direct Sherman --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Description (Summary)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Single sentence summary for catalog listings"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Technical Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive description of engineering capabilities, design, and performance..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none font-sans"
              />
            </div>
          </div>

          {/* Specifications Builder */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Technical Specifications</h3>
                <p className="text-[11px] text-slate-500">
                  Key-value pairs displayed in technical datasheet table
                </p>
              </div>
              <button
                type="button"
                onClick={addSpec}
                className="inline-flex items-center gap-1 text-xs font-bold text-sherman-700 hover:text-sherman-900 px-2.5 py-1.5 rounded-lg bg-sherman-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => updateSpec(index, 'label', e.target.value)}
                    placeholder="e.g. Operating Pressure"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-sherman-600"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    placeholder="e.g. Up to 250 bar"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-sherman-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Features Builder */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Key Features</h3>
                <p className="text-[11px] text-slate-500">
                  Bullet points highlighting engineering advantages
                </p>
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-1 text-xs font-bold text-sherman-700 hover:text-sherman-900 px-2.5 py-1.5 rounded-lg bg-sherman-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {features.map((feat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="e.g. Dual UV and IR frequency flame discrimination"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-sherman-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Applications Builder */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Industrial Applications</h3>
                <p className="text-[11px] text-slate-500">Target sectors & process tags</p>
              </div>
              <button
                type="button"
                onClick={addApplication}
                className="inline-flex items-center gap-1 text-xs font-bold text-sherman-700 hover:text-sherman-900 px-2.5 py-1.5 rounded-lg bg-sherman-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {applications.map((app, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={app}
                    onChange={(e) => updateApplication(index, e.target.value)}
                    placeholder="e.g. Utility Boilers & Refineries"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-sherman-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeApplication(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings & Publishing (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Controls */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Publishing Settings
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800">Publish Status</label>
                <div className="text-[11px] text-slate-500">Visible on public catalog</div>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-sherman-600 focus:ring-sherman-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-800">Featured Showcase</label>
                <div className="text-[11px] text-slate-500">Highlight on category panels</div>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-sherman-600 focus:ring-sherman-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-sherman-600"
              />
              <span className="text-[10px] text-slate-400">Lower numbers appear first</span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Custom URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-name"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg outline-none focus:border-sherman-600"
              />
            </div>
          </div>

          {/* Image Upload & Management */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Product Visual Asset
            </h3>

            <ImageUpload
              value={image}
              onChange={(url) => setImage(url)}
              folder="products"
              label="Primary Product Image"
              helperText="Upload local image (JPG, PNG, WEBP, SVG) or enter URL"
              fallback={DEFAULT_PRODUCT_PLACEHOLDER}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
