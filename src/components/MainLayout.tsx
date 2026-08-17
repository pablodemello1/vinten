import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../lib/activityLogger';
import Assistant from './Assistant';
import Course from './Course';
import Academy from './Academy';
import RecommendedMaterials from './RecommendedMaterials';
import Logo from './Logo';

interface MainLayoutProps {
  userGoal: string;
  setUserGoal: (goal: string) => void;
}

export default function MainLayout({ userGoal, setUserGoal }: MainLayoutProps) {
  const { user, profile, isGuest, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'assistant' | 'course' | 'academy' | 'materials'>('assistant');
  const [initialAssistantQuery, setInitialAssistantQuery] = useState<string>('');

  const navItems = [
    { id: 'assistant', icon: 'smart_toy', label: 'Asistente Vintén' },
    { id: 'course', icon: 'play_lesson', label: 'Curso' },
    { id: 'academy', icon: 'school', label: 'Ruta de Aprendizaje' },
    { id: 'materials', icon: 'auto_stories', label: 'Materiales recomendados' },
  ] as const;

  useEffect(() => {
    logActivity('view_page', `Navegación a ${currentView}`, { view: currentView });
  }, [currentView]);

  const handleDiscussResource = (queryPrompt: string) => {
    setInitialAssistantQuery(queryPrompt);
    setCurrentView('assistant');
  };

  const handleNavClick = (viewId: 'assistant' | 'course' | 'academy' | 'materials') => {
    setCurrentView(viewId);
  };

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Invitado';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col hidden md:flex justify-between">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary text-surface p-2 rounded-xl">
              <Logo className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-primary">Vintén</h1>
          </div>

          <nav className="px-4 space-y-2 mt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors cursor-pointer ${
                  currentView === item.id
                    ? 'bg-primary text-surface'
                    : 'text-text-muted hover:bg-background hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Footer Card in Sidebar */}
        <div className="p-4 border-t border-border m-4 bg-background rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-surface flex-shrink-0 ${
                isGuest ? 'bg-secondary' : 'bg-primary'
              }`}>
                {isGuest ? (
                  <span className="material-symbols-outlined text-base">person_outline</span>
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-text-main truncate">
                  {isGuest ? 'Modo Invitado' : displayName}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {isGuest ? 'Sin cuenta registrada' : user?.email}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full mt-2 py-2 px-3 bg-surface hover:bg-red-500/10 hover:text-red-600 text-text-muted border border-border rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              {isGuest ? 'login' : 'logout'}
            </span>
            <span>{isGuest ? 'Iniciar Sesión / Crear Cuenta' : 'Cerrar Sesión'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative pb-16 md:pb-0">
        {/* Top Header Mobile */}
        <header className="md:hidden bg-surface border-b border-border p-3 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-primary" />
            <span className="font-black text-primary text-lg">Vintén</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-muted">
              {isGuest ? '👤 Invitado' : `👤 ${displayName}`}
            </span>
            <button
              onClick={() => signOut()}
              className="p-1.5 bg-background border border-border rounded-lg text-text-muted hover:text-primary cursor-pointer text-xs"
              title={isGuest ? 'Iniciar Sesión' : 'Cerrar Sesión'}
            >
              <span className="material-symbols-outlined text-sm">
                {isGuest ? 'login' : 'logout'}
              </span>
            </button>
          </div>
        </header>

        {currentView === 'assistant' && (
          <Assistant
            userGoal={userGoal}
            setUserGoal={setUserGoal}
            onNavigate={setCurrentView}
            initialQuery={initialAssistantQuery}
            clearInitialQuery={() => setInitialAssistantQuery('')}
          />
        )}
        {currentView === 'course' && <Course />}
        {currentView === 'academy' && <Academy />}
        {currentView === 'materials' && (
          <RecommendedMaterials onDiscussResource={handleDiscussResource} />
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-border flex justify-around p-3 z-50 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer min-w-[60px] ${
              currentView === item.id ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
