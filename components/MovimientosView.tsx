'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

export default function MovimientosView() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/movimientos');
      const data = await res.json();
      if (data.success) {
        setMovimientos(data.movimientos);
      }
    } catch (err) {
      console.error('Error al cargar movimientos:', err);
    } finally {
      setLoading(false);
    }
  };

  const movimientosFiltrados = movimientos.filter((m) => {
    if (tipoFiltro !== 'TODOS' && m.tipoMovimiento !== tipoFiltro) return false;
    if (query) {
      const q = query.toLowerCase();
      const matchProd = m.producto.nombre.toLowerCase().includes(q);
      const matchUser = (m.usuario || '').toLowerCase().includes(q);
      const matchNotas = (m.notas || '').toLowerCase().includes(q);
      return matchProd || matchUser || matchNotas;
    }
    return true;
  });

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-teal-400" />
          Bitácora Completa de Movimientos de Inventario
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Registro inalterable con fecha y hora exacta de cada ingreso, salida y ajuste realizado en bodega.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por insumo, usuario o notas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 border border-slate-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setTipoFiltro('TODOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              tipoFiltro === 'TODOS' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setTipoFiltro('INGRESO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              tipoFiltro === 'INGRESO' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setTipoFiltro('EGRESO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              tipoFiltro === 'EGRESO' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'
            }`}
          >
            Egresos
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Cargando bitácora de movimientos...</div>
        ) : movimientosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No se encontraron movimientos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Fecha y Hora Exacta</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Producto & Lote</th>
                  <th className="p-3.5 text-right">Cantidad</th>
                  <th className="p-3.5 text-right">Costo Unitario</th>
                  <th className="p-3.5">Motivo / Notas</th>
                  <th className="p-3.5">Usuario Solicitante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {movimientosFiltrados.map((m) => {
                  const esIngreso = m.tipoMovimiento === 'INGRESO';
                  const esAjuste = m.tipoMovimiento === 'AJUSTE_AUDITORIA';

                  return (
                    <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 font-mono text-slate-300 whitespace-nowrap">
                        {new Date(m.fechaHora).toLocaleString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-extrabold text-3xs ${
                            esIngreso
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : esAjuste
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {m.tipoMovimiento}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{m.producto.nombre}</div>
                        {m.lote && <div className="text-teal-400 font-mono text-xs">Lote: {m.lote.numeroLote}</div>}
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-sm">
                        <span className={esIngreso ? 'text-emerald-400' : 'text-rose-400'}>
                          {esIngreso ? `+${m.cantidad}` : `-${m.cantidad}`}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-300">
                        {m.costoUnitario ? formatCLP(m.costoUnitario) : '-'}
                      </td>
                      <td className="p-3.5 text-slate-400 max-w-xs truncate">{m.notas || m.motivo}</td>
                      <td className="p-3.5 text-slate-300">{m.usuario}</td>
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
