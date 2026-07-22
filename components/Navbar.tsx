'use client';

import React from 'react';
import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  Warehouse,
  ArrowUpRight,
  TrendingUp,
  ClipboardCheck,
  History,
  Activity,
  PlusCircle,
  Building2,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  onOpenUserModal: () => void;
  onOpenNuevoProducto?: () => void;
  onOpenNuevoEgreso?: () => void;
  onOpenNuevaRecepcion?: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenUserModal,
  onOpenNuevoProducto,
  onOpenNuevoEgreso,
  onOpenNuevaRecepcion,
}: NavbarProps) {
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'productos', label: 'Catálogo', icon: Package },
    { id: 'proveedores', label: 'Proveedores', icon: Building2 },
    { id: 'recepcion', label: 'Recepciones & Facturas', icon: FileSpreadsheet },
    { id: 'bodega', label: 'Bodega & Lotes', icon: Warehouse },
    { id: 'egresos', label: 'Salidas (Egresos)', icon: ArrowUpRight },
    { id: 'precios', label: 'Variación de Precios', icon: TrendingUp },
    { id: 'auditoria', label: 'Auditoría Mensual', icon: ClipboardCheck },
    { id: 'movimientos', label: 'Bitácora / Histórico', icon: History },
  ];

  // Si el usuario es PERSONAL_CLINICO, restringir acceso únicamente a Recepciones y Egresos
  const isRestrictedUser = currentUser?.rol === 'PERSONAL_CLINICO';

  const navItems = isRestrictedUser
    ? allNavItems.filter((item) => item.id === 'recepcion' || item.id === 'egresos')
    : allNavItems;

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-lg">
        {/* Upper bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo & Brand */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => {
                if (!isRestrictedUser) setActiveTab('dashboard');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 flex-shrink-0">
                <Activity className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">DermaKlinic</span>
                  <span className="bg-teal-500/20 text-teal-300 text-3xs font-semibold px-2 py-0.5 rounded-full border border-teal-500/30 hidden xs:inline-block">
                    Inventario v1.0
                  </span>
                </div>
                <p className="text-3xs sm:text-xs text-slate-400">Control Clínico & Bodega</p>
              </div>
            </div>

            {/* User Profile Selector & Quick Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* User Profile Active Selector */}
              <button
                onClick={onOpenUserModal}
                className="flex items-center space-x-2 bg-slate-950 border border-slate-800 hover:border-teal-500/60 p-1.5 sm:pr-3 rounded-xl transition-all shadow-sm group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-white text-xs shadow flex-shrink-0"
                  style={{ backgroundColor: currentUser?.avatarColor || '#10b981' }}
                >
                  {currentUser?.nombre ? currentUser.nombre.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight group-hover:text-teal-300 transition-colors">
                    {currentUser?.nombre || 'Dra. María Paz Soto'}
                  </div>
                  <div className="text-3xs text-teal-400 font-semibold leading-tight flex items-center gap-1">
                    {isRestrictedUser && <Lock className="w-3 h-3 text-purple-400" />}
                    {currentUser?.rol || 'ADMINISTRADOR'} (Cambiar)
                  </div>
                </div>
              </button>

              {onOpenNuevoEgreso && (
                <button
                  onClick={onOpenNuevoEgreso}
                  className="hidden lg:flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Registrar Egreso</span>
                </button>
              )}

              {onOpenNuevaRecepcion && (
                <button
                  onClick={onOpenNuevaRecepcion}
                  className="hidden lg:flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Ingresar Factura</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet Horizontal Scroll) */}
          <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Smartphone Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md flex md:hidden justify-around items-center px-1 py-2 shadow-2xl">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-0.5 flex-1 py-1 transition-all ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400 scale-110' : 'text-slate-400'}`} />
              <span className="text-[10px] leading-tight truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
