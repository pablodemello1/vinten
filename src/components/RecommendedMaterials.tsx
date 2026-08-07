import React, { useState } from 'react';

export interface MaterialItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'lecturas' | 'peliculas' | 'podcasts' | 'cursos';
  level: 'Principiante' | 'Medio' | 'Avanzado';
  duration: string;
  comment: string;
  icon: string;
  prompt: string;
}

interface RecommendedMaterialsProps {
  onDiscussResource: (queryPrompt: string) => void;
}

export default function RecommendedMaterials({ onDiscussResource }: RecommendedMaterialsProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'lecturas' | 'peliculas' | 'podcasts' | 'cursos'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'todos' | 'Principiante' | 'Medio' | 'Avanzado'>('todos');

  const categories = [
    { id: 'all', label: 'Todos los materiales', icon: 'apps' },
    { id: 'lecturas', label: 'Lecturas (Libros y Artículos)', icon: 'menu_book' },
    { id: 'peliculas', label: 'Películas y Videos', icon: 'movie' },
    { id: 'podcasts', label: 'Podcast y Canciones', icon: 'headphones' },
    { id: 'cursos', label: 'Otros Cursos', icon: 'workspace_premium' },
  ] as const;

  const materials: MaterialItem[] = [
    {
      id: '1',
      title: 'Quiero Más Pizza',
      subtitle: 'de Steve Burkholder',
      category: 'lecturas',
      level: 'Principiante',
      duration: '~2 horas de lectura',
      comment: 'Ideal para introducir conceptos de dinero, ahorro y presupuesto personal de manera accesible y práctica para jóvenes.',
      icon: 'menu_book',
      prompt: 'Leí el libro "Quiero Más Pizza" de Steve Burkholder. ¿Qué conceptos claves de dinero y ahorro me recomendás profundizar o aplicar en mi día a día?'
    },
    {
      id: '2',
      title: 'En busca de la felicidad',
      subtitle: '(The Pursuit of Happyness)',
      category: 'peliculas',
      level: 'Principiante',
      duration: '117 min',
      comment: 'Ideal para debatir sobre resiliencia, la gestión económica en momentos difíciles y la importancia de la perseverancia.',
      icon: 'movie',
      prompt: 'Vi la película "En busca de la felicidad". Me gustaría reflexionar con vos sobre las lecciones de resiliencia y gestión económica que transmite la película.'
    },
    {
      id: '3',
      title: 'Neurona Financiera',
      subtitle: 'Podcast de Rodrigo Álvarez',
      category: 'podcasts',
      level: 'Principiante',
      duration: '~30 min por episodio',
      comment: 'Ideal para actualizarse y conocer aspectos cotidianos de las finanzas personales en nuestro contexto local.',
      icon: 'headphones',
      prompt: 'Estuve escuchando el podcast "Neurona Financiera". ¿Qué consejos me das para empezar a aplicar finanzas personales siendo estudiante de bachillerato?'
    },
    {
      id: '4',
      title: 'Finanzas Básicas para Jóvenes',
      subtitle: 'Educación Financiera Inicial',
      category: 'cursos',
      level: 'Principiante',
      duration: '45 min',
      comment: 'Curso interactivo introductorio sobre el funcionamiento del sistema financiero, tarjetas y metas de ahorro.',
      icon: 'workspace_premium',
      prompt: 'Quiero hacer un curso de Finanzas Básicas para Jóvenes. ¿Podés resumirme qué temas esenciales debería revisar antes de empezar?'
    },
    {
      id: '5',
      title: 'Presupuestos y Planificación',
      subtitle: 'Taller Práctico',
      category: 'cursos',
      level: 'Medio',
      duration: '1.5 horas',
      comment: 'Aprende a armar planillas de presupuesto mensual y a categorizar tus ingresos y gastos fijos vs. variables.',
      icon: 'laptop_chromebook',
      prompt: 'Tengo dudas sobre cómo armar y mantener un presupuesto personal equilibrado. ¿Podrías guiarme paso a paso?'
    }
  ];

  const filteredMaterials = materials.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesLevel = selectedLevel === 'todos' || item.level === selectedLevel;
    return matchesCategory && matchesLevel;
  });

  const getLevelBadgeStyle = (level: MaterialItem['level']) => {
    switch (level) {
      case 'Principiante':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Medio':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Avanzado':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="inline-flex bg-primary/10 p-3 rounded-2xl mb-1">
            <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text-main">Materiales Recomendados</h1>
          <p className="text-text-muted font-medium max-w-2xl mx-auto text-sm md:text-base">
            Recursos seleccionados de libros, películas, podcasts y cursos organizados por nivel y duración para tus tiempos libres.
          </p>
        </header>

        {/* Categories Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar border-b border-border">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-surface shadow-md'
                  : 'bg-surface text-text-muted hover:bg-background hover:text-primary border border-border'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Level Filters Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-surface p-4 rounded-2xl border border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Filtrar por nivel:</span>
            {(['todos', 'Principiante', 'Medio', 'Avanzado'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {lvl === 'todos' ? 'Todos' : lvl}
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-text-muted">
            Mostrando {filteredMaterials.length} recurso{filteredMaterials.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMaterials.map(item => (
            <div
              key={item.id}
              className="bg-surface rounded-3xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badges & Category Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-text-muted bg-background px-2.5 py-1 rounded-lg border border-border">
                    <span className="material-symbols-outlined text-sm text-primary">{item.icon}</span>
                    {item.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${getLevelBadgeStyle(item.level)}`}>
                      {item.level}
                    </span>
                    <span className="text-[11px] font-bold text-text-muted bg-background px-2.5 py-1 rounded-lg border border-border flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {item.duration}
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xl font-black text-text-main leading-snug">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-xs font-bold text-primary mt-0.5">{item.subtitle}</p>
                  )}
                </div>

                {/* Commentary */}
                <div className="bg-background/80 p-3.5 rounded-2xl border border-border/60">
                  <p className="text-xs text-text-muted font-medium leading-relaxed">
                    💡 <strong className="text-text-main">Recomendación:</strong> {item.comment}
                  </p>
                </div>
              </div>

              {/* Consult Button with Asistente Vintén */}
              <button
                onClick={() => onDiscussResource(item.prompt)}
                className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-surface font-extrabold text-xs md:text-sm py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-primary/20 hover:border-transparent group"
              >
                <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">smart_toy</span>
                Consultar o comentar con Asistente Vintén
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12 bg-surface rounded-3xl border border-border">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">search_off</span>
            <p className="font-bold text-text-main">No hay materiales con los filtros seleccionados.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSelectedLevel('todos'); }}
              className="mt-3 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
