import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function WelcomeAuth() {
  const { signInWithEmail, signUpWithEmail, continueAsGuest, loading } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Por favor, completá todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);

    if (isLoginTab) {
      // Iniciar Sesión
      const { error } = await signInWithEmail(email.trim(), password);
      if (error) {
        console.error('Error al iniciar sesión:', error);
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Email o contraseña incorrectos. Verificá tus datos e intentá de nuevo.');
        } else {
          setErrorMessage(error.message || 'Error al iniciar sesión. Intentá nuevamente.');
        }
      }
    } else {
      // Registrarse
      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.');
        setIsSubmitting(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await signUpWithEmail(email.trim(), password, fullName.trim());
      if (error) {
        console.error('Error al registrar usuario:', error);
        if (error.message.includes('already registered')) {
          setErrorMessage('Este correo ya se encuentra registrado. Probá iniciar sesión.');
        } else {
          setErrorMessage(error.message || 'Error al crear la cuenta. Intentá nuevamente.');
        }
      } else {
        setSuccessMessage('¡Cuenta creada con éxito! Ingresando a Vintén...');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col justify-between p-4 sm:p-6 md:p-10 custom-scrollbar overflow-y-auto">
      {/* Container max-w */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 py-6">
        
        {/* Left Side: Branding & Features */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-bold text-primary text-sm tracking-wide uppercase">Vintén Financial Tutor</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-main leading-tight">
            Tomá el control de tus <span className="text-primary">finanzas</span> sin complicaciones.
          </h1>

          <p className="text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Tu compañero financiero inteligente. Aprendé a ahorrar, proyectar tus compras en cuotas y recibir consejos de presupuesto 24/7.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary flex-shrink-0">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-main">Asistente IA 24/7</h4>
                <p className="text-xs text-text-muted mt-0.5">Respuestas al instante sobre tu plata.</p>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-start gap-3">
              <div className="bg-secondary/20 p-2 rounded-xl text-secondary flex-shrink-0">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-main">Cursos Prácticos</h4>
                <p className="text-xs text-text-muted mt-0.5">Aprendé finanzas paso a paso.</p>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary flex-shrink-0">
                <span className="material-symbols-outlined">savings</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-main">Metas Claras</h4>
                <p className="text-xs text-text-muted mt-0.5">Optimizá tus gastos para lo que importa.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login / Register / Guest Form */}
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          {/* Top Banner accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary" />

          {/* Form Tabs */}
          <div className="flex bg-background p-1.5 rounded-2xl border border-border mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                isLoginTab
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                !isLoginTab
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-4 p-3.5 bg-green-500/10 border border-green-500/30 text-green-700 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base flex-shrink-0">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-text-muted text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-text-muted text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-text-muted text-lg">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-text-muted hover:text-text-main cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-text-muted text-lg">
                    lock_reset
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-primary text-surface font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>{isLoginTab ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">o bien</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Guest Action */}
          <div>
            <button
              type="button"
              onClick={continueAsGuest}
              className="w-full bg-background hover:bg-surface border-2 border-dashed border-border hover:border-primary/50 text-text-main font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                explore
              </span>
              <span>Continuar como invitado</span>
            </button>
            <p className="text-[11px] text-text-muted text-center mt-2">
              Explorá la aplicación y probá las funciones sin crear una cuenta.
            </p>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-text-muted py-4 border-t border-border/50 max-w-6xl mx-auto w-full">
        Vintén © {new Date().getFullYear()} — Tu tutor financiero personal
      </footer>
    </div>
  );
}
