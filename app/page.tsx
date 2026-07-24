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
import LoginScreen from '@/components/LoginScreen';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Active User State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [initializingSession, setInitializingSession] = useState(true);
  const [openUserModal, setOpenUserModal] = useState(false);

  // Modal triggers
  const [openNuevoProductoModal, setOpenNuevoProductoModal] = useState(false);

  // Initial user load & restore from localStorage
  useEffect(() => {
    fetchDashboard();
    initUserSession();
  }, []);

  const initUserSession = () => {
    try {
      const savedUser = localStorage.getItem('dermaklinic_active_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        checkRoleRestrictions(u, activeTab);
      } else {
        // Explicito: si no hay usuario guardado, permanece null para mostrar Pantalla de Login
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Error al inicializar sesión:', err);
    } finally {
      setInitializingSession(false);
    }
  };

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    localStorage.setItem('dermaklinic_active_user', JSON.stringify(user));
    checkRoleRestrictions(user, activeTab);
  };

  const handleLogout = () => {
    localStorage.removeItem('dermaklinic_active_user');
    setCurrentUser(null);
    setActiveTab('dashboard');
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
    setDashboardError(null);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      } else {
        setDashboardError(data.error || 'Error al obtener información de la base de datos');
      }
    } catch (err) {
      console.error('Error al obtener datos del dashboard:', err);
      setDashboardError('Error de red o conexión con el servidor');
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

  if (initializingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        <p className="text-slate-400 text-xs font-medium">Verificando sesión...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

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
            loading={loadingDashboard}
            error={dashboardError}
            onRetry={fetchDashboard}
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
        onLogout={handleLogout}
      />
    </div>
  );
}
