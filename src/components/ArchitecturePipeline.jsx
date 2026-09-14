import React, { useState } from 'react';

export default function ArchitecturePipeline() {
  const [activeStep, setActiveStep] = useState(5);
  const [isRunning, setIsRunning] = useState(false);

  const handleSimulate = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);

    const delays = [700, 1500, 2300, 3100, 4000];
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
            Orquestación serverless que conecta modelos de lenguaje con la API oficial de Google Sheets sin trabajo manual.
          </p>
        </div>

        <div className="pipeline-card">
          <div className="pipeline-top-bar">
            <div>
              <h3 className="pipeline-heading">Flujo de Procesamiento (BDD a Google Sheets)</h3>
              <p className="pipeline-subheading">Visualiza cómo viajan los datos desde los requerimientos brutos hasta la hoja formateada.</p>
            </div>
            <button 
              type="button" 
              className="btn-n8n-simulate"
              onClick={handleSimulate}
              disabled={isRunning}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>{isRunning ? 'Ejecutando Flujo...' : 'Simular Pipeline'}</span>
            </button>
          </div>

          {/* Diagrama de Árbol / Pipeline */}
          <div className="pipeline-tree-wrapper">
            {/* Nodo 1: Ingesta */}
            <div className={`tree-node-card ${activeStep >= 1 ? 'completed' : ''} ${activeStep === 1 && isRunning ? 'running' : ''}`}>
              <div className="t-node-header">
                <span className="t-node-badge">Entrada</span>
                <span className="t-node-dot"></span>
              </div>
              <h4 className="t-node-title">Formulario / Archivo de Requerimientos</h4>
              <p className="t-node-desc">Captura documentos .docx, .pdf, .txt o criterios de aceptación en texto plano.</p>
            </div>

            <div className={`tree-connector-v ${activeStep > 1 ? 'active' : ''}`}>
              <span className="v-line"></span>
              <span className="v-arrow">▼</span>
            </div>

            {/* Nodo 2: Motor IA */}
            <div className={`tree-node-card ${activeStep >= 2 ? 'completed' : ''} ${activeStep === 2 && isRunning ? 'running' : ''}`}>
              <div className="t-node-header">
                <span className="t-node-badge ai">Motor IA Dual</span>
                <span className="t-node-dot"></span>
              </div>
              <h4 className="t-node-title">Gemini 1.5/2.0 + Fallback OpenRouter</h4>
              <p className="t-node-desc">Descompone lógica funcional en escenarios BDD (Dado / Cuando / Entonces) con alta resiliencia.</p>
            </div>

            <div className={`tree-connector-v ${activeStep > 2 ? 'active' : ''}`}>
              <span className="v-line"></span>
              <span className="v-arrow">▼</span>
            </div>

            {/* Nodo 3: Parser Universal */}
            <div className={`tree-node-card ${activeStep >= 3 ? 'completed' : ''} ${activeStep === 3 && isRunning ? 'running' : ''}`}>
              <div className="t-node-header">
                <span className="t-node-badge logic">Lógica de Datos</span>
                <span className="t-node-dot"></span>
              </div>
              <h4 className="t-node-title">Parser Universal BDD (JSON Sanitizer)</h4>
              <p className="t-node-desc">Extracción de JSON, sanitización estricta y ordenamiento de pasos numerados.</p>
            </div>

            <div className={`tree-connector-fork ${activeStep > 3 ? 'active' : ''}`}>
              <div className="fork-line-left"></div>
              <div className="fork-line-center"></div>
              <div className="fork-line-right"></div>
            </div>

            {/* Nodos 4 en Paralelo: Create Sheet & Sync */}
            <div className="tree-parallel-row">
              <div className={`tree-node-card sub-card ${activeStep >= 4 ? 'completed' : ''} ${activeStep === 4 && isRunning ? 'running' : ''}`}>
                <div className="t-node-header">
                  <span className="t-node-badge sheets">Google Sheets API</span>
                  <span className="t-node-dot"></span>
                </div>
                <h4 className="t-node-title">Create Sheet (Pestaña nueva)</h4>
                <p className="t-node-desc">Crea una pestaña temática nombrada con el módulo y timestamp de ejecución.</p>
              </div>

              <div className={`tree-node-card sub-card ${activeStep >= 4 ? 'completed' : ''} ${activeStep === 4 && isRunning ? 'running' : ''}`}>
                <div className="t-node-header">
                  <span className="t-node-badge sheets">Google Sheets API</span>
                  <span className="t-node-dot"></span>
                </div>
                <h4 className="t-node-title">Google Sheets Sync (11 Columnas)</h4>
                <p className="t-node-desc">Inserción masiva de filas estructuradas en el esquema oficial de la matriz.</p>
              </div>
            </div>

            <div className={`tree-connector-merge ${activeStep > 4 ? 'active' : ''}`}>
              <div className="merge-line-left"></div>
              <div className="merge-line-center"></div>
              <div className="merge-line-right"></div>
              <span className="v-arrow">▼</span>
            </div>

            {/* Nodo 5: batchUpdate API Formato */}
            <div className={`tree-node-card final-node ${activeStep >= 5 ? 'completed' : ''} ${activeStep === 5 && isRunning ? 'running' : ''}`}>
              <div className="t-node-header">
                <span className="t-node-badge style">Formateo batchUpdate API</span>
                <span className="t-node-dot"></span>
              </div>
              <h4 className="t-node-title">Aplicar Formato QA Corporativo</h4>
              <p className="t-node-desc">Llamada batchUpdate de Google Sheets que aplica de forma atómica todas las reglas visuales.</p>

              <div className="final-specs-list">
                <span className="spec-tag">Encabezado temático pastel</span>
                <span className="spec-tag">Bordes automáticos sólidos</span>
                <span className="spec-tag">Anchos de columna optimizados</span>
                <span className="spec-tag">Zebra striping dinámico</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
