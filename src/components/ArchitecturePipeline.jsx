import React, { useState } from 'react';

export default function ArchitecturePipeline() {
  const [activeStep, setActiveStep] = useState(5);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    {
      id: 1,
      title: '1. Ingesta de Requerimientos',
      node: 'Formulario / Documento',
      desc: 'Recepción de criterios de aceptación, historias de usuario o especificaciones funcionales en texto plano/Markdown.',
      badge: 'Trigger HTTP',
      details: 'Webhook n8n captura el payload entrante con metadata del módulo y criterios.'
    },
    {
      id: 2,
      title: '2. Motor IA Multimodelo',
      node: 'Gemini 1.5/2.0 + OpenRouter',
      desc: 'Inferencia de casos positivos, negativos y de borde bajo metodología BDD con conmutación por error (fallback) automática.',
      badge: 'AI Core',
      details: 'Generación controlada mediante System Instructions y Schemas JSON estrictos.'
    },
    {
      id: 3,
      title: '3. Parser Universal BDD',
      node: 'Extracción & Sanitización JSON',
      desc: 'Normalización de datos, numeración estricta de pasos de entrada y validación del esquema de 11 columnas.',
      badge: 'Data Logic',
      details: 'JavaScript Node transforma BDD (Dado/Cuando/Entonces) en la estructura corporativa.'
    },
    {
      id: 4,
      title: '4. Sincronización Google Sheets',
      node: 'Create Sheet + Sync 11 Cols',
      desc: 'Crea una pestaña nueva con timestamp del módulo e inserta las filas normalizadas en el estándar oficial.',
      badge: 'Google Sheets API',
      details: 'Llamada v4 spreadsheets.batchUpdate creando la pestaña con nombre temático.'
    },
    {
      id: 5,
      title: '5. Aplicar Formato Corporativo',
      node: 'HTTP Request batchUpdate API',
      desc: 'Encabezado temático pastel, bordes automáticos, anchos por columna optimizados y zebra striping dinámico.',
      badge: 'Styling Engine',
      details: 'Payload con updateDimensionProperties, repeatCell, textFormat y bordes sólidos.'
    }
  ];

  const handleSimulate = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);

    const delays = [800, 1600, 2400, 3200, 4000];
    delays.forEach((delay, idx) => {
      setTimeout(() => {
        setActiveStep(idx + 1);
        if (idx === delays.length - 1) {
          setIsRunning(false);
        }
      }, delay);
    });
  };

  return (
    <section className="pipeline-section" id="arquitectura">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Pipeline Técnico</span>
          <h2 className="section-title">Arquitectura del Flujo en n8n</h2>
          <p className="section-subtitle">
            Orquestación serverless de alta resiliencia que conecta modelos de lenguaje con la API oficial de Google Sheets.
          </p>
        </div>

        <div className="pipeline-card">
          <div className="pipeline-top-bar">
            <div>
              <h3 className="pipeline-heading">Pipeline de Procesamiento BDD a Google Sheets</h3>
              <p className="pipeline-subheading">Haz clic en "Simular Pipeline" para ver el recorrido de los datos en tiempo real.</p>
            </div>
            <button 
              type="button" 
              className="pill-button pill-button-primary"
              onClick={handleSimulate}
              disabled={isRunning}
            >
              {isRunning ? 'Ejecutando Flujo...' : '▶ Simular Pipeline'}
            </button>
          </div>

          {/* Diagrama Visual */}
          <div className="pipeline-diagram">
            {steps.map((step, idx) => {
              const isCurrent = activeStep === step.id;
              const isPassed = activeStep >= step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className={`pipeline-node-box ${isCurrent && isRunning ? 'running' : ''} ${isPassed ? 'completed' : ''}`}>
                    <div className="p-node-header">
                      <span className="p-node-badge">{step.badge}</span>
                      <span className={`p-status-dot ${isPassed ? 'success' : ''} ${isCurrent && isRunning ? 'pulsing' : ''}`}></span>
                    </div>
                    <div className="p-node-title">{step.node}</div>
                    <div className="p-node-step">{step.title}</div>
                    <p className="p-node-desc">{step.desc}</p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className={`pipeline-arrow ${activeStep > step.id ? 'active' : ''}`}>
                      <span className="arrow-line"></span>
                      <span className="arrow-head">▶</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Features del formateo batchUpdate API */}
          <div className="pipeline-format-specs">
            <h4 className="format-specs-title">
              <span>✦</span> Reglas de Formato QA Aplicadas Automáticamente (batchUpdate API)
            </h4>
            <div className="format-grid">
              <div className="format-pill-item">
                <span className="check-icon">✓</span>
                <strong>Encabezado temático pastel:</strong> Tono suave asignado dinámicamente según el módulo funcional.
              </div>
              <div className="format-pill-item">
                <span className="check-icon">✓</span>
                <strong>Bordes automáticos:</strong> Cuadrícula formal sólida `#e2e8f0` para legibilidad ejecutiva.
              </div>
              <div className="format-pill-item">
                <span className="check-icon">✓</span>
                <strong>Anchos por columna optimizados:</strong> Auto-dimensionamiento en píxeles para evitar textos truncados.
              </div>
              <div className="format-pill-item">
                <span className="check-icon">✓</span>
                <strong>Zebra striping dinámico:</strong> Alternancia sutil de color de fondo entre filas para facilitar la lectura.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
