import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import Logo from './Logo';

interface WelcomeProps {
  onGoalSet: (goal: string) => void;
  onNavigate: (view: any) => void;
}

export default function Welcome({ onGoalSet, onNavigate }: WelcomeProps) {
  const [messages, setMessages] = useState<{ role: 'model' | 'user', text: string }[]>([
    { role: 'model', text: '¡Buenas! Soy Vintén, tu tutor financiero. Antes de arrancar, ¿qué meta tenés hoy? ¿Ahorrar para el viaje de egresados, entender cómo se usa la Prex o simplemente que no se te vaya la guita en el boleto?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `El usuario está chateando en la pantalla de bienvenida de la app Vintén.
      Respuesta del usuario: "${userMsg}"
      
      Tu tarea:
      1. Extrae la meta principal del usuario de forma concisa (ej: "Viaje de egresados", "Ahorrar para la Prex", "Controlar gastos diarios"). Si no hay una meta clara, intenta inferir una intención o simplemente pon "Ahorro General".
      2. Responde amigablemente confirmando la meta (si la hay) o respondiendo a su pregunta.
      
      Devuelve tu respuesta en formato JSON:
      {
        "extractedGoal": "Meta extraída",
        "reply": "Tu respuesta amigable"
      }`;

      const response = await ai.models.generateContent({
        model: 'models/gemini-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const data = JSON.parse(response.text || '{}');

      setMessages(prev => [...prev, { role: 'model', text: data.reply || '¡Genial! Vamos a trabajar en eso.' }]);

      if (data.extractedGoal) {
        onGoalSet(data.extractedGoal);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: '¡Buenísimo! Vamos a darle con todo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { id: 'dashboard', icon: 'account_balance', title: 'Mi Bóveda', desc: 'Controlá tu saldo y salud financiera.' },
    { id: 'tracker', icon: 'receipt_long', title: 'Escáner', desc: 'Registrá gastos y recibí consejos.' },
    { id: 'course', icon: 'play_lesson', title: 'Curso', desc: 'Formación financiera estructurada.' },
    { id: 'academy', icon: 'school', title: 'Academia', desc: 'Aprendé finanzas a tu ritmo.' },
    { id: 'counselor', icon: 'forum', title: 'Consejero', desc: 'Preguntame lo que quieras 24/7.' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      <div className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">

        {/* Intro Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex bg-primary/10 p-4 rounded-full mb-2">
            <Logo className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-main">Bienvenido a Vintén</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Tu compañero para entender la plata, ahorrar sin sufrir y cumplir tus metas.
            Acá no juzgamos gastos, los optimizamos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {features.map((f, i) => (
              <button
                key={i}
                onClick={() => onNavigate(f.id)}
                className="bg-surface p-4 rounded-2xl border border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all text-left cursor-pointer active:scale-95"
              >
                <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">{f.icon}</span>
                </div>
                <h3 className="font-bold text-text-main">{f.title}</h3>
                <p className="text-xs text-text-muted mt-1">{f.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Chat Section */}
        <section className="bg-surface rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col h-[500px]">
          <div className="bg-primary p-4 text-surface flex items-center gap-3">
            <span className="material-symbols-outlined">smart_toy</span>
            <span className="font-bold">Configurá tu experiencia</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-background/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-primary text-surface rounded-tr-none font-medium'
                  : 'bg-surface border border-border text-text-main rounded-tl-none shadow-sm'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border rounded-2xl rounded-tl-none p-4 flex gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-surface border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribí tu meta o pregunta acá..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-primary text-surface h-12 w-12 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
