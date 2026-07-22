'use client';

import React, { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, ShieldCheck, Clock, CheckCircle2, Search } from 'lucide-react';

export default function BodegaView() {
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bodega/lotes');
      const data = await res.json();
      if (data.success) {
        setLotes(data.lotes);
      }
    } catch (err) {
      console.error('Error al cargar lotes:', err);
    } finally {
      setLoading(false);
    }
  };

  const lotesFiltrados = lotes.filter((lote) => {
    if (lote.cantidadDisponible <= 0) return false;

    if (filtroEstado !== 'TODOS') {
      if (filtroEstado === 'CRITICO' && lote.estadoVencimiento !== 'CRITICO_30_DIAS' && lote.estadoVencimiento !== 'VENCIDO')
        return false;
      if (filtroEstado === 'VENCIDO' && lote.estadoVencimiento !== 'VENCIDO') return false;
      if (filtroEstado === 'VIGENTE' && lote.estadoVencimiento !== 'VIGENTE') return false;
    }

    if (query) {
      const q = query.toLowerCase();
      const matchNombre = lote.producto.nombre.toLowerCase().includes(q);
      const matchLote = lote.numeroLote.toLowerCase().includes(q);
      const matchSKU = lote.producto.sku.toLowerCase().includes(q);
      return matchNombre || matchLote || matchSKU;
    }

    return true;
  });

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  const formatFecha = (dStr: string) => {
    if (!dStr) return 'Sin vencimiento';
    return new Date(dStr).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-teal-400" />
            Control de Bodega & Lotes Activos (Semáforo FIFO)
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Visualización de lotes desglosados con fecha de vencimiento, días restantes y orden de despacho preferente.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por lote, producto o SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 border border-slate-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFiltroEstado('TODOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filtroEstado === 'TODOS' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
            }`}
          >
            Todos los Lotes
          </button>
          <button
            onClick={() => setFiltroEstado('CRITICO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filtroEstado === 'CRITICO' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
            }`}
          >
            &lt; 30 Días / Crítico
          </button>
          <button
            onClick={() => setFiltroEstado('VENCIDO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filtroEstado === 'VENCIDO' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'
            }`}
          >
            Vencidos
          </button>
        </div>
      </div>

      {/* Tabla de Lotes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Cargando lotes en bodega...</div>
        ) : lotesFiltrados.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No hay lotes que coincidan con los criterios.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Producto</th>
                  <th className="p-3.5">N° Lote</th>
                  <th className="p-3.5">Condición</th>
                  <th className="p-3.5 text-right">Disponible</th>
                  <th className="p-3.5 text-right">Costo Unitario</th>
                  <th className="p-3.5">Fecha Vencimiento</th>
                  <th className="p-3.5 text-center">Estado Semáforo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {lotesFiltrados.map((lote) => {
                  const est = lote.estadoVencimiento;
                  const esVencido = est === 'VENCIDO';
                  const esCritico = est === 'CRITICO_30_DIAS';
                  const esAdvertencia = est === 'ADVERTENCIA_60_DIAS';

                  return (
                    <tr key={lote.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{lote.producto.nombre}</div>
                        <div className="text-slate-400 text-xs">SKU: {lote.producto.sku}</div>
                      </td>
                      <td className="p-3.5 font-mono text-teal-300 font-bold">{lote.numeroLote}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-3xs font-extrabold ${
                            lote.producto.grupo === 'ESTERIL'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {lote.producto.grupo}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-white text-sm">
                        {lote.cantidadDisponible}{' '}
                        <span className="text-slate-400 font-normal text-xs">{lote.producto.unidad}s</span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-300">
                        {formatCLP(lote.costoUnitario)}
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">
                        {formatFecha(lote.fechaVencimiento)}
                      </td>
                      <td className="p-3.5 text-center">
                        {esVencido ? (
                          <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-full font-extrabold text-3xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> ¡VENCIDO!
                          </span>
                        ) : esCritico ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-extrabold text-3xs">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> {lote.diasParaVencer} DÍAS (CRÍTICO)
                          </span>
                        ) : esAdvertencia ? (
                          <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2.5 py-1 rounded-full font-extrabold text-3xs">
                            <Clock className="w-3.5 h-3.5 text-yellow-400" /> {lote.diasParaVencer} DÍAS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-extrabold text-3xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> VIGENTE
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
    </div>
  );
}
