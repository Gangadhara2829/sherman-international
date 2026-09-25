'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight, Package, Grid, Building2, Wrench, Loader2 } from 'lucide-react';

interface SearchResult {
  type: 'product' | 'category' | 'brand' | 'service';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4 text-sherman-700" />;
      case 'category':
        return <Grid className="w-4 h-4 text-slate-700" />;
      case 'brand':
        return <Building2 className="w-4 h-4 text-slate-700" />;
      case 'service':
        return <Wrench className="w-4 h-4 text-slate-700" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-navy-deep/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories (e.g., Flame Scanner, CEMB, Flow)..."
            className="flex-1 bg-transparent text-base text-slate-900 placeholder-slate-400 outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-navy animate-spin" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-white text-slate-600 rounded font-medium border border-slate-300 hover:bg-slate-100"
          >
            ESC
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query && !loading && results.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Package className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-medium text-slate-700">No matching engineering solutions found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for keywords like "flow", "zeeco", "balancing", or "switch"
              </p>
            </div>
          )}

          {!query && (
            <div className="p-4 text-xs text-slate-500">
              <div className="font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Quick Solution Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {['Flame Scanner', 'Balancing Machine', 'Flow Meter', 'Process Switches', 'Scherzinger', 'ZEECO', 'Railway OHE'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-colors border border-slate-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item.url)}
                  className="w-full text-left p-3 rounded hover:bg-slate-100 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-white border border-slate-200 shadow-xs">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-navy text-sm">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-slate-500 line-clamp-1">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {item.type}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-navy transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Sherman International Product & Solution Directory</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}

