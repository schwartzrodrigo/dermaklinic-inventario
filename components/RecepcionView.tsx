'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react';
import ProveedorSearchAutocomplete from './ProveedorSearchAutocomplete';
import InsumoSearchAutocomplete from './InsumoSearchAutocomplete';

interface RecepcionViewProps {
  currentUser?: any;
  onRecepcionCompletada?: () => void;
}

export default function RecepcionView({ currentUser, onRecepcionCompletada }: RecepcionViewProps) {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [tipo, setTipo] = useState('FACTURA');
  const [numeroDoc, setNumeroDoc] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0]);
  const [observaciones, setObservaciones] = useState('');

  // Filas de ítems recibidos
  const [items, setItems] = useState<
    Array<{
      productoId: string;
      numeroLote: string;
      fechaVencimiento: string;
      cantidad: number;
      costoUnitario: number;
    }>
  >([
    {
      productoId: '',
      numeroLote: '',
      fechaVencimiento: '',
      cantidad: 1,
      costoUnitario: 0,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [mensajeStatus, setMensajeStatus] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [alertasGeneradas, setAlertasGeneradas] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recepcion');
      const data = await res.json();
      if (data.success) {
        setProveedores(data.proveedores);
        setProductos(data.productos);
        setDocumentos(data.documentos);
        if (data.proveedores.length > 0) setProveedorId(data.proveedores[0].id);
        if (data.productos.length > 0 && items[0].productoId === '') {
          setItems([
            {
              productoId: data.productos[0].id,
              numeroLote: `LOT-${Date.now().toString().slice(-5)}`,
              fechaVencimiento: '',
              cantidad: 5,
              costoUnitario: data.productos[0].precioActual || 10000,
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Error al cargar datos de recepción:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const prodDefault = productos[0]?.id || '';
    setItems([
      ...items,
      {
        productoId: prodDefault,
        numeroLote: `LOT-${Date.now().toString().slice(-5)}`,
        fechaVencimiento: '',
        cantidad: 1,
        costoUnitario: productos[0]?.precioActual || 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;

    // Autorellenar costoUnitario por defecto al cambiar de producto
    if (field === 'productoId') {
      const p = productos.find((prod) => prod.id === value);
      if (p) {
        newItems[index].costoUnitario = p.precioActual || 0;
      }
    }

    setItems(newItems);
  };

  const calcularTotalDoc = () => {
    return items.reduce((acc, item) => acc + (Number(item.cantidad) || 0) * (Number(item.costoUnitario) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeStatus(null);
    setAlertasGeneradas([]);

    if (!numeroDoc || !proveedorId) {
      setMensajeStatus({ tipo: 'error', texto: 'Por favor completa el número de documento y proveedor.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/recepcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          numeroDoc,
          proveedorId,
          fechaEmision,
          usuarioId: currentUser?.id,
          usuarioNombre: currentUser?.nombre,
          observaciones,
          items,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setMensajeStatus({ tipo: 'error', texto: data.error || 'Error al procesar recepción' });
      } else {
        setMensajeStatus({
          tipo: 'success',
          texto: `Recepción registrada con éxito. Total Documento: ${formatCLP(data.totalDocumento)}`,
        });

        if (data.alertasGeneradas && data.alertasGeneradas.length > 0) {
          setAlertasGeneradas(data.alertasGeneradas);
        }

        // Limpiar formulario
        setNumeroDoc('');
        setObservaciones('');
        fetchData();
        if (onRecepcionCompletada) onRecepcionCompletada();
      }
    } catch (err) {
      setMensajeStatus({ tipo: 'error', texto: 'Error de red al registrar la recepción' });
    } finally {
      setSaving(false);
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
          <FileSpreadsheet className="w-5 h-5 text-teal-400" />
          Ingreso de Facturas & Guías de Despacho
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Registra productos físicos recibidos, asigna número de lote, fecha de vencimiento y audita incrementos de costos por proveedor.
        </p>
      </div>

      {mensajeStatus && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
            mensajeStatus.tipo === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/60 border-rose-800 text-rose-200'
          }`}
        >
          {mensajeStatus.tipo === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{mensajeStatus.texto}</span>
        </div>
      )}

      {/* Alerta de Variación de Precio Popup/Card */}
      {alertasGeneradas.length > 0 && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            ¡ATENCIÓN! Se detectaron incrementos de costo en esta factura
          </div>
          <p className="text-xs text-rose-200/80">
            El sistema ha guardado la alerta de variación de precio para análisis en el módulo de auditoría de costos.
          </p>
        </div>
      )}

      {/* Formulario Principal */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            1. Datos del Documento del Proveedor
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tipo Documento</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="FACTURA">Factura de Compra</option>
                <option value="GUIA_DESPACHO">Guía de Despacho</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Número Documento</label>
              <input
                type="text"
                required
                placeholder="Ej. F-10492"
                value={numeroDoc}
                onChange={(e) => setNumeroDoc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Proveedor (Buscador Predictivo)</label>
              <ProveedorSearchAutocomplete
                placeholder="Escribe para buscar proveedor..."
                onSelectProveedor={(prov) => {
                  if (prov) setProveedorId(prov.id);
                }}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fecha Emisión Documento</label>
              <input
                type="date"
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Observaciones / Notas de Recepción</label>
            <input
              type="text"
              placeholder="Ej. Recepción conforme en bodega. Cajas sin roturas."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Detalle de Productos & Lotes */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white">2. Insumos Recibidos (Asignación de Lote & Vencimiento)</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 font-semibold"
            >
              <Plus className="w-4 h-4" /> <span>Añadir Insumo</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <div className="md:col-span-4">
                  <label className="block text-slate-400 mb-1 font-medium">Buscador de Insumo</label>
                  <InsumoSearchAutocomplete
                    placeholder="Escribe insumo (ej. Botox, Nitrilo)..."
                    onSelectProduct={(p) => {
                      if (p) handleItemChange(idx, 'productoId', p.id);
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Número de Lote</label>
                  <input
                    type="text"
                    required
                    placeholder="LOT-1234"
                    value={item.numeroLote}
                    onChange={(e) => handleItemChange(idx, 'numeroLote', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">F. Vencimiento</label>
                  <input
                    type="date"
                    value={item.fechaVencimiento}
                    onChange={(e) => handleItemChange(idx, 'fechaVencimiento', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-slate-400 mb-1 font-medium">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(idx, 'cantidad', parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Costo Unit. ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={item.costoUnitario}
                    onChange={(e) => handleItemChange(idx, 'costoUnitario', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold text-teal-300"
                  />
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-800 gap-4">
            <div className="text-slate-400 text-xs">
              Total Calculado del Documento:{' '}
              <strong className="text-xl text-white font-extrabold ml-2">
                {formatCLP(calcularTotalDoc())}
              </strong>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2"
            >
              {saving ? 'Procesando...' : 'Confirmar e Ingresar a Bodega'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
