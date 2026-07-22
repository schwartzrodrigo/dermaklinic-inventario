'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import InsumoSearchAutocomplete from './InsumoSearchAutocomplete';

interface ProductosViewProps {
  onOpenNuevoModal: boolean;
  onCloseNuevoModal: () => void;
}

export default function ProductosView({
  onOpenNuevoModal,
  onCloseNuevoModal,
}: ProductosViewProps) {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSel, setCategoriaSel] = useState('TODAS');
  const [grupoSel, setGrupoSel] = useState('TODOS');
  const [query, setQuery] = useState('');

  const [showModal, setShowModal] = useState(false);

  // Form State para nuevo producto
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    marca: '',
    categoria: 'INSUMO_MEDICO',
    grupo: 'ESTERIL',
    unidad: 'CAJA',
    stockMinimo: 5,
    precioActual: 0,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchProductos();
  }, [categoriaSel, grupoSel, query]);

  useEffect(() => {
    if (onOpenNuevoModal) setShowModal(true);
  }, [onOpenNuevoModal]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/productos', window.location.origin);
      if (categoriaSel !== 'TODAS') url.searchParams.append('categoria', categoriaSel);
      if (grupoSel !== 'TODOS') url.searchParams.append('grupo', grupoSel);
      if (query) url.searchParams.append('q', query);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setProductos(data.productos);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNuevo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setFormError(data.error || 'Error al guardar el producto');
      } else {
        setShowModal(false);
        onCloseNuevoModal();
        setFormData({
          sku: '',
          nombre: '',
          marca: '',
          categoria: 'INSUMO_MEDICO',
          grupo: 'ESTERIL',
          unidad: 'CAJA',
          stockMinimo: 5,
          precioActual: 0,
        });
        fetchProductos();
      }
    } catch (err) {
      setFormError('Error de red al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const getCategoriaLabel = (cat: string) => {
    switch (cat) {
      case 'INSUMO_MEDICO':
        return 'Uso Médico';
      case 'INSUMO_ESTETICO':
        return 'Estético';
      case 'INSUMO_ESCRITORIO':
        return 'Escritorio';
      case 'INSUMO_ASEO':
        return 'Aseo';
      default:
        return cat;
    }
  };

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-400" />
            Catálogo General de Insumos
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Insumos médicos, estéticos, de escritorio y aseo clasificados por condición de esterilidad.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros de Categoría */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Búsqueda por texto con Autocompletado Typeahead */}
          <div className="flex-1 w-full">
            <InsumoSearchAutocomplete
              placeholder="Escribe para buscar (ej. Botox, Nitrilo, BD, Juvederm)..."
              onSearchQueryChange={(q) => setQuery(q)}
              onSelectProduct={(product) => {
                if (product) {
                  setQuery(product.nombre);
                }
              }}
            />
          </div>

          {/* Filtro por Esterilidad */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 border border-slate-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setGrupoSel('TODOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                grupoSel === 'TODOS' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setGrupoSel('ESTERIL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                grupoSel === 'ESTERIL' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Estéril
            </button>
            <button
              onClick={() => setGrupoSel('NO_ESTERIL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                grupoSel === 'NO_ESTERIL' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              No Estéril
            </button>
          </div>
        </div>

        {/* Categorías Principales Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Categorías:
          </span>
          {[
            { id: 'TODAS', label: 'Todas' },
            { id: 'INSUMO_MEDICO', label: 'Uso Médico' },
            { id: 'INSUMO_ESTETICO', label: 'Estéticos' },
            { id: 'INSUMO_ESCRITORIO', label: 'Escritorio' },
            { id: 'INSUMO_ASEO', label: 'Aseo' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSel(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                categoriaSel === cat.id
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Cargando productos del catálogo...</div>
        ) : productos.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No se encontraron insumos con los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Producto & Marca</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Grupo</th>
                  <th className="p-3.5 text-right">Stock Actual</th>
                  <th className="p-3.5 text-right">Stock Mínimo</th>
                  <th className="p-3.5 text-right">Costo Unitario</th>
                  <th className="p-3.5 text-center">Estado Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {productos.map((prod) => {
                  const bajoMinimo = prod.stockActual <= prod.stockMinimo;
                  const esEsteril = prod.grupo === 'ESTERIL';

                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400 font-bold">{prod.sku}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{prod.nombre}</div>
                        <div className="text-slate-400 text-xs">{prod.marca || 'Sin marca'}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium">
                          {getCategoriaLabel(prod.categoria)}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-3xs font-extrabold border ${
                            esEsteril
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {esEsteril ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : null}
                          {esEsteril ? 'ESTÉRIL' : 'NO ESTÉRIL'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-white text-sm">
                        {prod.stockActual} <span className="text-slate-400 font-normal text-xs">{prod.unidad}s</span>
                      </td>
                      <td className="p-3.5 text-right text-slate-400">{prod.stockMinimo} {prod.unidad}s</td>
                      <td className="p-3.5 text-right font-bold text-teal-300">
                        {formatCLP(prod.precioActual)}
                      </td>
                      <td className="p-3.5 text-center">
                        {bajoMinimo ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold text-3xs">
                            <AlertCircle className="w-3 h-3" /> REORDEN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold text-3xs">
                            <CheckCircle className="w-3 h-3" /> NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Crear Producto */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-400" /> Nuevo Producto
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  onCloseNuevoModal();
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-200 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitNuevo} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SKU / Código Interno</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. MED-005"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Marca / Fabricante</label>
                  <input
                    type="text"
                    placeholder="Ej. Allergan, BD, 3M"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nombre del Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Agujas Hipodérmicas 30G x 4mm"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Categoría Principal</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="INSUMO_MEDICO">Insumo de Uso Médico</option>
                    <option value="INSUMO_ESTETICO">Insumo Estético</option>
                    <option value="INSUMO_ESCRITORIO">Insumo de Escritorio</option>
                    <option value="INSUMO_ASEO">Insumo de Aseo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Condición de Esterilidad</label>
                  <select
                    value={formData.grupo}
                    onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="ESTERIL">Estéril</option>
                    <option value="NO_ESTERIL">No Estéril</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unidad</label>
                  <select
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="CAJA">Caja</option>
                    <option value="UNIDAD">Unidad</option>
                    <option value="AMPOLLA">Ampolla</option>
                    <option value="BOTELLA">Botella</option>
                    <option value="PAQUETE">Paquete</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Costo Estimado ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.precioActual}
                    onChange={(e) => setFormData({ ...formData, precioActual: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    onCloseNuevoModal();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium flex items-center gap-1"
                >
                  {saving ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
