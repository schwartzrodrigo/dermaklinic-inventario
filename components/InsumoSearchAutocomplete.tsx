'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, ShieldCheck, ShieldAlert, Sparkles, Plus } from 'lucide-react';

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

  // Estado para modal de creación rápida
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createFormData, setCreateFormData] = useState({
    sku: '',
    nombre: '',
    marca: '',
    categoria: 'INSUMO_MEDICO',
    grupo: 'ESTERIL',
    unidad: 'CAJA',
    stockMinimo: 5,
    precioActual: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar catálogo de productos al montar
  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async (): Promise<ProductItem[]> => {
    setLoading(true);
    try {
      const res = await fetch('/api/productos');
      const data = await res.json();
      if (data.success) {
        setAllProducts(data.productos);
        return data.productos;
      }
    } catch (err) {
      console.error('Error al cargar catálogo para autocompletar:', err);
    } finally {
      setLoading(false);
    }
    return [];
  };

  // Generar sugerencia de SKU correlativo
  const generateSuggestedSku = (productsList: ProductItem[]) => {
    let maxNum = 0;
    for (const p of productsList) {
      if (p.sku && p.sku.startsWith('DK-INS-')) {
        const numPart = parseInt(p.sku.replace('DK-INS-', ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }
    const nextNum = maxNum > 0 ? maxNum + 1 : productsList.length + 1;
    return `DK-INS-${String(nextNum).padStart(3, '0')}`;
  };

  // Abrir modal de creación rápida
  const handleOpenCreateModal = (initialName?: string) => {
    const suggestedSku = generateSuggestedSku(allProducts);
    setCreateFormData({
      sku: suggestedSku,
      nombre: initialName || query.trim() || '',
      marca: '',
      categoria: 'INSUMO_MEDICO',
      grupo: 'ESTERIL',
      unidad: 'CAJA',
      stockMinimo: 5,
      precioActual: 0,
    });
    setCreateError('');
    setShowCreateModal(true);
    setIsOpen(false);
  };

  // Guardar nuevo producto
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createFormData),
      });

      const data = await res.json();
      if (!data.success) {
        setCreateError(data.error || 'Error al crear el insumo');
      } else {
        const nuevoProd = data.producto;
        setShowCreateModal(false);

        // Recargar catálogo y seleccionar producto recién creado
        const updatedList = await fetchCatalog();
        const found = updatedList.find((p) => p.id === nuevoProd.id) || nuevoProd;
        selectProduct(found);
      }
    } catch (err) {
      setCreateError('Error de conexión al guardar producto');
    } finally {
      setCreating(false);
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
    setIsOpen(true);
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
    if (!isOpen) return;

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
      } else if (query.trim()) {
        handleOpenCreateModal(query);
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
            if (query.trim()) setIsOpen(true);
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
      {isOpen && query.trim() !== '' && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="px-3 py-2 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between text-3xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              {suggestions.length > 0
                ? `Coincidencias de Búsqueda (${suggestions.length})`
                : 'Sin coincidencias en catálogo'}
            </span>
            {suggestions.length > 0 && <span>Usa ↑ ↓ Enter</span>}
          </div>

          {suggestions.length > 0 ? (
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
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
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              No se encontraron insumos registrados con el término <span className="text-white font-semibold">"{query}"</span>.
            </div>
          )}

          {/* Opción Permanente para Crear Nuevo Producto */}
          <div
            onClick={() => handleOpenCreateModal(query)}
            className="p-3 bg-teal-950/40 hover:bg-teal-900/60 border-t border-slate-800 text-teal-300 font-semibold cursor-pointer flex items-center justify-between text-xs transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-teal-500/20 rounded-lg text-teal-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-bold text-white block truncate">¿No encuentras el insumo?</span>
                <span className="text-3xs text-teal-400/80 block truncate">
                  Crear <strong className="underline">"{query}"</strong> como nuevo producto
                </span>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-3xs rounded-xl transition-all shadow flex-shrink-0 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Registrar Insumo
            </span>
          </div>
        </div>
      )}

      {/* Modal para Crear Producto Rápido desde el Buscador */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
                  <Plus className="w-4 h-4" />
                </div>
                Registrar Nuevo Insumo / Producto
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-200 text-xs rounded-xl">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SKU / Código *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.sku}
                    onChange={(e) => setCreateFormData({ ...createFormData, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Marca / Fabricante</label>
                  <input
                    type="text"
                    placeholder="Ej. Allergan, BD"
                    value={createFormData.marca}
                    onChange={(e) => setCreateFormData({ ...createFormData, marca: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nombre del Insumo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Agujas Hipodérmicas 30G"
                  value={createFormData.nombre}
                  onChange={(e) => setCreateFormData({ ...createFormData, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Categoría *</label>
                  <select
                    value={createFormData.categoria}
                    onChange={(e) => setCreateFormData({ ...createFormData, categoria: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="INSUMO_MEDICO">Uso Médico</option>
                    <option value="INSUMO_ESTETICO">Estético</option>
                    <option value="INSUMO_ESCRITORIO">Escritorio</option>
                    <option value="INSUMO_ASEO">Aseo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Esterilidad *</label>
                  <select
                    value={createFormData.grupo}
                    onChange={(e) => setCreateFormData({ ...createFormData, grupo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="ESTERIL">Estéril</option>
                    <option value="NO_ESTERIL">No Estéril</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unidad *</label>
                  <select
                    value={createFormData.unidad}
                    onChange={(e) => setCreateFormData({ ...createFormData, unidad: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:border-teal-500 focus:outline-none text-xs"
                  >
                    <option value="UNIDAD">Unidad</option>
                    <option value="CAJA">Caja</option>
                    <option value="FRASCO">Frasco</option>
                    <option value="PAQUETE">Paquete</option>
                    <option value="TUBO">Tubo</option>
                    <option value="BOTELLA">Botella</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stock Mín.</label>
                  <input
                    type="number"
                    min="0"
                    value={createFormData.stockMinimo}
                    onChange={(e) => setCreateFormData({ ...createFormData, stockMinimo: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Precio CLP ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={createFormData.precioActual}
                    onChange={(e) => setCreateFormData({ ...createFormData, precioActual: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{creating ? 'Guardando...' : 'Guardar e Insertar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

