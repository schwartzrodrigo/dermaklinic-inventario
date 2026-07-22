'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Building2, Phone, Mail, User, Sparkles } from 'lucide-react';

interface ProveedorItem {
  id: string;
  rut?: string | null;
  nombre: string;
  contacto?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
}

interface ProveedorSearchAutocompleteProps {
  placeholder?: string;
  onSelectProveedor?: (proveedor: ProveedorItem | null) => void;
  onSearchQueryChange?: (query: string) => void;
  initialValue?: string;
  className?: string;
}

export default function ProveedorSearchAutocomplete({
  placeholder = 'Escribe para buscar proveedor (ej. Dermaceuticals, San Andrés, 76.849)...',
  onSelectProveedor,
  onSearchQueryChange,
  initialValue = '',
  className = '',
}: ProveedorSearchAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [allProveedores, setAllProveedores] = useState<ProveedorItem[]>([]);
  const [suggestions, setSuggestions] = useState<ProveedorItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const res = await fetch('/api/proveedores');
      const data = await res.json();
      if (data.success) {
        setAllProveedores(data.proveedores);
      }
    } catch (err) {
      console.error('Error al cargar proveedores para autocompletar:', err);
    }
  };

  useEffect(() => {
    if (onSearchQueryChange) {
      onSearchQueryChange(query);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const queryTokens = trimmed.split(/\s+/).filter(Boolean);

    const matches = allProveedores
      .map((p) => {
        const textTarget = `${p.nombre} ${p.rut || ''} ${p.contacto || ''} ${p.email || ''}`.toLowerCase();
        let score = 0;

        if (p.nombre.toLowerCase().startsWith(trimmed)) score += 50;
        if (p.rut && p.rut.toLowerCase().includes(trimmed)) score += 40;
        if (textTarget.includes(trimmed)) score += 30;

        let allTokensFound = true;
        for (const token of queryTokens) {
          if (textTarget.includes(token)) {
            score += 10;
          } else {
            allTokensFound = false;
          }
        }

        return { proveedor: p, score, matched: allTokensFound || score > 0 };
      })
      .filter((item) => item.matched)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.proveedor);

    setSuggestions(matches);
    setIsOpen(matches.length > 0);
    setSelectedIndex(-1);
  }, [query, allProveedores]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectProveedor(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectProveedor = (p: ProveedorItem) => {
    setQuery(p.nombre);
    setIsOpen(false);
    if (onSelectProveedor) {
      onSelectProveedor(p);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (onSelectProveedor) onSelectProveedor(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-teal-500/30 text-teal-200 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Building2 className="w-4 h-4 text-teal-400 absolute left-3 top-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => {
            if (query.trim() && suggestions.length > 0) setIsOpen(true);
          }}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between text-3xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" /> Proveedores Encontrados ({suggestions.length})
            </span>
            <span>Usa ↑ ↓ Enter</span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
            {suggestions.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => selectProveedor(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'bg-teal-500/20 text-white border-l-4 border-teal-400 pl-4'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <div className="p-1.5 bg-slate-800 rounded-lg text-teal-400 flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-white text-xs truncate">
                        {highlightMatch(item.nombre, query)}
                      </div>
                      <div className="flex items-center space-x-2 text-3xs text-slate-400 mt-0.5">
                        {item.rut && (
                          <span className="font-mono text-teal-300 font-bold">
                            RUT: {highlightMatch(item.rut, query)}
                          </span>
                        )}
                        {item.contacto && <span>• Contacto: {highlightMatch(item.contacto, query)}</span>}
                      </div>
                    </div>
                  </div>

                  {item.telefono && (
                    <div className="text-3xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                      <Phone className="w-3 h-3 text-slate-500" /> {item.telefono}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
