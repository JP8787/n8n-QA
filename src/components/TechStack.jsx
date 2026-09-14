import React from 'react';

export default function TechStack() {
  const stack = [
    {
      category: 'Orquestación & Backend',
      name: 'n8n Workflow Engine',
      badge: 'Serverless / Event-Driven',
      desc: 'Flujo serverless basado en eventos. Orquesta webhooks, bifurcaciones de lógica, manejo de errores y reintentos automáticos sin servidores dedicados.',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="12" r="3.5" fill="currentColor" />
          <circle cx="18" cy="12" r="3.5" fill="currentColor" />
          <path d="M9.5 12h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      category: 'Inteligencia Artificial',
      name: 'Google Gemini API + OpenRouter',
      badge: 'Dual-Engine Redundancy',
      desc: 'Google Gemini API (modelo principal 1.5/2.0) con redundancia automática en OpenRouter para garantizar 100% de disponibilidad y cero interrupciones por cuota.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      category: 'Integración Cloud',
      name: 'Google Workspace API v4',
      badge: 'Sheets batchUpdate & Drive',
      desc: 'Google Sheets API v4 con llamadas batchUpdate optimizadas para crear pestañas dinámicas, auto-dimensionar anchos en píxeles y aplicar paletas pastel temáticas.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
          <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
        </svg>
      )
    },
    {
      category: 'Lógica de Datos',
      name: 'JavaScript & JSON Schemas',
      badge: 'Node.js Sanitizer',
      desc: 'Nodos de código en JavaScript (Node.js) que procesan la respuesta del LLM, normalizan la salida en esquemas JSON estrictos y aseguran las 11 columnas oficiales.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="16 18 22 12 16 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="8 6 2 12 8 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="tech-stack-section" id="stack">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Arquitectura Tecnológica</span>
          <h2 className="section-title">Stack Tecnológico Utilizado</h2>
          <p className="section-subtitle">
            Componentes seleccionados por su robustez, escalabilidad y facilidad de integración en entornos corporativos.
          </p>
        </div>

        <div className="stack-grid">
          {stack.map((item, index) => (
            <div key={index} className="stack-card">
              <div className="stack-top">
                <div className="stack-icon-wrap">
                  {item.icon}
                </div>
                <span className="stack-badge">{item.badge}</span>
              </div>
              <span className="stack-category">{item.category}</span>
              <h3 className="stack-name">{item.name}</h3>
              <p className="stack-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
