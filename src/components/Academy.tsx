import React from 'react';
import { logUserEvent } from '../lib/activityLogger';

export default function Academy() {
  const topics = [
    { id: 1, title: 'El valor del peso', status: 'completed', icon: 'payments' },
    { id: 2, title: 'Tarjetas de débito vs crédito', status: 'active', icon: 'credit_card' },
    { id: 3, title: 'Inflación para principiantes', status: 'locked', icon: 'trending_up' },
    { id: 4, title: 'El misterio del interés compuesto', status: 'locked', icon: 'monitoring' },
  ];

  const handleTopicClick = (topic: typeof topics[0]) => {
    logUserEvent('interaccion_modulo_ruta', {
      tema_id: topic.id,
      tema_titulo: topic.title,
      estado: topic.status,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-black text-text-main mb-2">Ruta de Aprendizaje Vintén</h2>
        <p className="text-text-muted font-medium">Tu camino de educación financiera.</p>
      </header>

      <div className="max-w-md mx-auto relative py-10">
        {/* Path Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-border -translate-x-1/2 rounded-full z-0"></div>

        <div className="space-y-16 relative z-10">
          {topics.map((topic, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={topic.id} className={`flex items-center justify-center relative ${isEven ? 'left-[-40px]' : 'left-[40px]'}`}>
                <div
                  onClick={() => handleTopicClick(topic)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                    topic.status === 'completed' ? 'bg-secondary border-secondary text-surface' :
                    topic.status === 'active' ? 'bg-primary border-primary text-surface ring-4 ring-primary/30' :
                    'bg-surface border-border text-border'
                  }`}>
                    <span className="material-symbols-outlined text-3xl">{topic.icon}</span>
                  </div>
                  <div className="mt-4 bg-surface px-4 py-2 rounded-xl border border-border shadow-sm text-center max-w-[160px]">
                    <p className={`text-sm font-bold ${topic.status === 'locked' ? 'text-text-muted' : 'text-text-main'}`}>
                      {topic.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
