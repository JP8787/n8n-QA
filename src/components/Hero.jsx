import React from 'react';

export default function Hero({ onOpenDemo, onOpenSheet, onScrollToTest }) {
  return (
    <section className="hero-container" id="top">
      {/* Painted landscape frame blending seamlessly into white background */}
      <div className="hero-visual-frame">
        <img 
          src="/hero_landscape.jpg" 
          alt="Paisaje al óleo impresionista con cielo pastel y lago sereno" 
          className="hero-landscape-image"
          loading="eager"
        />
      </div>

      {/* Hero Content overlaid and centered in the seamless white transition */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          <span>Automatización Inteligente QA · BDD a Google Sheets</span>
        </div>

        <h1 className="hero-headline">
          De Requerimientos a Matrices de Pruebas QA Profesionales en Segundos.
        </h1>

        <p className="hero-subtitle">
          Automatización de extremo a extremo con <strong>n8n</strong>, Modelos de Lenguaje (<strong>Gemini / OpenRouter</strong>) y <strong>Google Sheets API</strong> para diseñar, estructurar y dar formato corporativo a casos de prueba sin trabajo manual.
        </p>

        <div className="hero-actions">
          <button 
            type="button" 
            className="pill-button pill-button-primary"
            onClick={onScrollToTest}
          >
            Probar Automatización
          </button>
          <button 
            type="button" 
            className="pill-button pill-button-secondary"
            onClick={onOpenSheet}
          >
            Ver Hoja de Cálculo en Vivo
          </button>
        </div>
      </div>
    </section>
  );
}
