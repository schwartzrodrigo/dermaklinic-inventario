'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, AlertCircle, CheckCircle2, DollarSign, ArrowRightLeft, FileCheck } from 'lucide-react';

export default function AuditoriaView() {
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [productosActuales, setProductosActuales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State para nueva auditoría
  const [mesAno, setMesAno] = useState('2026-07');
  const [observaciones, setObservaciones] = useState('');

  // Mapeo de conteo físico por producto: { productoId: { stockFisico: number, justificacion: string } }
  const [conteos, setConteos] = useState<Record<string, { stockFisico: number; justificacion: string }>>({});

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    fetchAuditorias();
  }, []);

  const fetchAuditorias = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auditoria');
      const data = await res.json();
      if (data.success) {
        setAuditorias(data.auditorias);
        setProductosActuales(data.productosActuales);

        // Inicializar conteos por defecto al stock del sistema
        const initConteos: Record<string, { stockFisico: number; justificacion: string }> = {};
        data.productosActuales.forEach((p: any) => {
          initConteos[p.id] = {
            stockFisico: p.stockActual,
            justificacion: '',
          };
        });
        setConteos(initConteos);
      }
    } catch (err) {
      console.error('Error al cargar auditorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockFisicoChange = (prodId: string, val: number) => {
    setConteos({
      ...conteos,
      [prodId]: {
        ...conteos[prodId],
        stockFisico: val,
      },
    });
  };

  const handleJustificacionChange = (prodId: string, val: string) => {
    setConteos({
      ...conteos,
      [prodId]: {
        ...conteos[prodId],
        justificacion: val,
      },
    });
  };

  const calcularEstadisticasToma = () => {
    let totalDiferenciasUnidades = 0;
    let totalImpactoMonetario = 0;
    let productosConDescalce = 0;

    productosActuales.forEach((p) => {
      const c = conteos[p.id];
      if (c) {
        const diff = c.stockFisico - p.stockActual;
        if (diff !== 0) {
          productosConDescalce++;
          totalDiferenciasUnidades += Math.abs(diff);
          totalImpactoMonetario += diff * p.precioActual;
        }
      }
    });

    return { totalDiferenciasUnidades, totalImpactoMonetario, productosConDescalce };
  };

  const handleGuardarAuditoria = async (aplicarAjustes: boolean) => {
    setStatusMsg(null);
    setSaving(true);
    try {
      const conteosArray = Object.keys(conteos).map((prodId) => ({
        productoId: prodId,
        stockFisico: conteos[prodId].stockFisico,
        justificacion: conteos[prodId].justificacion,
      }));

      const res = await fetch('/api/auditoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mesAno,
          observaciones,
          conteos: conteosArray,
          aplicarAjustes,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setStatusMsg({ tipo: 'error', texto: data.error || 'Error al guardar la auditoría' });
      } else {
        setStatusMsg({
          tipo: 'success',
          texto: aplicarAjustes
            ? 'Auditoría finalizada y ajustes de stock aplicados exitosamente.'
            : 'Borrador de auditoría guardado exitosamente.',
        });
        fetchAuditorias();
      }
    } catch (err) {
      setStatusMsg({ tipo: 'error', texto: 'Error de red al procesar auditoría' });
    } finally {
      setSaving(false);
    }
  };

  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  const { totalDiferenciasUnidades, totalImpactoMonetario, productosConDescalce } = calcularEstadisticasToma();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-teal-400" />
          Control & Auditoría Mensual de Inventario (Real vs. Sistema)
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Cruce mensual para identificar discordancias entre el conteo físico en bodega y el stock en el sistema.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
            statusMsg.tipo === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/60 border-rose-800 text-rose-200'
          }`}
        >
          {statusMsg.tipo === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{statusMsg.texto}</span>
        </div>
      )}

      {/* Formulario de Toma de Inventario Físico */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Formulario de Conteo Físico Real</h2>
            <p className="text-slate-400">Ingresa la cantidad física contada en bodega para cada insumo.</p>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block font-semibold text-slate-400 text-3xs mb-0.5">Mes / Año Auditoría</label>
              <input
                type="month"
                value={mesAno}
                onChange={(e) => setMesAno(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Resumen de Descalces Calculados */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-3xs uppercase font-bold">Insumos con Discordancia</span>
            <span className={`text-xl font-extrabold ${productosConDescalce > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {productosConDescalce} productos
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-3xs uppercase font-bold">Diferencia Total Unidades</span>
            <span className="text-xl font-extrabold text-white">{totalDiferenciasUnidades} u</span>
          </div>

          <div>
            <span className="text-slate-400 block text-3xs uppercase font-bold">Impacto Financiero del Descalce</span>
            <span
              className={`text-xl font-extrabold ${
                totalImpactoMonetario < 0
                  ? 'text-rose-400'
                  : totalImpactoMonetario > 0
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              }`}
            >
              {formatCLP(totalImpactoMonetario)}
            </span>
          </div>
        </div>

        {/* Tabla de Conteo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">SKU & Insumo</th>
                <th className="p-3 text-right">Stock Sistema</th>
                <th className="p-3 text-center">Conteo Físico Real</th>
                <th className="p-3 text-right">Diferencia</th>
                <th className="p-3 text-right">Impacto $</th>
                <th className="p-3">Justificación del Descalce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {productosActuales.map((prod) => {
                const c = conteos[prod.id] || { stockFisico: prod.stockActual, justificacion: '' };
                const diff = c.stockFisico - prod.stockActual;
                const valorDiff = diff * prod.precioActual;

                return (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white text-xs">{prod.nombre}</div>
                      <div className="text-slate-400 text-3xs">
                        SKU: {prod.sku} • {prod.grupo}
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-300">
                      {prod.stockActual} {prod.unidad}s
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={c.stockFisico}
                        onChange={(e) => handleStockFisicoChange(prod.id, parseInt(e.target.value) || 0)}
                        className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center font-extrabold text-white text-sm focus:border-teal-500"
                      />
                    </td>
                    <td className="p-3 text-right font-extrabold">
                      {diff === 0 ? (
                        <span className="text-slate-500">0</span>
                      ) : diff > 0 ? (
                        <span className="text-emerald-400">+{diff}</span>
                      ) : (
                        <span className="text-rose-400">{diff}</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-bold">
                      {valorDiff === 0 ? (
                        <span className="text-slate-500">$0</span>
                      ) : valorDiff > 0 ? (
                        <span className="text-emerald-400">+{formatCLP(valorDiff)}</span>
                      ) : (
                        <span className="text-rose-400">{formatCLP(valorDiff)}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder={diff !== 0 ? 'Justificación obligatoria...' : 'Sin novedades'}
                        value={c.justificacion}
                        onChange={(e) => handleJustificacionChange(prod.id, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => handleGuardarAuditoria(false)}
            disabled={saving}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs"
          >
            Guardar Borrador
          </button>
          <button
            onClick={() => handleGuardarAuditoria(true)}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            Finalizar Auditoría & Aplicar Ajustes
          </button>
        </div>
      </div>

      {/* Histórico de Auditorías Anteriores */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Histórico de Cierres de Auditoría Mensuales
        </h2>

        {auditorias.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No hay auditorías registradas previamente.</div>
        ) : (
          <div className="space-y-3">
            {auditorias.map((aud) => (
              <div key={aud.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">Auditoría Mes: {aud.mesAno}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-3xs ${
                      aud.estado === 'FINALIZADA'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {aud.estado}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{aud.observaciones || 'Sin observaciones'}</p>
                <div className="text-slate-500 text-3xs pt-1 border-t border-slate-900 flex justify-between">
                  <span>Fecha Cierre: {new Date(aud.fecha).toLocaleDateString('es-CL')}</span>
                  <span>Items Auditados: {aud.detalles?.length || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
