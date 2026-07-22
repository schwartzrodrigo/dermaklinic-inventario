'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Building2, Package, ArrowUpRight } from 'lucide-react';

export default function PreciosView() {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [lotesHistorial, setLotesHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrecios();
  }, []);

  const fetchPrecios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/precios');
      const data = await res.json();
      if (data.success) {
        setAlertas(data.alertas);
        setLotesHistorial(data.lotesHistorial);
      }
    } catch (err) {
      console.error('Error al cargar historial de precios:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-rose-400" />
          Análisis & Detección de Variación de Precios de Proveedores
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Identifica automáticamente incrementos de costos en facturas recibidas y analiza la tendencia de precios por proveedor.
        </p>
      </div>

      {/* Alertas Registradas */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          Alertas de Aumento de Costos Detectadas
        </h2>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Analizando variaciones de precios...</div>
        ) : alertas.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No se han registrado aumentos de costo por parte de los proveedores.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertas.map((alerta) => (
              <div
                key={alerta.id}
                className="bg-slate-950 border border-rose-800/60 p-4 rounded-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {alerta.proveedor.nombre}
                    </span>
                    <h3 className="font-extrabold text-white text-base mt-0.5">{alerta.producto.nombre}</h3>
                  </div>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full font-extrabold text-xs flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> +{alerta.porcentajeVariacion}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Costo Anterior:</span>
                    <span className="text-slate-300 font-bold">{formatCLP(alerta.precioAnterior)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nuevo Costo Factura:</span>
                    <span className="text-rose-400 font-extrabold text-sm">{formatCLP(alerta.precioNuevo)}</span>
                  </div>
                </div>

                <div className="text-3xs text-slate-500 text-right">
                  Detectado el:{' '}
                  {new Date(alerta.fechaDetectada).toLocaleDateString('es-CL', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Costos por Lote Recibido */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Histórico Completo de Precios de Entrada por Documento
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Fecha Ingreso</th>
                <th className="p-3.5">Insumo</th>
                <th className="p-3.5">Proveedor</th>
                <th className="p-3.5">N° Documento</th>
                <th className="p-3.5">N° Lote</th>
                <th className="p-3.5 text-right">Costo Unitario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {lotesHistorial.map((lote) => (
                <tr key={lote.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">
                    {new Date(lote.fechaIngreso).toLocaleDateString('es-CL')}
                  </td>
                  <td className="p-3.5 font-bold text-white">{lote.producto.nombre}</td>
                  <td className="p-3.5 text-slate-300">{lote.documentoCompra?.proveedor?.nombre || 'General'}</td>
                  <td className="p-3.5 font-mono text-slate-400">{lote.documentoCompra?.numeroDoc || 'S/D'}</td>
                  <td className="p-3.5 font-mono text-teal-300 font-bold">{lote.numeroLote}</td>
                  <td className="p-3.5 text-right font-extrabold text-teal-400 text-sm">
                    {formatCLP(lote.costoUnitario)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
