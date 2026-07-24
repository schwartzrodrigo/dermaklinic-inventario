'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Lock, UserCheck, Shield, Key, Eye, EyeOff, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserSession } from './UserSessionModal';

interface LoginScreenProps {
  onLoginSuccess: (user: UserSession) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [usuarios, setUsuarios] = useState<UserSession[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserSession | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/auth/usuarios');
      const data = await res.json();
      if (data.success && data.usuarios.length > 0) {
        setUsuarios(data.usuarios);
        // Default select first user without prefilling password
        setSelectedUser(data.usuarios[0]);
        setPassword('');
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectUser = (u: UserSession) => {
    setSelectedUser(u);
    setPassword('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setErrorMsg('Por favor selecciona una cuenta de usuario');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedUser.email,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      setErrorMsg('Error de conexión al autenticar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans antialiased">
      {/* Dynamic Background Glow Effect */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-lg shadow-teal-500/20 mb-1">
            <Activity className="w-8 h-8 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">DermaKlinic</h1>
          <p className="text-xs text-slate-400 font-medium">Sistema de Control Clínico & Bodega</p>
        </div>

        {/* Form Box */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Selecciona tu Cuenta de Usuario
            </label>

            {loadingUsers ? (
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs animate-pulse">
                Cargando cuentas registradas...
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                {usuarios.map((u) => {
                  const isSelected = selectedUser?.id === u.id;
                  const isRestricted = u.rol === 'PERSONAL_CLINICO';

                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs ${
                        isSelected
                          ? 'bg-teal-950/50 border-teal-500 shadow-md shadow-teal-950/50'
                          : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-xs shadow flex-shrink-0"
                          style={{ backgroundColor: u.avatarColor || '#0ea5e9' }}
                        >
                          {u.nombre.charAt(0)}
                        </div>

                        <div className="truncate">
                          <div className="font-bold text-white text-xs flex items-center gap-1.5 truncate">
                            <span>{u.nombre}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                          </div>
                          <div className="text-slate-400 text-3xs truncate">{u.cargo || u.rol}</div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-3xs font-extrabold uppercase ${
                            isRestricted
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isRestricted ? 'ACCESO PARCIAL' : 'ACCESO TOTAL'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Contraseña de Acceso
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs rounded-xl font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !selectedUser}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Ingresar al Sistema</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-2 text-center border-t border-slate-800/60">
          <p className="text-3xs text-slate-500">
            DermaKlinic v1.0 • Control de Insumos Médicos & Bodega
          </p>
        </div>
      </div>
    </div>
  );
}
