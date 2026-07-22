'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DashboardOverview from '@/components/DashboardOverview';
import ProductosView from '@/components/ProductosView';
import ProveedoresView from '@/components/ProveedoresView';
import RecepcionView from '@/components/RecepcionView';
import BodegaView from '@/components/BodegaView';
import EgresosView from '@/components/EgresosView';
import PreciosView from '@/components/PreciosView';
import AuditoriaView from '@/components/AuditoriaView';
import MovimientosView from '@/components/MovimientosView';
import UserSessionModal, { UserSession } from '@/components/UserSessionModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Active User State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [openUserModal, setOpenUserModal] = useState(false);

  // Modal triggers
  const [openNuevoProductoModal, setOpenNuevoProductoModal] = useState(false);

  // Initial user load & restore from localStorage
  useEffect(() => {
    fetchDashboard();
    initUserSession();
  }, []);

  const initUserSession = async () => {
    try {
      const savedUser = localStorage.getItem('dermaklinic_active_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        checkRoleRestrictions(u, activeTab);
        return;
      }

      // Default initial user (Admin)
      const res = await fetch('/api/auth/usuarios');
      const data = await res.json();
      if (data.success && data.usuarios.length > 0) {
        const defaultUser = data.usuarios[0]; // Dra. María Paz Soto
        setCurrentUser(defaultUser);
        localStorage.setItem('dermaklinic_active_user', JSON.stringify(defaultUser));
      }
    } catch (err) {
      console.error('Error al inicializar sesión:', err);
    }
  };

  const handleSelectUser = (user: UserSession) => {
    setCurrentUser(user);
    localStorage.setItem('dermaklinic_active_user', JSON.stringify(user));
    checkRoleRestrictions(user, activeTab);
  };

  const checkRoleRestrictions = (user: UserSession | null, tab: string) => {
    if (user?.rol === 'PERSONAL_CLINICO') {
      // Solo tiene acceso a Ingreso de productos (recepcion) y Egresos (egresos)
      if (tab !== 'recepcion' && tab !== 'egresos') {
        setActiveTab('egresos');
      }
    }
  };

  const handleTabChange = (tab: string) => {
    if (currentUser?.rol === 'PERSONAL_CLINICO') {
      if (tab !== 'recepcion' && tab !== 'egresos') {
        return; // Restringido
      }
    }
    setActiveTab(tab);
  };

  const fetchDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error al obtener datos del dashboard:', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleOpenNuevoProducto = () => {
    if (currentUser?.rol === 'PERSONAL_CLINICO') return;
    setActiveTab('productos');
    setOpenNuevoProductoModal(true);
  };

  const handleOpenNuevoEgreso = () => {
    setActiveTab('egresos');
  };

  const handleOpenNuevaRecepcion = () => {
    setActiveTab('recepcion');
  };

  const esRestringido = currentUser?.rol === 'PERSONAL_CLINICO';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-slate-950 pb-16 md:pb-0">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onOpenUserModal={() => setOpenUserModal(true)}
        onOpenNuevoProducto={esRestringido ? undefined : handleOpenNuevoProducto}
        onOpenNuevoEgreso={handleOpenNuevoEgreso}
        onOpenNuevaRecepcion={handleOpenNuevaRecepcion}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner de Aviso Perfil Restringido */}
        {esRestringido && (
          <div className="mb-6 p-4 bg-purple-950/40 border border-purple-800/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-extrabold text-purple-300 block text-sm">
                Perfil de Usuario Clínico: {currentUser?.nombre}
              </span>
              <p className="text-purple-200/80 mt-0.5">
                Acceso exclusivo habilitado para **Ingreso de Productos (Recepciones)** y **Salida de Insumos (Egresos)**. El dashboard y catálogo general están restringidos.
              </p>
            </div>
            <button
              onClick={() => setOpenUserModal(true)}
              className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700 rounded-xl font-bold whitespace-nowrap"
            >
              Cambiar Usuario
            </button>
          </div>
        )}

        {/* Tab content */}
        {!esRestringido && activeTab === 'dashboard' && (
          <DashboardOverview
            data={dashboardData}
            setActiveTab={handleTabChange}
            onOpenNuevoEgreso={handleOpenNuevoEgreso}
            onOpenNuevaRecepcion={handleOpenNuevaRecepcion}
          />
        )}

        {!esRestringido && activeTab === 'productos' && (
          <ProductosView
            onOpenNuevoModal={openNuevoProductoModal}
            onCloseNuevoModal={() => setOpenNuevoProductoModal(false)}
          />
        )}

        {!esRestringido && activeTab === 'proveedores' && <ProveedoresView />}

        {activeTab === 'recepcion' && (
          <RecepcionView
            currentUser={currentUser}
            onRecepcionCompletada={() => {
              fetchDashboard();
            }}
          />
        )}

        {!esRestringido && activeTab === 'bodega' && <BodegaView />}

        {activeTab === 'egresos' && (
          <EgresosView
            currentUser={currentUser}
            onEgresoCompletado={() => {
              fetchDashboard();
            }}
          />
        )}

        {!esRestringido && activeTab === 'precios' && <PreciosView />}

        {!esRestringido && activeTab === 'auditoria' && <AuditoriaView />}

        {!esRestringido && activeTab === 'movimientos' && <MovimientosView />}
      </main>

      {/* User Switcher Modal */}
      <UserSessionModal
        isOpen={openUserModal}
        onClose={() => setOpenUserModal(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}
