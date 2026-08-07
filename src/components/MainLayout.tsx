import React, { useState } from 'react';
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
  const [currentView, setCurrentView] = useState<'assistant' | 'course' | 'academy' | 'materials'>('assistant');
  const [initialAssistantQuery, setInitialAssistantQuery] = useState<string>('');

  const navItems = [
    { id: 'assistant', icon: 'smart_toy', label: 'Asistente Vintén' },
    { id: 'course', icon: 'play_lesson', label: 'Curso' },
    { id: 'academy', icon: 'school', label: 'Ruta de Aprendizaje' },
    { id: 'materials', icon: 'auto_stories', label: 'Materiales recomendados' },
  ] as const;

  const handleDiscussResource = (queryPrompt: string) => {
    setInitialAssistantQuery(queryPrompt);
    setCurrentView('assistant');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary text-surface p-2 rounded-xl">
            <Logo className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-primary">Vintén</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors cursor-pointer ${currentView === item.id
                ? 'bg-primary text-surface'
                : 'text-text-muted hover:bg-background hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative pb-16 md:pb-0">
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

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-border flex justify-around p-3 z-50 overflow-x-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer min-w-[60px] ${currentView === item.id ? 'text-primary' : 'text-text-muted'
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
