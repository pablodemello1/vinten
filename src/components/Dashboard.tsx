import React from 'react';

export default function Dashboard({ userGoal }: { userGoal: string }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-text-main mb-2">Mi Bóveda</h2>
        <p className="text-text-muted font-medium">Meta actual: <span className="text-primary font-bold">{userGoal || 'Ahorrar'}</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Saldo Actual */}
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-primary/5">
            <span className="material-symbols-outlined text-9xl">account_balance</span>
          </div>
          <p className="text-text-muted font-bold uppercase tracking-widest text-sm mb-2 relative z-10">Saldo Actual</p>
          <h3 className="text-5xl md:text-6xl font-black text-primary relative z-10">$14.280</h3>
        </div>

        {/* Indicador de Salud Financiera */}
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm flex items-center gap-8">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#E5E0D8" strokeWidth="12" />
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#D4AF37" strokeWidth="12" strokeDasharray="351.8" strokeDashoffset="87.9" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-secondary">75%</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-2">Salud Financiera</h4>
            <p className="text-sm text-text-muted">Venís excelente con tu meta. ¡Seguí así y el oro es tuyo!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximo Desafío */}
        <div className="lg:col-span-1 bg-secondary/10 p-6 rounded-3xl border border-secondary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-secondary/20">
            <span className="material-symbols-outlined text-6xl">emoji_events</span>
          </div>
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Próximo Desafío</p>
          <h4 className="font-black text-lg text-text-main mb-4 relative z-10">Nivel 1: El misterio del interés compuesto</h4>
          <button className="w-full bg-secondary text-surface font-bold py-3 rounded-xl hover:bg-secondary/90 transition-colors relative z-10 cursor-pointer">
            Empezar
          </button>
        </div>

        {/* Toque Local: Gráfico */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-3xl border border-border shadow-sm">
          <h4 className="font-bold text-lg mb-6">Gastos en Fila de Supermercado vs. Ahorro Real</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Snacks en la fila</span>
                <span className="text-red-500">$1.200</span>
              </div>
              <div className="h-4 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Ahorro para {userGoal || 'la meta'}</span>
                <span className="text-primary">$800</span>
              </div>
              <div className="h-4 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-text-muted italic">"Esos chicles suman, che. Ojo ahí."</p>
        </div>
      </div>
    </div>
  );
}
