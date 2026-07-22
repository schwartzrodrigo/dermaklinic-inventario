'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Phone, Mail, MapPin, User, FileText, X } from 'lucide-react';
import ProveedorSearchAutocomplete from './ProveedorSearchAutocomplete';

export default function ProveedoresView() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedProveedorId, setSelectedProveedorId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchProveedores();
  }, [query]);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/proveedores', window.location.origin);
      if (query) url.searchParams.append('q', query);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setProveedores(data.proveedores);
      }
    } catch (err) {
      console.error('Error al consultar proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNuevo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const res = await fetch('/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        setFormError(data.error || 'Error al guardar proveedor');
      } else {
        setShowModal(false);
        setFormData({
          rut: '',
          nombre: '',
          contacto: '',
          telefono: '',
          email: '',
          direccion: '',
        });
        fetchProveedores();
      }
    } catch (err) {
      setFormError('Error de red al guardar el proveedor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-400" />
            Directorio & Registro de Proveedores
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Buscador predictivo por nombre, RUT o contacto para emisión de facturas y guías de despacho.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proveedor</span>
        </button>
      </div>

      {/* Buscador de Proveedores con Autocompletado */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <ProveedorSearchAutocomplete
          placeholder="Escribe letras para buscar proveedores (ej. Dermaceuticals, San Andrés, 76.849)..."
          onSearchQueryChange={(q) => setQuery(q)}
          onSelectProveedor={(prov) => {
            if (prov) {
              setSelectedProveedorId(prov.id);
            } else {
              setSelectedProveedorId(null);
            }
          }}
        />
      </div>

      {/* Grid de Tarjetas de Proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Cargando directorio...</div>
        ) : proveedores.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-sm">
            No se encontraron proveedores que coincidan con la búsqueda.
          </div>
        ) : (
          proveedores.map((p) => {
            const isHighlighted = selectedProveedorId === p.id;
            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isHighlighted
                    ? 'bg-teal-950/40 border-teal-500 shadow-xl shadow-teal-950/50 scale-[1.02]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-base">{p.nombre}</h3>
                    {p.rut && <span className="font-mono text-teal-300 font-bold text-xs">RUT: {p.rut}</span>}
                  </div>
                  <div className="p-2 bg-slate-800 rounded-xl text-teal-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  {p.contacto && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Contacto: <strong>{p.contacto}</strong></span>
                    </div>
                  )}

                  {p.telefono && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Teléfono: <strong>{p.telefono}</strong></span>
                    </div>
                  )}

                  {p.email && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{p.email}</span>
                    </div>
                  )}

                  {p.direccion && (
                    <div className="flex items-center gap-2 text-slate-400 text-3xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{p.direccion}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-3xs text-slate-500 flex justify-between border-t border-slate-800/50">
                  <span>Documentos Recibidos: {p.documentos?.length || 0}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para Crear Proveedor */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" /> Registrar Proveedor
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
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
                  <label className="block font-semibold text-slate-300 mb-1">RUT Proveedor</label>
                  <input
                    type="text"
                    placeholder="Ej. 76.849.201-9"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nombre / Razón Social</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dermaceuticals Chile SpA"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nombre de Contacto</label>
                  <input
                    type="text"
                    placeholder="Ej. Mariana López"
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="Ej. +56 9 8765 4321"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email de Pedidos</label>
                <input
                  type="email"
                  placeholder="Ej. ventas@proveedor.cl"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Dirección Comercial</label>
                <input
                  type="text"
                  placeholder="Ej. Av. Vitacura 2900, Santiago"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium flex items-center gap-1"
                >
                  {saving ? 'Guardando...' : 'Guardar Proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
