import React, { useState, Component, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import WelcomeAuth from './components/WelcomeAuth';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Logo from './components/Logo';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error no capturado en la app:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Error limpiando almacenamiento:', e);
    }
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-text-main flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-surface border border-border p-8 rounded-3xl max-w-md w-full shadow-xl space-y-4">
            <div className="bg-red-500/10 text-red-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h2 className="text-xl font-bold">Tu sesión caducó o requiere reinicio</h2>
            <p className="text-sm text-text-muted">
              Detectamos un problema de sesión o credenciales. Hacé clic abajo para volver a la pantalla de inicio de sesión.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-primary text-surface font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-md"
            >
              Volver al Inicio de Sesión
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { user, isGuest, loading } = useAuth();
  const [userGoal, setUserGoal] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-primary/10 rounded-full animate-pulse">
          <Logo className="w-12 h-12 text-primary" />
        </div>
        <div className="flex items-center gap-2 text-text-muted text-sm font-bold">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          <span className="ml-1">Cargando Vintén...</span>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <WelcomeAuth />;
  }

  return (
    <>
      <MainLayout userGoal={userGoal} setUserGoal={setUserGoal} />
      <PWAInstallPrompt />
    </>
  );
}

export default function App() {
  return (
    <AuthErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AuthErrorBoundary>
  );
}
