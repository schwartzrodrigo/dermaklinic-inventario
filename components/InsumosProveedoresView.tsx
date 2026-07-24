'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Building2,
  Tag,
  DollarSign,
  Package,
  Calendar,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink
} from 'lucide-react';

interface SupplierPurchaseInfo {
  id: string;
  nombre: string;
  categoria?: string | null;
  rut?: string | null;
  telefono?: string | null;
  email?: string | null;
  contacto?: string | null;
  ultimoPrecioPagado: number;
  totalComprado: number;
  ultimaFechaCompra: string;
  numeroUltimoDoc: string;
}

interface InsumoProveedorItem {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  grupo: string;
  unidad: string;
  stockActual: number;
  precioActual: number;
  proveedoresComprados: SupplierPurchaseInfo[];
  proveedoresSugeridos: {
    id: string;
    nombre: string;
    categoria?: string | null;
    rut?: string | null;
    telefono?: string | null;
    email?: string | null;
  }[];
}

interface InsumosProveedoresViewProps {
  onNavigateToRecepcion?: (productoNombre?: string, proveedorNombre?: string) => void;
}

export default function InsumosProveedoresView({ onNavigateToRecepcion }: InsumosProveedoresViewProps) {
  const [data, setData] = useState<InsumoProveedorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODOS');

  useEffect(() => {
    fetchInsumosProveedores();
  }, [searchQuery]);

  const fetchInsumosProveedores = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/insumos-proveedores', window.location.origin);
      if (searchQuery) url.searchParams.append('q', searchQuery);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.success) {
        setData(json.insumosProveedores);
      }
    } catch (err) {
      console.error('Error al cargar historial insumo-proveedor:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    if (selectedCategoria === 'TODOS') return true;
    return item.categoria === selectedCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Módulo de Trazabilidad & Proveedores</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-teal-400" />
            Historial de Insumos por Proveedor
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 max-w-2xl">
            Consulta rápidamente a qué **Empresas y Proveedores** se ha comprado cada insumo de DermaKlinic, junto con los precios abonados y la categoría/rubro del proveedor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl text-center">
            <span className="text-3xs text-slate-400 uppercase font-semibold block">Total Insumos</span>
            <span className="text-lg font-bold text-teal-400">{data.length}</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Category Pills */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por insumo (ej. Botox, Sutura, Suero), o por proveedor (ej. Abbvie, Galderma, Medtronic)..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'INSUMO_MEDICO', label: 'Médicos' },
            { id: 'INSUMO_ESTETICO', label: 'Estéticos' },
            { id: 'INSUMO_ASEO', label: 'Aseo' },
            { id: 'INSUMO_ESCRITORIO', label: 'Escritorio' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoria(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoria === cat.id
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mb-3"></div>
          <p className="text-xs">Consultando catálogo e historial de compras por proveedor...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No se encontraron insumos coincidentes</h3>
          <p className="text-slate-400 text-xs">Prueba con otro término de búsqueda o cambia el filtro de categoría.</p>
        </div>
      ) : (
        /* List of Insumos with Supplier breakdown */
        <div className="space-y-4">
          {filteredData.map((item) => {
            const hasPurchases = item.proveedoresComprados.length > 0;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all space-y-4"
              >
                {/* Top row: Insumo header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-teal-400 flex-shrink-0 mt-0.5">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white">{item.nombre}</h2>
                        <span className="px-2 py-0.5 bg-slate-800 text-teal-300 font-mono text-3xs font-bold rounded-md">
                          {item.sku}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-3xs text-slate-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          Categoría: {item.categoria.replace('INSUMO_', '')}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-extrabold ${
                            item.grupo === 'ESTERIL'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.grupo}
                        </span>
                        <span>Unidad: {item.unidad}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-start sm:self-center">
                    <div className="text-right">
                      <span className="text-3xs text-slate-400 block uppercase">Stock Actual</span>
                      <span className="text-sm font-extrabold text-white">{item.stockActual} {item.unidad}s</span>
                    </div>
                    <div className="text-right pl-3 border-l border-slate-800">
                      <span className="text-3xs text-slate-400 block uppercase">Precio Referencia</span>
                      <span className="text-sm font-extrabold text-teal-400">${item.precioActual.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                {/* Main Content: Proveedores Comprados */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-3xs font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1.5 text-teal-300">
                      <Building2 className="w-3.5 h-3.5" />
                      Proveedores Registrados / Comprados ({item.proveedoresComprados.length})
                    </span>
                  </div>

                  {hasPurchases ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.proveedoresComprados.map((prov) => (
                        <div
                          key={prov.id}
                          className="bg-slate-950 border border-slate-800 hover:border-teal-500/40 p-4 rounded-xl space-y-2.5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white text-xs flex items-center gap-2">
                                <span>{prov.nombre}</span>
                              </div>
                              {prov.categoria && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-3xs font-extrabold rounded-full uppercase">
                                  {prov.categoria}
                                </span>
                              )}
                            </div>

                            {onNavigateToRecepcion && (
                              <button
                                onClick={() => onNavigateToRecepcion(item.nombre, prov.nombre)}
                                className="flex items-center space-x-1 text-3xs bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white px-2.5 py-1 rounded-lg border border-teal-500/30 transition-all font-semibold"
                                title="Ingresar nueva compra con esta empresa"
                              >
                                <span>Nueva Compra</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-3xs pt-1 border-t border-slate-800/80 text-slate-400">
                            <div>
                              <span className="block text-slate-500">Último Costo Unitario</span>
                              <span className="font-mono text-teal-300 font-bold text-xs">
                                ${prov.ultimoPrecioPagado.toLocaleString('es-CL')}
                              </span>
                            </div>
                            <div>
                              <span className="block text-slate-500">Última Recepción</span>
                              <span className="text-slate-200">
                                {new Date(prov.ultimaFechaCompra).toLocaleDateString('es-CL')} ({prov.numeroUltimoDoc})
                              </span>
                            </div>
                          </div>

                          {(prov.telefono || prov.email) && (
                            <div className="flex flex-wrap items-center gap-3 text-3xs text-slate-400 pt-1">
                              {prov.telefono && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-500" /> {prov.telefono}
                                </span>
                              )}
                              {prov.email && (
                                <span className="flex items-center gap-1 truncate">
                                  <Mail className="w-3 h-3 text-slate-500" /> {prov.email}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Sugerencias de Proveedores según Rubro si no hay compra registrada aun */
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-3xs text-slate-400">
                        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Sin historial directo de facturas recepcionadas para este producto
                        </span>
                        <span>Proveedores recomendados por rubro:</span>
                      </div>

                      {item.proveedoresSugeridos.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {item.proveedoresSugeridos.map((sug) => (
                            <div
                              key={sug.id}
                              className="bg-slate-900 border border-slate-700/60 px-3 py-1.5 rounded-lg flex items-center space-x-2 text-xs"
                            >
                              <Building2 className="w-3.5 h-3.5 text-teal-400" />
                              <span className="font-semibold text-white">{sug.nombre}</span>
                              {sug.categoria && (
                                <span className="text-3xs bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                                  {sug.categoria}
                                </span>
                              )}

                              {onNavigateToRecepcion && (
                                <button
                                  onClick={() => onNavigateToRecepcion(item.nombre, sug.nombre)}
                                  className="ml-1 text-3xs text-teal-400 hover:underline font-bold"
                                >
                                  + Recepcionar
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-3xs text-slate-500 italic">
                          Puedes asociar este producto a cualquier proveedor escaneando o ingresando la factura en la pestaña "Recepciones".
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
