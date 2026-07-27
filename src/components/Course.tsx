import React, { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'exercise';
  duration: string;
  completed: boolean;
  content?: {
    text?: string;
    points?: string[];
    videoPlaceholder?: string;
    exerciseTitle?: string;
    exerciseDesc?: string;
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const courseData: Module[] = [
  {
    id: 'm1',
    title: 'Módulo 1: Introducción a la Educación Financiera 💡',
    description: 'Conceptos fundamentales de Inclusión y Educación Financiera.',
    lessons: [
      {
        id: 'l1',
        title: 'Inclusión y Educación Financiera',
        type: 'video',
        duration: '5 min',
        completed: true,
        content: { videoPlaceholder: 'Explicación interactiva sobre qué es la Inclusión y la Educación Financiera y su impacto en tus decisiones.' }
      },
      {
        id: 'l2',
        title: '¿Por qué necesitamos educación financiera?',
        type: 'text',
        duration: '4 min',
        completed: false,
        content: {
          text: 'La educación financiera entrega herramientas y poder para lograr administrar el dinero hábilmente e informarse sobre las oportunidades.',
          points: [
            'Hacer un mejor uso de los servicios financieros.',
            'Aprovechar al máximo los recursos, ahorrar de manera regular y gastar con responsabilidad.',
            'Aumentar nuestros ingresos a través de decisiones informadas.'
          ]
        }
      },
      {
        id: 'l3',
        title: 'Programas de Educación Financiera',
        type: 'exercise',
        duration: '5 min',
        completed: false,
        content: {
          exerciseTitle: 'Reconociendo Programas',
          exerciseDesc: 'Identificá las características del Programa Nacional de Educación Financiera y otras experiencias exitosas.'
        }
      },
    ]
  },
  {
    id: 'm2',
    title: 'Módulo 2: Conceptos Básicos del Sistema Financiero 🏦',
    description: 'Actores e instituciones del sistema financiero en Uruguay.',
    lessons: [
      {
        id: 'l4',
        title: 'Actores del Sistema Financiero Uruguayo',
        type: 'video',
        duration: '6 min',
        completed: false,
        content: { videoPlaceholder: 'Conocé al sector público, instituciones gubernamentales y el rol del BCU y BROU.' }
      },
      {
        id: 'l5',
        title: 'Bancos, Cooperativas y Financieras',
        type: 'text',
        duration: '5 min',
        completed: false,
        content: {
          text: 'Comprender las diferencias entre las distintas entidades que operan en el mercado local.',
          points: [
            'Bancos: Entidades privadas o públicas que ofrecen la mayor gama de servicios.',
            'Cooperativas de ahorro y crédito: Su principal fin es ayudar a sus socios.',
            'Financieras: Ofrecen créditos principalmente, muchas veces con menos requisitos y otras tasas.'
          ]
        }
      },
      {
        id: 'l6',
        title: 'Instituciones de Microfinanzas',
        type: 'exercise',
        duration: '10 min',
        completed: false,
        content: {
          exerciseTitle: 'El Taller de Microfinanzas',
          exerciseDesc: 'Emparejá cada actor del sistema financiero con el tipo de servicio que mejor representa.'
        }
      },
    ]
  },
  {
    id: 'm3',
    title: 'Módulo 3: Servicios Financieros 💳',
    description: 'Efectivo, cheques, tarjetas y transferencias.',
    lessons: [
      {
        id: 'l7',
        title: 'Efectivo, Cheques y Transferencias',
        type: 'video',
        duration: '7 min',
        completed: false,
        content: { videoPlaceholder: 'Cuáles son y cómo funcionan los principales medios de pago en la actualidad.' }
      },
      {
        id: 'l8',
        title: 'Tarjeta de Débito vs Tarjeta de Crédito',
        type: 'text',
        duration: '6 min',
        completed: false,
        content: {
          text: 'Las diferencias clave al momento de pagar con plásticos.',
          points: [
            'Débito: Utilizás el dinero que ya tenés en tu cuenta bancaria de forma inmediata.',
            'Crédito: Dinero prestado por el banco que deberás devolver en un plazo determinado.',
            'Costos: El crédito puede implicar intereses o costos extras si no se paga todo a fin de mes.'
          ]
        }
      },
      {
        id: 'l9',
        title: 'Elegí el Medio de Pago',
        type: 'exercise',
        duration: '12 min',
        completed: false,
        content: {
          exerciseTitle: 'Tu Compra Inteligente',
          exerciseDesc: 'Decidí si en cada escenario es mejor usar efectivo, débito, crédito o transferencia.'
        }
      },
    ]
  },
  {
    id: 'm4',
    title: 'Módulo 4: Créditos y Administración de la Deuda ⚖️',
    description: 'Decisiones informadas antes de endeudarse.',
    lessons: [
      {
        id: 'l10',
        title: '¿Para qué tomamos crédito?',
        type: 'video',
        duration: '5 min',
        completed: false,
        content: { videoPlaceholder: 'Evaluando cuándo vale la pena financiarse y cuáles son los componentes del crédito.' }
      },
      {
        id: 'l11',
        title: 'Deudas buenas y Deudas malas',
        type: 'text',
        duration: '8 min',
        completed: false,
        content: {
          text: 'Aprender a catalogar el tipo de endeudamiento es clave para las finanzas sanas.',
          points: [
            'Deuda buena: La que te ayuda a generar ingresos o comprar activos duraderos (ej: educación, maquinaria).',
            'Deuda mala: La usada para gastos corrientes o bienes que pierden valor rápido.',
            'Costos del crédito: Cuidado con las cuotas excesivas o las tasas de interés abusivas.'
          ]
        }
      },
      {
        id: 'l12',
        title: 'El Límite del Endeudamiento',
        type: 'exercise',
        duration: '10 min',
        completed: false,
        content: {
          exerciseTitle: 'Semáforo de Deudas',
          exerciseDesc: 'Calculá el nivel de endeudamiento de diferentes personas e identificá cuándo se vuelve peligroso.'
        }
      },
    ]
  },
  {
    id: 'm5',
    title: 'Módulo 5: Planificación Financiera y Ahorro 🎯',
    description: 'Armar presupuestos y alcanzar metas.',
    lessons: [
      {
        id: 'l13',
        title: 'Elaborando tu Presupuesto',
        type: 'video',
        duration: '6 min',
        completed: false,
        content: { videoPlaceholder: 'Beneficios de tener un presupuesto y pasos prácticos para hacer el tuyo.' }
      },
      {
        id: 'l14',
        title: 'El hábito del Ahorro',
        type: 'text',
        duration: '7 min',
        completed: false,
        content: {
          text: 'No se trata de guardar lo que sobra, sino de separar antes de gastar.',
          points: [
            'Metas: Fijate objetivos claros (corto, mediano y largo plazo).',
            'Inversión: Ahorrar para invertir genera ingresos pasivos en el futuro.',
            'Modalidades: Las distintas formas y herramientas seguras para guardar tu dinero.'
          ]
        }
      },
      {
        id: 'l15',
        title: 'Planificador Financiero',
        type: 'exercise',
        duration: '15 min',
        completed: false,
        content: {
          exerciseTitle: 'Tu Desafío de Ahorro',
          exerciseDesc: 'Armá un presupuesto familiar con un ingreso fijo, destinando dinero a diferentes rubros sin excederte.'
        }
      },
    ]
  }
];

export default function Course() {
  const [activeModuleId, setActiveModuleId] = useState<string | null>('m1');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(courseData[0].lessons[0]);

  return (
    <div className="flex flex-col h-full bg-background md:flex-row overflow-hidden">
      {/* Sidebar de Módulos */}
      <div className="w-full md:w-80 bg-surface border-r border-border flex flex-col overflow-y-auto custom-scrollbar flex-shrink-0">
        <div className="p-6 border-b border-border bg-primary/5">
          <h2 className="text-2xl font-black text-primary">Academia Vintén</h2>
          <p className="text-sm text-text-muted">Programa de Educación Financiera</p>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {courseData.map(module => (
            <div key={module.id} className="space-y-2">
              <button
                onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all text-left cursor-pointer border ${activeModuleId === module.id ? 'border-primary/20 bg-primary/5' : 'border-transparent hover:bg-background'}`}
              >
                <div className="flex-1 pr-2">
                  <p className="font-black text-text-main text-sm leading-tight">{module.title}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">{module.lessons.length} lecciones</p>
                </div>
                <span className={`material-symbols-outlined transition-transform duration-300 ${activeModuleId === module.id ? 'rotate-180 text-primary' : 'text-text-muted'}`}>expand_more</span>
              </button>

              {activeModuleId === module.id && (
                <div className="pl-2 space-y-1 animate-in fade-in slide-in-from-top-2">
                  {module.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl text-sm transition-all text-left cursor-pointer ${activeLesson?.id === lesson.id
                          ? 'bg-primary text-surface shadow-lg shadow-primary/20 scale-[1.02]'
                          : 'text-text-muted hover:bg-background'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeLesson?.id === lesson.id ? 'bg-surface/20' : 'bg-background'}`}>
                        <span className="material-symbols-outlined text-lg">
                          {lesson.type === 'video' ? 'play_arrow' : lesson.type === 'text' ? 'menu_book' : 'sports_esports'}
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold truncate">{lesson.title}</p>
                        <p className="text-[10px] opacity-80">{lesson.duration}</p>
                      </div>
                      {lesson.completed && <span className="material-symbols-outlined text-secondary text-base">verified</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-background p-6 md:p-10">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full">
            <header className="mb-8">
              <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest leading-none">
                  {courseData.find(m => m.lessons.some(l => l.id === activeLesson.id))?.title.split(':')[0]}
                </span>
                <span className="w-1 h-1 bg-border rounded-full"></span>
                <span className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    {activeLesson.type === 'video' ? 'video_library' : activeLesson.type === 'text' ? 'description' : 'model_training'}
                  </span>
                  {activeLesson.type === 'video' ? 'Video Masterclass' : activeLesson.type === 'text' ? 'Lectura Interactiva' : 'Práctica Aplicada'}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-text-main leading-tight tracking-tight">{activeLesson.title}</h1>
            </header>

            <div className="bg-surface rounded-[40px] border border-border shadow-xl overflow-hidden flex flex-col min-h-[500px]">
              {activeLesson.type === 'video' && (
                <div className="p-8 flex flex-col h-full items-center justify-center">
                  <div className="w-full aspect-video bg-background-dark rounded-[32px] flex flex-col items-center justify-center relative group cursor-pointer border border-border shadow-inner">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors rounded-[32px]"></div>
                    <div className="w-24 h-24 bg-primary text-surface rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform z-10">
                      <span className="material-symbols-outlined text-5xl fill-1">play_arrow</span>
                    </div>
                    <p className="mt-8 text-text-muted text-sm font-medium z-10 px-6 text-center">
                      {activeLesson.content?.videoPlaceholder || 'Cargando video pedagógico...'}
                    </p>
                  </div>
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="bg-background/50 p-6 rounded-3xl border border-border">
                      <h4 className="font-black text-text-main mb-2">Puntos clave</h4>
                      <ul className="text-sm text-text-muted space-y-2">
                        <li className="flex gap-2"><span className="text-secondary font-bold">●</span> Resumen interactivo del video.</li>
                        <li className="flex gap-2"><span className="text-secondary font-bold">●</span> Conceptos adaptados a Uruguay.</li>
                      </ul>
                    </div>
                    <div className="bg-background/50 p-6 rounded-3xl border border-border">
                      <h4 className="font-black text-text-main mb-2">Descargables</h4>
                      <button className="text-sm text-primary font-bold flex items-center gap-2 hover:underline">
                        <span className="material-symbols-outlined text-base">download</span> Guía en PDF (Próximamente)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeLesson.type === 'text' && (
                <div className="p-10 flex-1">
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10">
                      <h3 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined">lightbulb</span>
                        Concepto Central
                      </h3>
                      <p className="text-lg text-text-main leading-relaxed font-medium">
                        {activeLesson.content?.text}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xl font-black text-text-main">¿Qué tenés que saber?</h4>
                      <div className="grid gap-4">
                        {activeLesson.content?.points?.map((point, i) => (
                          <div key={i} className="flex items-center gap-5 p-5 bg-background border border-border rounded-2xl hover:border-primary/30 transition-colors group">
                            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-primary font-black shadow-sm group-hover:bg-primary group-hover:text-surface transition-colors">
                              {i + 1}
                            </div>
                            <p className="text-text-main font-bold">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary text-surface rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">tips_and_updates</span>
                      </div>
                      <p className="text-sm text-text-main font-bold italic">
                        "Dato Vintén: La inflación en Uruguay se mide con el IPC, que es como el termómetro de los precios del súper."
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeLesson.type === 'exercise' && (
                <div className="p-10 flex flex-col items-center justify-center text-center h-full flex-1">
                  <div className="relative mb-8">
                    <div className="w-40 h-40 bg-secondary/10 rounded-full flex items-center justify-center animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-secondary text-surface rounded-[40px] flex items-center justify-center shadow-2xl rotate-12 group hover:rotate-0 transition-transform duration-500">
                        <span className="material-symbols-outlined text-6xl">videogame_asset</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-3 text-text-main">{activeLesson.content?.exerciseTitle || 'Actividad Práctica'}</h3>
                  <p className="text-lg text-text-muted mb-10 max-w-lg font-medium leading-relaxed">
                    {activeLesson.content?.exerciseDesc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                    <button className="bg-primary text-surface px-8 py-5 rounded-[24px] font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 cursor-pointer flex items-center justify-center gap-3 group">
                      Jugar Ahora
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">rocket_launch</span>
                    </button>
                    <button className="bg-surface border-2 border-border text-text-main px-8 py-5 rounded-[24px] font-black hover:border-primary/30 transition-all cursor-pointer">
                      Ver Ranking
                    </button>
                  </div>
                </div>
              )}

              <div className="p-8 border-t border-border bg-background/50 flex justify-between items-center mt-auto">
                <button className="text-text-muted font-black hover:text-primary transition-colors flex items-center gap-2 text-sm cursor-pointer px-6 py-2 rounded-full hover:bg-primary/5">
                  <span className="material-symbols-outlined">west</span> Anterior
                </button>
                <button className="bg-secondary text-surface px-8 py-4 rounded-2xl font-black hover:bg-secondary/90 transition-all flex items-center gap-3 text-sm cursor-pointer shadow-lg shadow-secondary/30 scale-105 hover:scale-110 active:scale-95">
                  Lección Completada <span className="material-symbols-outlined font-black">done_all</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-6">
            <div className="w-32 h-32 bg-surface rounded-[45px] border-4 border-dashed border-border flex items-center justify-center opacity-30">
              <span className="material-symbols-outlined text-7xl">auto_stories</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-text-main">Tu futuro financiero empieza acá.</p>
              <p className="text-text-muted font-medium mt-1">Seleccioná una lección del menú izquierdo.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
