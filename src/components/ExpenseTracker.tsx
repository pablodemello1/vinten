import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

interface ScanHistory {
  id: string;
  text: string;
  category: string;
  type: 'gasto' | 'ahorro';
  amount?: string;
  date: string;
}

export default function ExpenseTracker() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [feedback, setFeedback] = useState<{ category: string, message: string, isWarning: boolean } | null>(null);
  const [showGoldAnimation, setShowGoldAnimation] = useState(false);

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('alimento') || cat.includes('comida') || cat.includes('ocio')) return 'fastfood';
    if (cat.includes('transporte') || cat.includes('bondi')) return 'directions_bus';
    if (cat.includes('ahorro') || cat.includes('banco')) return 'savings';
    if (cat.includes('ropa') || cat.includes('shopping')) return 'shopping_bag';
    if (cat.includes('estudio') || cat.includes('libros')) return 'school';
    return 'payments';
  };

  const handleRegister = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setFeedback(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `El usuario registró este movimiento financiero: "${input}". En Uruguay.
      
      Analiza el texto y determina:
      1. Si es un GASTO o un AHORRO/INGRESO.
      2. La categoría (ej: Alimentación/Ocio, Transporte, Ahorro, etc).
      3. El monto aproximado si se menciona (ej: "350").
      4. Un mensaje estilo "Machine Learning" que analice el patrón. Si es un gasto repetitivo (simula que lo es si es comida rápida o snacks), dale una advertencia amigable con jerga uruguaya (ej: "Che, es la tercera vez en la semana que gastás en esto, a este ritmo el viernes te quedás sin un vintén"). Si es un ahorro, felicítalo efusivamente.
      
      Devuelve JSON EXACTO:
      {
        "type": "gasto" | "ahorro",
        "category": "Categoría",
        "amount": "monto o null",
        "message": "Mensaje de feedback"
      }`;

      const response = await ai.models.generateContent({
        model: 'models/gemini-flash-latest',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const data = JSON.parse(response.text || '{}');

      const newEntry: ScanHistory = {
        id: Math.random().toString(36).substr(2, 9),
        text: input,
        category: data.category || 'General',
        type: data.type || 'gasto',
        amount: data.amount,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory(prev => [newEntry, ...prev]);

      setFeedback({
        category: data.category || 'General',
        message: data.message || 'Registro guardado.',
        isWarning: data.type === 'gasto'
      });

      if (data.type === 'ahorro') {
        setShowGoldAnimation(true);
        setTimeout(() => setShowGoldAnimation(false), 3000);
      }

      setInput('');
    } catch (error) {
      console.error(error);
      setFeedback({ category: 'Error', message: 'No pude procesar eso ahora mismo.', isWarning: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative bg-background">
      <AnimatePresence>
        {showGoldAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 px-6"
          >
            <div className="bg-secondary text-surface px-10 py-6 rounded-[40px] font-black text-3xl shadow-[0_20px_50px_rgba(46,204,113,0.3)] flex items-center gap-4 border-4 border-surface/20">
              <span className="material-symbols-outlined text-5xl animate-spin-slow">stars</span>
              ¡Ahorro Registrado!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left Side: Scanner Input */}
        <div className="space-y-8">
          <header>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">center_focus_strong</span>
              </div>
              <h2 className="text-3xl font-black text-text-main">Escáner IA</h2>
            </div>
            <p className="text-text-muted font-medium">Contale a Vintén qué pasó con tu plata hoy.</p>
          </header>

          <div className="bg-surface p-1 rounded-[40px] border border-border shadow-2xl overflow-hidden relative group">
            <div className="p-8 space-y-6">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ej: Gasté 200 en el bondi y un refuerzo..."
                  className="w-full bg-background/50 border-2 border-border/50 rounded-[32px] p-8 text-xl font-bold text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none h-60 placeholder:text-text-muted/30"
                  disabled={isLoading}
                />

                {/* Simulated Scanning UI */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      key="scanner-line"
                      initial={{ top: '0%' }}
                      animate={{ top: '90%' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-10 shadow-[0_0_15px_rgba(52,152,219,0.8)]"
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button className="bg-background border border-border hover:border-primary/30 py-4 rounded-2xl flex flex-col items-center gap-1 transition-colors group cursor-pointer">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">mic</span>
                  <span className="text-[10px] font-black uppercase text-text-muted">Audio</span>
                </button>
                <button className="bg-background border border-border hover:border-primary/30 py-4 rounded-2xl flex flex-col items-center gap-1 transition-colors group cursor-pointer">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors">photo_camera</span>
                  <span className="text-[10px] font-black uppercase text-text-muted">Ticket</span>
                </button>
                <button
                  onClick={handleRegister}
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-surface rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl fill-1">send</span>
                  <span className="text-[10px] font-black uppercase">Enviar</span>
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black text-primary animate-pulse tracking-widest uppercase text-xs">Analizando Patrón...</p>
              </div>
            )}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-8 rounded-[32px] border-2 shadow-xl ${feedback.isWarning
                  ? 'bg-red-50 border-red-100 text-red-900'
                  : 'bg-green-50 border-green-100 text-green-900'
                  }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${feedback.isWarning ? 'bg-red-200' : 'bg-green-200'}`}>
                    <span className="material-symbols-outlined text-3xl">
                      {feedback.isWarning ? 'error' : 'thumb_up'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[2px] opacity-60">Insight Personalizado</span>
                      <span className="w-1 h-1 bg-current opacity-20 rounded-full"></span>
                      <span className="text-[10px] font-black underline uppercase tracking-[2px]">{feedback.category}</span>
                    </div>
                    <p className="font-black text-xl leading-snug">
                      {feedback.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: History & Stats */}
        <div className="bg-surface/50 rounded-[40px] border border-border p-8 flex flex-col h-[700px]">
          <header className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Actividad Reciente
            </h3>
            <span className="bg-background px-3 py-1 rounded-full text-[10px] font-black text-text-muted border border-border">URUGUAY LOCAL</span>
          </header>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-4 px-10 text-center">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center border-2 border-dashed border-border opacity-50">
                  <span className="material-symbols-outlined text-4xl">inventory_2</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Tu bóveda está vacía</p>
                  <p className="text-sm mt-1">Registrá tu primer gasto para ver el análisis de Vintén.</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {history.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className="bg-surface border border-border p-5 rounded-3xl hover:border-primary/20 transition-all group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-1 h-full ${item.type === 'gasto' ? 'bg-red-400' : 'bg-secondary'}`}></div>
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${item.type === 'gasto' ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-surface' : 'bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-surface'}`}>
                        <span className="material-symbols-outlined text-2xl">
                          {getCategoryIcon(item.category)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-text-muted tracking-wider">{item.category}</span>
                          <span className="text-[10px] font-medium text-text-muted">{item.date}</span>
                        </div>
                        <p className="font-bold text-text-main truncate pr-10">{item.text}</p>
                      </div>
                      {item.amount && (
                        <div className="text-right shrink-0">
                          <p className={`font-black text-lg ${item.type === 'gasto' ? 'text-text-main' : 'text-secondary'}`}>
                            {item.type === 'gasto' ? '-' : '+'}${item.amount}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4">
            <div className="bg-background p-5 rounded-3xl border border-border">
              <p className="text-[10px] font-black text-text-muted uppercase mb-1">Total Gastos</p>
              <p className="text-2xl font-black text-text-main">
                ${history.filter(h => h.type === 'gasto').reduce((acc, curr) => acc + (parseInt(curr.amount?.replace(/[^0-9]/g, '') || '0')), 0)}
              </p>
            </div>
            <div className="bg-background p-5 rounded-3xl border border-border">
              <p className="text-[10px] font-black text-secondary uppercase mb-1">Total Ahorro</p>
              <p className="text-2xl font-black text-secondary">
                ${history.filter(h => h.type === 'ahorro').reduce((acc, curr) => acc + (parseInt(curr.amount?.replace(/[^0-9]/g, '') || '0')), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
