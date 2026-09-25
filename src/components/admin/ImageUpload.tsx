'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { validateImageFile, getImageUrl } from '@/lib/image';

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
  folder?: 'products' | 'brands' | 'categories' | 'services' | 'industries' | 'clients' | 'general';
  label?: string;
  helperText?: string;
  required?: boolean;
  aspectRatio?: 'video' | 'square' | 'banner' | 'contain' | 'auto';
  fallback?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = 'Image Asset',
  helperText = 'Supported formats: JPG, PNG, WEBP, SVG (Max 10MB)',
  required = false,
  aspectRatio = 'video',
  fallback,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [directUrl, setDirectUrl] = useState(value || '');

  const resolvedValue = value ? value.trim() : '';

  const handleUpload = async (file: File) => {
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid image file.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
      setDirectUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Error occurred while uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
    setDirectUrl('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyDirectUrl = () => {
    if (directUrl.trim()) {
      onChange(directUrl.trim());
      setError(null);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowDirectInput(!showDirectInput)}
          className="text-[11px] font-semibold text-sherman-700 hover:text-sherman-900 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showDirectInput ? 'Hide URL Input' : 'Enter URL / Path'}</span>
        </button>
      </div>

      {/* Direct URL input if toggled */}
      {showDirectInput && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Direct Path or External URL
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="/uploads/products/example.webp or https://..."
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sherman-600 bg-white"
            />
            <button
              type="button"
              onClick={handleApplyDirectUrl}
              className="px-3 py-1.5 bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview when Image exists */}
      {resolvedValue ? (
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
          <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-2 min-h-[140px] max-h-[260px]">
            <img
              src={getImageUrl(resolvedValue, fallback)}
              alt="Uploaded asset preview"
              className="max-h-[220px] max-w-full object-contain rounded-lg shadow-2xs"
            />

            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                <span className="text-xs font-semibold">Uploading new image...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <div className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
              {resolvedValue}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area when NO Image exists */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? 'border-sherman-600 bg-sherman-50/50'
              : 'border-slate-300 hover:border-sherman-500 hover:bg-slate-50/70 bg-white'
          } ${uploading ? 'opacity-60 cursor-wait' : ''}`}
        >
          {uploading ? (
            <div className="py-4 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-sherman-600 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Uploading image to server...</div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-sherman-50 text-sherman-700 flex items-center justify-center mb-1 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-800">
                  Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
