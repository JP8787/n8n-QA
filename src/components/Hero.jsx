import React from 'react';

export default function Hero({ onScrollToTest }) {
  const handleScrollToStandard = () => {
    const el = document.getElementById('estandar-11-col');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="n8n-hero-section" id="top">
      {/* Fondo de canvas con cuadrícula técnica de nodos */}
      <div className="hero-grid-pattern"></div>
      <div className="hero-radial-glow"></div>

      <div className="container hero-inner-container">
        {/* Badge superior oficial de n8n */}
        <div className="n8n-hero-pill">
          <span className="n8n-live-indicator">
            <span className="n8n-live-ping"></span>
            <span className="n8n-live-core"></span>
          </span>
          <span className="n8n-pill-text">Workflow de Automatización QA · BDD a Google Sheets en n8n</span>
        </div>

        {/* Título principal exacto solicitado */}
        <h1 className="hero-headline">
          De Requerimientos a Matrices de Pruebas QA Profesionales en Segundos.
        </h1>

        {/* Subtítulo oficial */}
        <p className="hero-subtitle">
          Automatización de extremo a extremo con <strong>n8n</strong>, Modelos de Lenguaje (<strong>Gemini / OpenRouter</strong>) y <strong>Google Sheets API</strong> para diseñar, estructurar y dar formato corporativo a casos de prueba sin trabajo manual.
        </p>

        {/* Botones de acción principales con SVG */}
        <div className="hero-actions">
          <button 
            type="button" 
            className="btn-n8n-primary"
            onClick={onScrollToTest}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Probar Automatización con Webhook</span>
          </button>
          <button 
            type="button" 
            className="btn-n8n-secondary"
            onClick={handleScrollToStandard}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span>Ver Estándar de 11 Columnas</span>
          </button>
        </div>

        {/* Visualizador del Canvas de Flujo n8n en Vivo */}
        <div className="hero-workflow-canvas">
          <div className="canvas-header-bar">
            <div className="canvas-window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="canvas-title">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#ea4b71">
                <circle cx="6" cy="12" r="3.5" fill="#ea4b71" />
                <circle cx="18" cy="12" r="3.5" fill="#ea4b71" />
                <path d="M9.5 12h5" stroke="#ea4b71" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span>workflow-qa-matrix-generator.json — n8n v1.80+</span>
            </div>
            <div className="canvas-status-tag">
              <span className="tag-dot"></span>
              <span>Activo · Escuchando</span>
            </div>
          </div>

          <div className="canvas-nodes-flow">
            {/* Nodo 1: Webhook */}
            <div className="canvas-node webhook-node">
              <div className="node-icon-box">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <div className="node-content">
                <span className="node-type">Webhook Trigger</span>
                <span className="node-name">POST /generar-qa</span>
              </div>
              <span className="node-port output"></span>
            </div>

            {/* Conector 1 */}
            <div className="node-wire active">
              <span className="wire-signal"></span>
            </div>

            {/* Nodo 2: Gemini */}
            <div className="canvas-node ai-node">
              <span className="node-port input"></span>
              <div className="node-icon-box">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="node-content">
                <span className="node-type">Google Gemini AI</span>
                <span className="node-name">Inferencia BDD QA</span>
              </div>
              <span className="node-port output"></span>
            </div>

            {/* Conector 2 */}
            <div className="node-wire active">
              <span className="wire-signal"></span>
            </div>

            {/* Nodo 3: Parser BDD */}
            <div className="canvas-node code-node">
              <span className="node-port input"></span>
              <div className="node-icon-box">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <div className="node-content">
                <span className="node-type">Node.js Code</span>
                <span className="node-name">Parser 11 Cols</span>
              </div>
              <span className="node-port output"></span>
            </div>

            {/* Conector 3 */}
            <div className="node-wire active">
              <span className="wire-signal"></span>
            </div>

            {/* Nodo 4: Google Sheets */}
            <div className="canvas-node sheets-node">
              <span className="node-port input"></span>
              <div className="node-icon-box">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <div className="node-content">
                <span className="node-type">Google Sheets API</span>
                <span className="node-name">batchUpdate & Sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
