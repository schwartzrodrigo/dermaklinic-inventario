'use client';

import React from 'react';
import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardOverviewProps {
  data: any;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  setActiveTab: (tab: string) => void;
  onOpenNuevoEgreso: () => void;
  onOpenNuevaRecepcion: () => void;
}

export default function DashboardOverview({
  data,
  loading,
  error,
  onRetry,
  setActiveTab,
  onOpenNuevoEgreso,
  onOpenNuevaRecepcion,
}: DashboardOverviewProps) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        <p className="text-slate-400 text-sm">Cargando datos del inventario...</p>
      </div>
    );
  }

  if (error || !data || !data.summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] p-8 bg-slate-900/80 border border-slate-800 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="p-4 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">No se pudo cargar el Dashboard</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {error || 'Error al conectar con la base de datos Supabase.'}
        </p>
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-xs text-slate-400 font-mono w-full">
          💡 <span className="text-amber-300 font-semibold">Causa:</span> La base de datos Supabase (<code className="text-teal-400">db.ohevfnfthwmchbzsglwg.supabase.co</code>) no responde (proyecto pausado o string de conexión).
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-teal-900/40 mt-2"
          >
            Reintentar Conexión
          </button>
        )}
      </div>
    );
  }

  const { summary, lotesCriticos, alertasPrecio, movimientosRecientes, productosStockBajo } = data;

  // Formateador de moneda chilena
  const formatCLP = (val: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Formateador de fecha
  const formatFecha = (dStr: string) => {
    if (!dStr) return '-';
    const d = new Date(dStr);
    return d.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Datos para gráfico por categorías (simulado/basado en data real)
  const categoryData = [
    { name: 'Médicos', value: 30, color: '#0ea5e9' },
    { name: 'Estéticos', value: 22, color: '#10b981' },
    { name: 'Escritorio', value: 14, color: '#f59e0b' },
    { name: 'Aseo', value: 5, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida y Acciones Rápidas */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Panel de Control DermaKlinic
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Resumen de stock físico en bodega, lotes críticos, vencimientos y trazabilidad de costos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNuevoEgreso}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-900/30"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Registrar Salida de Insumo</span>
          </button>
          <button
            onClick={onOpenNuevaRecepcion}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-teal-900/30"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Recepción de Productos</span>
          </button>
        </div>
      </div>

      {/* Grid de KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Unidades & Productos */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Insumos Físicos
            </span>
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{summary.totalStockUnidades}</span>
            <span className="text-xs text-slate-400 ml-2">unidades en bodega</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="text-teal-400 font-medium">{summary.totalProductos}</span> productos catalogados
          </div>
        </div>

        {/* KPI 2: Valorización Total */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Valorización de Stock
            </span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{formatCLP(summary.valorizacionTotal)}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">Calculado a costo unitario vigente</div>
        </div>

        {/* KPI 3: Lotes Próximos a Vencer */}
        <div
          onClick={() => setActiveTab('bodega')}
          className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl shadow-sm hover:border-amber-500/60 cursor-pointer transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Lotes Críticos (&lt;60 días)
            </span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{summary.lotesCriticosCount}</span>
            <span className="text-xs text-slate-400">lotes por vencer</span>
          </div>
          <div className="mt-2 text-xs text-amber-300/80 flex items-center gap-1 font-medium">
            <span>Ver semáforo de bodega</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 4: Alertas de Precios de Proveedores */}
        <div
          onClick={() => setActiveTab('precios')}
          className="bg-slate-900 border border-rose-500/30 p-5 rounded-2xl shadow-sm hover:border-rose-500/60 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Alzas de Costos
            </span>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">{summary.alertasPrecioCount}</span>
            <span className="text-xs text-slate-400">alertas detectadas</span>
          </div>
          <div className="mt-2 text-xs text-rose-300/80 flex items-center gap-1 font-medium">
            <span>Ver histórico de variación</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Sección Central: Gráficos y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lotes Críticos / Semáforo de Vencimiento */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Próximos Vencimientos de Lotes (FIFO)</h2>
            </div>
            <button
              onClick={() => setActiveTab('bodega')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              Ver todos en Bodega <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {lotesCriticos.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <span>No hay lotes en riesgo de vencimiento inmediato</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {lotesCriticos.map((lote: any) => {
                const diffMs = new Date(lote.fechaVencimiento).getTime() - new Date().getTime();
                const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                const esVencido = dias <= 0;
                const esCritico = dias > 0 && dias <= 30;

                return (
                  <div
                    key={lote.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                      esVencido
                        ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                        : esCritico
                        ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          esVencido ? 'bg-rose-500 animate-ping' : esCritico ? 'bg-amber-400' : 'bg-yellow-400'
                        }`}
                      ></div>
                      <div className="truncate">
                        <div className="font-bold text-sm text-white truncate">{lote.producto.nombre}</div>
                        <div className="text-slate-400 text-xs flex items-center gap-2 mt-0.5">
                          <span>Lote: <strong className="text-slate-200">{lote.numeroLote}</strong></span>
                          <span>•</span>
                          <span>Disp: <strong className="text-teal-300">{lote.cantidadDisponible} {lote.producto.unidad}s</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-bold">
                        {esVencido ? (
                          <span className="text-rose-400 font-extrabold uppercase">¡VENCIDO!</span>
                        ) : (
                          <span className="text-amber-300">Vence en {dias} días</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">{formatFecha(lote.fechaVencimiento)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alertas de Alza de Costos */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-white">Alzas de Precios Recientes</h2>
            </div>
          </div>

          {alertasPrecio.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No hay alertas de variación de precio
            </div>
          ) : (
            <div className="space-y-3">
              {alertasPrecio.map((alerta: any) => (
                <div
                  key={alerta.id}
                  className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="truncate">{alerta.producto.nombre}</span>
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-extrabold">
                      +{alerta.porcentajeVariacion}%
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs flex justify-between">
                    <span>Proveedor: <strong className="text-slate-200">{alerta.proveedor.nombre}</strong></span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-xs pt-1 border-t border-slate-700/40">
                    <span>Antes: {formatCLP(alerta.precioAnterior)}</span>
                    <span className="text-rose-400 font-bold">Nuevo: {formatCLP(alerta.precioNuevo)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bitácora de Movimientos Recientes (Egresos & Ingresos con Fecha/Hora) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-400" />
            Últimos Movimientos de Inventario (Fecha y Hora)
          </h2>
          <button
            onClick={() => setActiveTab('movimientos')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            Ver Bitácora Completa <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Fecha y Hora</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Insumo</th>
                <th className="p-3 text-right">Cantidad</th>
                <th className="p-3">Motivo / Notas</th>
                <th className="p-3">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {movimientosRecientes.map((mov: any) => {
                const esIngreso = mov.tipoMovimiento === 'INGRESO';
                return (
                  <tr key={mov.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(mov.fechaHora).toLocaleString('es-CL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-3xs ${
                          esIngreso
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {esIngreso ? 'INGRESO' : 'EGRESO'}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-white">{mov.producto.nombre}</td>
                    <td className="p-3 text-right font-bold text-sm">
                      <span className={esIngreso ? 'text-emerald-400' : 'text-rose-400'}>
                        {esIngreso ? `+${mov.cantidad}` : `-${mov.cantidad}`}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-xs">{mov.notas || mov.motivo}</td>
                    <td className="p-3 text-slate-400">{mov.usuario}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
