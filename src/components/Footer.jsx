import React from 'react';

export default function Footer({ onScrollToTest }) {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="brand-logo">
              <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <circle cx="6" cy="12" r="3.5" fill="#ea4b71" />
                <circle cx="18" cy="12" r="3.5" fill="#ea4b71" />
                <path d="M9.5 12h5" stroke="#ea4b71" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span>n8n QA Matrix Automation</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '460px' }}>
              Automatización Inteligente de Matrices de Pruebas QA (BDD a Google Sheets). Diseñado con n8n, Gemini API y Google Sheets API v4.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot"></span>
              <span>Pipeline n8n configurado · Endpoint HTTP POST listo</span>
            </div>
          </div>

          <div className="footer-nav">
            <a href="#top">Inicio</a>
            <a href="#problema-solucion">Problema vs Solución</a>
            <a href="#arquitectura">Arquitectura n8n</a>
            <a href="#estandar-11-col">11 Columnas</a>
            <a href="#como-probarlo">Probar Webhook</a>
            <a href="#stack">Stack Tecnológico</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Automatización Inteligente de Matrices QA. Construido sobre n8n.</span>
          <span>Google Sheets API v4 batchUpdate & Gemini 1.5/2.0 Integration.</span>
        </div>
      </div>
    </footer>
  );
}
