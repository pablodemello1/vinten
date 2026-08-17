import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import WelcomeAuth from './components/WelcomeAuth';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Logo from './components/Logo';

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
