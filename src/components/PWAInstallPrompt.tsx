import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent default mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Respuesta del usuario al prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center">
            <img src="/icons/icon.svg" alt="Vintén Logo" className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-400">Instala Vintén</h4>
            <p className="text-xs text-slate-300">
              Instala la aplicación en tu pantalla de inicio para un acceso rápido y uso offline.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded-lg"
        >
          Ahora no
        </button>
        <button
          onClick={handleInstallClick}
          className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all duration-200 shadow-md flex items-center gap-1.5 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Instalar App
        </button>
      </div>
    </div>
  );
}
