import React from 'react';

export default function Footer({ onOpenDemo, onOpenSheet }) {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="brand-logo">
              <span className="brand-icon">✳</span>
              <span>n8n QA Matrix</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px' }}>
              Automatización Inteligente de Matrices de Pruebas QA (BDD a Google Sheets). Diseñado con n8n, Gemini API y Google Sheets API v4.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot"></span>
              <span>Pipeline n8n operativo · batchUpdate Sheets API conectado</span>
            </div>
          </div>

          <div className="footer-nav">
            <a href="#top">Inicio</a>
            <a href="#problema-solucion">Problema vs Solución</a>
            <a href="#arquitectura">Arquitectura</a>
            <a href="#estandar-11-col">11 Columnas</a>
            <a href="#como-probarlo">¿Cómo Probarlo?</a>
            <a href="#stack">Stack</a>
            <button 
              type="button"
              onClick={onOpenSheet}
              style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}
            >
              Ver Hoja en Vivo
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Automatización Inteligente de Matrices QA. Construido sobre n8n.</span>
          <span>Google Sheets API v4 & Gemini 1.5/2.0 Integration.</span>
        </div>
      </div>
    </footer>
  );
}
