import React, { useState } from 'react';
import Logo from './Logo';

interface LearningModuleProps {
  onNavigate: (view: 'dashboard' | 'learning') => void;
}

export default function LearningModule({ onNavigate }: LearningModuleProps) {
  const [sliderValue, setSliderValue] = useState(18);

  // Calculate values based on slider (0 to 24 months)
  // Max months = 24
  // Pesos value decreases over time due to inflation. Let's say it loses 40% over 24 months.
  // UI value stays relatively stable or grows slightly.
  const pesosValue = Math.round(1000 - (1000 * 0.4 * (sliderValue / 24)));
  const uiValue = Math.round(1000 - (1000 * 0.02 * (sliderValue / 24))); // UI loses very little or nothing
  const pesosPercentage = (pesosValue / 1000) * 100;
  const uiPercentage = (uiValue / 1000) * 100;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar bg-background-dark">
      {/* Top Navigation */}
      <header className="border-b border-primary/10 bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="bg-primary p-2 rounded-lg">
              <Logo className="w-6 h-6 text-background-dark" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Vintén</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors cursor-pointer">Dashboard</button>
            <button className="text-sm font-semibold text-primary cursor-pointer">Aprender</button>
            <button className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors cursor-pointer">Metas</button>
            <button className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors cursor-pointer">Comunidad</button>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-primary/10 transition-colors text-slate-300 cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Nivel 2</p>
                <p className="text-sm font-semibold text-white">Santi_GZ</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm-trk7ohovmTKJ-jjg0gSr_pY411kwpZz5LQcT-SpxpvQqO0jIrzlVE8mw1FioEcFobkjZ5DUMwkjtyiZlZXS448BMl1fb9ANCAIWGQ8aIrrRogh6GExhz3LBcSds0VMGNpQX6Bzc7-kUAcA58XIEaIkccbnvHScH4bjJhE1AEgz-skKUpPEcsBzC27oqS8O0E7ozrAt1YT9vWG3AFJdkAAkGom0wK7K_YSQbz8k7JMD79dpIGsq_10aKx2TZZPpG9pWn75stB9Q" referrerPolicy="no-referrer"/>
              </div>
            </div>
          </div>
        </div>
        {/* Progress Bar Scaffolding */}
        <div className="w-full h-1.5 bg-slate-800">
          <div className="h-full bg-primary shadow-[0_0_10px_#13ec5b]" style={{ width: '65%' }}></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-primary/60 text-sm font-medium">
                <span>Aprender</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span>Módulo: El Canuto</span>
              </nav>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                ¿Tu plata pierde fuerza? <br/><span className="text-primary italic">Mirá esto...</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl">
                Descubrí por qué guardar tus ahorros "bajo el colchón" (el famoso canuto) es una trampa. La inflación es como un monstruo invisible que se come tus alfajores.
              </p>
            </div>

            {/* Simulation Tool */}
            <div className="bg-slate-900/50 rounded-xl p-8 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="material-symbols-outlined text-primary/20 text-6xl rotate-12 select-none">trending_down</span>
              </div>
              <div className="relative z-10 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Simulador de "El Canuto"</h3>
                    <p className="text-sm text-slate-500">Arrastrá el tiempo para ver qué pasa con tus $1.000 pesos uruguayos.</p>
                  </div>
                  <div className="bg-primary/10 rounded-full px-6 py-3 border border-primary/20 flex items-center gap-3">
                    <span className="text-sm font-bold uppercase tracking-wider text-primary">Hoy tenés:</span>
                    <span className="text-2xl font-black text-primary">$1.000</span>
                  </div>
                </div>

                {/* Visual Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                  {/* Savings in Pesos */}
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-transparent hover:border-red-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                      <span className="text-xs font-bold text-red-500 uppercase">Pesos (Bajo el colchón)</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${pesosPercentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-white">Poder de compra</span>
                        <span className="text-red-500">${pesosValue} valen hoy</span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500 italic">"En {Math.max(1, Math.round(sliderValue/12))} años comprás {Math.round((1000-pesosValue)/100)} alfajores menos."</p>
                  </div>

                  {/* Savings in UI */}
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 hover:border-primary transition-all group shadow-lg shadow-primary/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <span className="material-symbols-outlined">shield_with_heart</span>
                      </div>
                      <span className="text-xs font-bold text-primary uppercase">Unidades Indexadas (UI)</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${uiPercentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-white">Poder de compra</span>
                        <span className="text-primary">${uiValue} valen hoy</span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500 italic">"Tu plata se defiende contra la inflación."</p>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-6">
                  <div className="flex justify-between font-bold text-sm px-2 text-white">
                    <span className={sliderValue === 0 ? "text-primary" : ""}>Hoy</span>
                    <span className={sliderValue === 6 ? "text-primary" : ""}>6 Meses</span>
                    <span className={sliderValue === 12 ? "text-primary" : ""}>1 Año</span>
                    <span className={sliderValue === 24 ? "text-primary" : ""}>2 Años</span>
                    <span className="text-slate-400 italic">Viaje a Bariloche</span>
                  </div>
                  <input 
                    className="w-full h-3 bg-slate-800 rounded-full appearance-none custom-slider outline-none" 
                    max="24" 
                    min="0" 
                    step="6"
                    type="range" 
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Bento Cards: Knowledge Snippets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 p-6 rounded-xl border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary">help</span>
                  <h4 className="font-bold text-white">¿Qué es la UI?</h4>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  La Unidad Indexada es como una moneda "mágica" uruguaya que se ajusta según suben los precios. Si todo sube 10%, la UI sube 10%. ¡Tus ahorros no pierden!
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary cursor-help">
                  VER CÓMO SE CALCULA <span className="material-symbols-outlined text-xs">info</span>
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary">currency_exchange</span>
                  <h4 className="font-bold text-white">¿Dólar o UI?</h4>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  El dólar a veces sube y a veces baja, pero la inflación en Uruguay siempre está. Para metas locales (como Bariloche o una PC), la UI suele ser más segura.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Learn & Earn Card */}
            <div className="bg-primary text-background-dark rounded-xl p-6 sticky top-28 shadow-xl shadow-primary/20 overflow-hidden relative">
              <div className="absolute -bottom-6 -right-6 text-background-dark/10">
                <span className="material-symbols-outlined text-[120px]">workspace_premium</span>
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black leading-tight">Learn <br/>&amp; Earn</h3>
                  <div className="bg-background-dark/20 px-3 py-1 rounded-full text-xs font-bold uppercase">Módulo 2</div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Recompensas al finalizar:</p>
                  <div className="flex items-center gap-4 bg-background-dark/10 p-3 rounded-lg border border-background-dark/5">
                    <div className="h-10 w-10 bg-background-dark rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">toll</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">+50 Vinténs</p>
                      <p className="text-xs opacity-70">Para tu próxima meta</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-background-dark/10 p-3 rounded-lg border border-background-dark/5">
                    <div className="h-10 w-10 bg-background-dark rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">verified</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Badge: Inflation Buster</p>
                      <p className="text-xs opacity-70">Desbloqueado en tu perfil</p>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-background-dark text-primary py-4 rounded-xl font-black text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer">
                  <span>TERMINAR MÓDULO</span>
                  <span className="material-symbols-outlined">rocket_launch</span>
                </button>
              </div>
            </div>

            {/* Glossary */}
            <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-xl space-y-4">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Glosario Rápido</h5>
              <div className="space-y-3">
                <details className="group cursor-pointer">
                  <summary className="list-none flex justify-between items-center text-sm font-bold text-white">
                    <span>IPC</span>
                    <span className="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="text-xs text-slate-500 mt-2 py-2 border-t border-slate-700">Índice de Precios del Consumo. Es la lista de lo que compran los uruguayos para medir cuánto suben los precios.</p>
                </details>
                <details className="group cursor-pointer">
                  <summary className="list-none flex justify-between items-center text-sm font-bold text-white">
                    <span>Poder de Compra</span>
                    <span className="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="text-xs text-slate-500 mt-2 py-2 border-t border-slate-700">Es cuántas cosas podés comprar con el mismo billete. Si hay inflación, tu poder de compra baja.</p>
                </details>
              </div>
            </div>

            {/* Community Activity */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-primary/10">
              <h4 className="text-sm font-bold mb-4 text-white">Actividad en vivo</h4>
              <div className="flex -space-x-3 mb-4">
                <img className="h-8 w-8 rounded-full border-2 border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCk_5SFKfk5v4bpuJPeCAm-0XDgg4wGUzZ-b73f0XZlU9pBeugc6hgFRf9M645Upx94hfQIvZfk88BF0IN--I1mQHbtHXPIwtefjVYrFAzYbXvXnTWGEHXwTLhxlH9HzPISDCmDTazGBuwAg7Zxsw19nWfJrXO_ZHy2jzet1lEbxmwdBTZrJud5sD-n2HmFpdwO77Mu9rjvKtLxmi1p57-GgsCJU03fm2S-IwuibGexEX-x1MqIy_b8eArk00Qap37t_qCVAVg4W4" referrerPolicy="no-referrer"/>
                <img className="h-8 w-8 rounded-full border-2 border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_IHR7lPuVpGiAcMFWTHBTpSfuSb2oOcJZJjNNUNgC_6_qK55X2Rs01eGHG7GuFD66XtN6H31sVG9eMKaIFarilLTKMYABZuYGHih8q0PLwAkkfZe7SdgOrKDMV18s2pHIyN4S1yiQ6YmFQYT2PtztOoMWXGCa9wJF2pQGk-FEFPq8-pgEEhvsaCs48Kizwvfl7yQ66lVAvHqMtn-XbiU9bgjtWzhGobKrKUBBu0ge7k81RdrrWbE6v-eTo8zQ6wNipOhYjlB6xY" referrerPolicy="no-referrer"/>
                <img className="h-8 w-8 rounded-full border-2 border-slate-900 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnPdk59_E3dktblilHTlZ_omj5QxhiW88eRiPTLjqktlLakF_0SCPiuNW9xHUf-WF2ozhPPv_U6LPcP9GXi9_1NqVcCgTeAxBQrV5IwWmYxrjzxYlnIT5jwbKTbT-TGYFFVlTuiajE_8xCKCI2KUINW1977UxXa1_3WEV_m1viZ_-nzJ9CsupktFv9QwxDqHbcRkPrjIrrr1BgaHR4vmojuaw5lSRHZ4dmBIN4aNe_h2v8TdXT8DdJaxsIynIZzGtukY7LL55PSEI" referrerPolicy="no-referrer"/>
                <div className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">+12</div>
              </div>
              <p className="text-xs text-slate-500">15 amigos tuyos ya completaron "El Canuto" esta semana.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto py-12 border-t border-primary/10 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 grayscale opacity-50">
              <Logo className="w-5 h-5" />
              <span className="font-black text-white">Vintén © 2024</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a className="hover:text-primary" href="#">Términos</a>
              <a className="hover:text-primary" href="#">Seguridad</a>
              <a className="hover:text-primary" href="#">Padres y Tutores</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
