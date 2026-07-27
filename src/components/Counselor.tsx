import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'model' | 'user';
  text: string;
  timestamp: string;
}

export default function Counselor({ userGoal }: { userGoal: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: '¡Buenas! Soy tu consejero financiero 24/7. Mi misión es que no quemes la plata al santo botón. ¿En qué te puedo dar una mano hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: '¿Cuotas o Contado?', icon: 'credit_card' },
    { label: '¿Cómo ahorro para mi meta?', icon: 'ads_click' },
    { label: '¿Qué es el interés?', icon: 'trending_up' },
    { label: 'Consejo del día', icon: 'lightbulb' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setInput('');
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // We pass the last 10 messages for context
      const historyContext = messages.slice(-10).map(m => `${m.role === 'user' ? 'Usuario' : 'Vintén'}: ${m.text}`).join('\n');

      const prompt = `Eres Vintén, el mejor consejero financiero para adolescentes en Uruguay. 
      Hablas con jerga uruguaya joven (che, bo, plata, vintén, al toque, de menos, etc.) pero de forma experta y cercana.
      
      CONTEXTO DEL USUARIO:
      - Su meta actual es: "${userGoal || 'Ahorrar para el futuro'}".
      
      CATÁLOGO DE LA ACADEMIA (Podes recomendar estos temas):
      - Módulo 1 (ABC Economía): Rol del Banco Central (BCU), cómo se emite el peso uruguayo.
      - Módulo 2 (Presupuesto): Gastos hormiga, Necesidad vs Deseo, cómo armar un presupuesto.
      - Módulo 3 (Crédito): Tarjetas, peligros de las cuotas, recargos e intereses.
      - Módulo 4 (Ahorro/Inversión): Ahorro grupal, el poder del interés compuesto, ahorrar en UI (Unidades Indexadas).

      REGLAS DE RESPUESTA:
      1. Sé extremadamente práctico. Si preguntan por cuotas, explica el recargo.
      2. Usa emojis sutilmente.
      3. No des respuestas gigantes. Divide en párrafos cortos.
      4. Menciona siempre cómo su decisión afecta su meta: "${userGoal}".
      5. AL FINAL DE CADA RESPUESTA: Recomienda SIEMPRE una lección o módulo específico de la "Academia Vintén" que le sirva para profundizar lo que preguntó. 
         - Ejemplo: "Si querés saber más, tirate a la Academia y fichate el Módulo 3 sobre el laberinto de las cuotas, te va a servir pila."
      
      HISTORIAL RECIENTE:
      ${historyContext}
      
      PREGUNTA ACTUAL: ${textToSend}
      
      RESPUESTA DE VINTÉN (en Markdown):`;

      const response = await ai.models.generateContent({
        model: 'models/gemini-flash-latest',
        contents: prompt,
      });

      const modelMsg: Message = {
        role: 'model',
        text: response.text || 'Mmm, se me mezclaron los cables con el tipo de cambio. ¿Me repetís?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: '¡Pa! Se me cortó el chorro de datos. Probá de nuevo en un toque.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden font-sans">
      {/* Header Estilizado */}
      <header className="p-6 bg-surface border-b border-border flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-primary text-surface rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl fill-1">smart_toy</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-2 border-surface rounded-full"></div>
          </div>
          <div>
            <h2 className="text-xl font-black text-text-main tracking-tight">Consejero Vintén</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary animate-pulse">En Línea</span>
              <span className="w-1 h-1 bg-border rounded-full"></span>
              <p className="text-[10px] text-text-muted font-bold truncate max-w-[150px]">Meta: {userGoal || 'Sin meta definida'}</p>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </header>

      {/* Área de Chat */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mb-1">
                    <span className="material-symbols-outlined text-primary text-sm">face</span>
                  </div>
                )}

                <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[70%]">
                  <div className={`p-4 md:p-5 rounded-3xl shadow-sm border ${msg.role === 'user'
                    ? 'bg-primary text-surface border-primary rounded-br-none'
                    : 'bg-surface text-text-main border-border rounded-bl-none'
                    }`}>
                    {msg.role === 'model' ? (
                      <div className="prose prose-sm md:prose-base prose-slate max-w-none text-inherit leading-relaxed font-medium">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm md:text-base font-bold text-surface">{msg.text}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mb-1">
                    <span className="material-symbols-outlined text-secondary text-sm">person</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm animate-spin">refresh</span>
              </div>
              <div className="bg-surface border border-border px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input y Acciones Rápidas */}
      <footer className="p-4 md:p-8 bg-surface border-t border-border shrink-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Acciones Rápidas */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action.label)}
                disabled={isLoading}
                className="whitespace-nowrap bg-background border border-border hover:border-primary/30 hover:bg-primary/5 px-4 py-2 rounded-xl text-xs font-black text-text-muted hover:text-primary transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>

          {/* Barra de Input */}
          <div className="relative flex items-center gap-3">
            <div className="absolute left-5 text-text-muted">
              <span className="material-symbols-outlined text-xl">edit_note</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Preguntale a Vintén..."
              className="flex-1 bg-background border-2 border-border/50 rounded-[28px] pl-14 pr-16 py-5 text-base md:text-lg font-bold text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-inner placeholder:text-text-muted/30"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bg-primary text-surface h-12 w-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-90 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl fill-1">arrow_upward</span>
            </button>
          </div>
          <p className="text-center text-[9px] font-black text-text-muted/50 uppercase tracking-tighter">Vintén puede cometer errores. Consultá siempre con un adulto antes de inversiones locas.</p>
        </div>
      </footer>
    </div>
  );
}
