'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface ProductItem {
  id: string;
  sku: string;
  nombre: string;
  marca?: string | null;
  categoria: string;
  grupo: string;
  unidad: string;
  stockActual: number;
  precioActual: number;
}

interface InsumoSearchAutocompleteProps {
  placeholder?: string;
  onSelectProduct?: (product: ProductItem | null) => void;
  onSearchQueryChange?: (query: string) => void;
  initialValue?: string;
  className?: string;
}

export default function InsumoSearchAutocomplete({
  placeholder = 'Escribe letras para buscar insumos (ej. Botox, Nitrilo, BD)...',
  onSelectProduct,
  onSearchQueryChange,
  initialValue = '',
  className = '',
}: InsumoSearchAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [suggestions, setSuggestions] = useState<ProductItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar catálogo de productos al montar
  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/productos');
      const data = await res.json();
      if (data.success) {
        setAllProducts(data.productos);
      }
    } catch (err) {
      console.error('Error al cargar catálogo para autocompletar:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar sugerencias cada vez que cambia query
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

    // Algoritmo de coincidencia difusa / similitud por palabras
    const queryTokens = trimmed.split(/\s+/).filter(Boolean);

    const matches = allProducts
      .map((p) => {
        const textTarget = `${p.nombre} ${p.sku} ${p.marca || ''} ${p.categoria} ${p.grupo}`.toLowerCase();
        
        // Coincidencia exacta o puntuación por coincidencia de tokens
        let score = 0;
        if (p.nombre.toLowerCase().startsWith(trimmed)) score += 50;
        if (p.sku.toLowerCase().startsWith(trimmed)) score += 40;
        if (textTarget.includes(trimmed)) score += 30;

        let allTokensFound = true;
        for (const token of queryTokens) {
          if (textTarget.includes(token)) {
            score += 10;
          } else {
            allTokensFound = false;
          }
        }

        return { product: p, score, matched: allTokensFound || score > 0 };
      })
      .filter((item) => item.matched)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.product);

    setSuggestions(matches);
    setIsOpen(matches.length > 0);
    setSelectedIndex(-1);
  }, [query, allProducts]);

  // Cerrar al hacer clic fuera del contenedor
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
        selectProduct(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectProduct = (p: ProductItem) => {
    setQuery(p.nombre);
    setIsOpen(false);
    if (onSelectProduct) {
      onSelectProduct(p);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (onSelectProduct) onSelectProduct(null);
    if (inputRef.current) inputRef.current.focus();
  };

  // Resaltar coincidencias de texto
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

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="w-4 h-4 text-teal-400 absolute left-3 top-3 pointer-events-none" />
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

      {/* Popover / Dropdown de Sugerencias de Autocompletado */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between text-3xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" /> Coincidencias de Búsqueda ({suggestions.length})
            </span>
            <span>Usa ↑ ↓ Enter</span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
            {suggestions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const esEsteril = item.grupo === 'ESTERIL';

              return (
                <div
                  key={item.id}
                  onClick={() => selectProduct(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'bg-teal-500/20 text-white border-l-4 border-teal-400 pl-4'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <div className="p-1.5 bg-slate-800 rounded-lg text-teal-400 flex-shrink-0 mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-white text-xs truncate">
                        {highlightMatch(item.nombre, query)}
                      </div>
                      <div className="flex items-center space-x-2 text-3xs text-slate-400 mt-0.5">
                        <span className="font-mono text-teal-300 font-bold">
                          SKU: {highlightMatch(item.sku, query)}
                        </span>
                        {item.marca && <span>• Marca: {highlightMatch(item.marca, query)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center justify-end space-x-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-3xs font-extrabold ${
                          esEsteril ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {esEsteril ? 'ESTÉRIL' : 'NO ESTÉRIL'}
                      </span>
                    </div>
                    <div className="text-3xs text-slate-400 mt-1">
                      Stock: <strong className="text-white font-extrabold">{item.stockActual} {item.unidad}s</strong> • {formatCLP(item.precioActual)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
