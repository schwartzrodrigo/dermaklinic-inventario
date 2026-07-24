'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Key, LogIn, Lock, CheckCircle2, X } from 'lucide-react';

export interface UserSession {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  cargo: string;
  avatarColor: string;
}

interface UserSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onSelectUser: (user: UserSession) => void;
  onLogout?: () => void;
}

export default function UserSessionModal({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onLogout,
}: UserSessionModalProps) {
  const [usuarios, setUsuarios] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsuarios();
    }
  }, [isOpen]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/usuarios');
      const data = await res.json();
      if (data.success) {
        setUsuarios(data.usuarios);
        if (currentUser) {
          setSelectedUserId(currentUser.id);
        } else if (data.usuarios.length > 0) {
          setSelectedUserId(data.usuarios[0].id);
        }
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = async (u: UserSession) => {
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: u.id }),
      });
      const data = await res.json();
      if (data.success) {
        onSelectUser(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Error al cambiar usuario');
      }
    } catch (err) {
      setErrorMsg('Error de conexión');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white">Cambiar de Usuario Activo</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Selecciona con cuál usuario deseas operar. Todas las facturas recibidas y salidas de stock quedarán firmadas bajo este nombre en la bitácora de auditoría.
        </p>

        {errorMsg && (
          <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-200 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-slate-400 text-xs">Cargando cuentas registradas...</div>
          ) : (
            usuarios.map((u) => {
              const isActive = currentUser?.id === u.id;
              let passDemo = 'admin123';
              if (u.rol === 'BODEGA') passDemo = 'bodega123';
              if (u.rol === 'PERSONAL_CLINICO') passDemo = 'clinica123';

              return (
                <div
                  key={u.id}
                  onClick={() => handleQuickSwitch(u)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs ${
                    isActive
                      ? 'bg-teal-950/40 border-teal-500 shadow-md shadow-teal-950/40'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-md"
                      style={{ backgroundColor: u.avatarColor || '#0ea5e9' }}
                    >
                      {u.nombre.charAt(0)}
                    </div>

                    <div className="truncate">
                      <div className="font-bold text-white text-sm flex items-center gap-1.5 truncate">
                        <span>{u.nombre}</span>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                      </div>
                      <div className="text-slate-400 text-3xs truncate">{u.cargo || u.rol}</div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-3xs font-extrabold uppercase ${
                        u.rol === 'ADMINISTRADOR'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : u.rol === 'BODEGA'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {u.rol}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
          {onLogout ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5"
            >
              <LogIn className="w-4 h-4 rotate-180" />
              <span>Cerrar Sesión</span>
            </button>
          ) : <div></div>}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
