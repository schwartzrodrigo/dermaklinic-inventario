'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, AlertTriangle, Clock, User, FileText } from 'lucide-react';
import InsumoSearchAutocomplete from './InsumoSearchAutocomplete';

interface EgresosViewProps {
  currentUser?: any;
  onEgresoCompletado?: () => void;
}

export default function EgresosView({ currentUser, onEgresoCompletado }: EgresosViewProps) {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [productoId, setProductoId] = useState('');
  const [loteId, setLoteId] = useState('AUTO_FIFO');
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState('USO_CLINICO');
  const [usuario, setUsuario] = useState(currentUser?.nombre || 'América Díaz');
  const [notas, setNotas] = useState('');
  const [fechaHora, setFechaHora] = useState(
    new Date().toISOString().slice(0, 16)
  );

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/egresos');
      const data = await res.json();
      if (data.success && data.productos.length > 0) {
        setProductos(data.productos);
        setProductoId(data.productos[0].id);
      }
    } catch (err) {
      console.error('Error al cargar productos para egresos:', err);
    } finally {
      setLoading(false);
    }
  };

  const productoSeleccionado = productos.find((p) => p.id === productoId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!productoId || cantidad <= 0) {
      setStatusMsg({ tipo: 'error', texto: 'Selecciona un producto y cantidad válida.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/egresos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId,
          loteId,
          usuarioId: currentUser?.id,
          cantidad,
          motivo,
          usuario: usuario || currentUser?.nombre || 'América Díaz',
          notas,
          fechaHora: new Date(fechaHora).toISOString(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setStatusMsg({ tipo: 'error', texto: data.error || 'Error al registrar egreso' });
      } else {
        setStatusMsg({
          tipo: 'success',
          texto: `Salida de inventario registrada con éxito. Nuevo stock: ${data.nuevoStockProducto} unidades.`,
        });
        setNotas('');
        setCantidad(1);
        fetchProductos();
        if (onEgresoCompletado) onEgresoCompletado();
      }
    } catch (err) {
      setStatusMsg({ tipo: 'error', texto: 'Error de red al registrar egreso' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          Registro de Salida de Insumos (Egresos)
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Descuenta inventario por uso en procedimiento clínico, consumo interno o merma. Se registra marca de fecha y hora exactas.
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
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{statusMsg.texto}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Insumo a Despachar (Buscador Predictivo)</label>
            <InsumoSearchAutocomplete
              placeholder="Escribe para buscar (ej. Botox, Nitrilo, BD)..."
              onSelectProduct={(p) => {
                if (p) {
                  setProductoId(p.id);
                  setLoteId('AUTO_FIFO');
                }
              }}
            />
            {productoSeleccionado && (
              <div className="mt-1 text-3xs text-teal-300 font-semibold">
                Seleccionado: {productoSeleccionado.nombre} (Stock actual: {productoSeleccionado.stockActual} {productoSeleccionado.unidad}s)
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Despacho de Lote (FIFO Preferente)</label>
            <select
              value={loteId}
              onChange={(e) => setLoteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="AUTO_FIFO">⭐ Automático FIFO (Despachar lote con vencimiento más próximo)</option>
              {productoSeleccionado?.lotes?.map((l: any) => (
                <option key={l.id} value={l.id}>
                  Lote: {l.numeroLote} - Disp: {l.cantidadDisponible} (Vence:{' '}
                  {l.fechaVencimiento ? new Date(l.fechaVencimiento).toLocaleDateString('es-CL') : 'N/A'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Cantidad a Extraer</label>
            <input
              type="number"
              min="1"
              max={productoSeleccionado?.stockActual || 999}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-extrabold text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Motivo de Egreso</label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="USO_CLINICO">Uso en Procedimiento Clínico</option>
              <option value="CONSUMO_INTERNO">Consumo Interno DermaKlinic</option>
              <option value="MERMA">Merma / Frasco Dañado</option>
              <option value="VENCIMIENTO">Retiro por Vencimiento</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Fecha y Hora de Salida</label>
            <input
              type="datetime-local"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Profesional / Solicitante</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Ej. Dra. María Paz / Pabellón 2"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Notas / Procedimiento / Ficha Paciente</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Ej. Aplicación de Relleno Labial Paciente #3049"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
          >
            {saving ? 'Registrando...' : 'Confirmar Egreso de Inventario'}
          </button>
        </div>
      </form>
    </div>
  );
}
