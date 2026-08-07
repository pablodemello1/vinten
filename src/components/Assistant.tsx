import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface Message {
  role: 'model' | 'user';
  text: string;
  timestamp: string;
}

interface AssistantProps {
  userGoal: string;
  setUserGoal: (goal: string) => void;
  onNavigate: (view: 'assistant' | 'course' | 'academy' | 'materials') => void;
  initialQuery?: string;
  clearInitialQuery?: () => void;
}

export default function Assistant({ userGoal, setUserGoal, onNavigate, initialQuery, clearInitialQuery }: AssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: '¡Buenas! Soy Vintén, tu asistente financiero 24/7. Mi misión es ayudarte a organizar tus finanzas, ahorrar sin sufrir y cumplir tus metas. ¿En qué te puedo dar una mano hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: '¿Cuotas o Contado?', icon: 'credit_card' },
    { label: '¿Cómo ahorro para mi meta?', icon: 'ads_click' },
    { label: '¿Qué es el interés?', icon: 'trending_up' },
    { label: 'Consejo del día', icon: 'lightbulb' }
  ];

  const featureCards = [
    { id: 'course' as const, icon: 'play_lesson', title: 'Curso', desc: 'Formación financiera estructurada.' },
    { id: 'academy' as const, icon: 'school', title: 'Ruta de Aprendizaje', desc: 'Aprendé finanzas a tu ritmo.' },
    { id: 'materials' as const, icon: 'auto_stories', title: 'Materiales Recomendados', desc: 'Libros, videos y podcasts.' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
      if (clearInitialQuery) {
        clearInitialQuery();
      }
    }
  }, [initialQuery]);

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
      const apiKey = process.env.DIFY_API_KEY || 'app-DNdgJUyMHZdIMWtKzFhuIz0k';
      const baseUrl = 'https://api.dify.ai/v1';

      const payload: Record<string, any> = {
        inputs: {
          user_goal: userGoal || 'Ahorrar para el futuro'
        },
        query: textToSend.trim(),
        response_mode: 'blocking',
        user: 'vinten_user'
      };

      if (conversationId) {
        payload.conversation_id = conversationId;
      }

      const response = await fetch(`${baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Dify API error (${response.status}): ${errText}`);
      }

      const data = await response.json();

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const modelMsg: Message = {
        role: 'model',
        text: data.answer || 'Mmm, se me mezclaron los cables. ¿Me repetís tu consulta?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error('[Dify API Error]:', error);
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
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      <div className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 flex-1 flex flex-col">

        {/* Intro Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex bg-primary/10 p-4 rounded-full mb-1">
            <Logo className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-text-main">Bienvenido a Vintén</h1>
          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto">
            Tu compañero para entender la plata, ahorrar sin sufrir y cumplir tus metas.
            Acá no juzgamos gastos, los optimizamos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2">
            {featureCards.map((f, i) => (
              <button
                key={i}
                onClick={() => onNavigate(f.id)}
                className="bg-surface p-4 rounded-2xl border border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all text-left cursor-pointer active:scale-95 flex items-center gap-4"
              >
                <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">{f.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-sm">{f.title}</h3>
                  <p className="text-xs text-text-muted">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Unified Chat Section: Asistente Vintén */}
        <section className="bg-surface rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col flex-1 min-h-[500px]">
          {/* Header */}
          <div className="bg-primary p-4 text-surface flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-surface text-primary rounded-xl flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-xl fill-1">smart_toy</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary border-2 border-primary rounded-full"></div>
              </div>
              <div>
                <h2 className="font-extrabold text-lg leading-tight">Asistente Vintén</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-surface/80">En Línea</span>
                  {userGoal && (
                    <>
                      <span className="w-1 h-1 bg-surface/50 rounded-full"></span>
                      <p className="text-[10px] text-surface/90 font-bold truncate max-w-[180px]">Meta: {userGoal}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-background/50">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2.5`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mb-1">
                      <span className="material-symbols-outlined text-primary text-sm">face</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[75%]">
                    <div className={`p-4 rounded-2xl shadow-sm border ${msg.role === 'user'
                      ? 'bg-primary text-surface border-primary rounded-br-none'
                      : 'bg-surface text-text-main border-border rounded-bl-none'
                      }`}>
                      {msg.role === 'model' ? (
                        <div className="prose prose-sm max-w-none text-inherit leading-relaxed font-medium">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-surface">{msg.text}</p>
                      )}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tighter opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
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
                className="flex justify-start items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm animate-spin">refresh</span>
                </div>
                <div className="bg-surface border border-border px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer / Input */}
          <div className="p-4 bg-surface border-t border-border space-y-3">
            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar no-scrollbar">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.label)}
                  disabled={isLoading}
                  className="whitespace-nowrap bg-background border border-border hover:border-primary/30 hover:bg-primary/5 px-3 py-1.5 rounded-xl text-xs font-bold text-text-muted hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Preguntale lo que quieras a Vintén..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-primary text-surface h-11 w-11 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
            <p className="text-center text-[9px] font-bold text-text-muted/60 uppercase tracking-tight">Vintén es un asistente orientativo. Consultá siempre tus decisiones financieras importantes.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
