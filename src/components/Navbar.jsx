import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenDemo, onOpenSheet }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <a href="#top" className="brand-logo">
          <span className="brand-icon">✳</span>
          <span>n8n QA Matrix</span>
        </a>

        <nav>
          <ul className="nav-links">
            <li><a href="#problema-solucion" className="nav-link">Problema vs Solución</a></li>
            <li><a href="#arquitectura" className="nav-link">Arquitectura</a></li>
            <li><a href="#estandar-11-col" className="nav-link">Matriz 11 Columnas</a></li>
            <li><a href="#como-probarlo" className="nav-link">¿Cómo Probarlo?</a></li>
            <li><a href="#stack" className="nav-link">Stack Tecnológico</a></li>
          </ul>
        </nav>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="pill-button pill-button-secondary"
            onClick={onOpenSheet}
            style={{ padding: '8px 16px', fontSize: '12.5px' }}
          >
            Ver Hoja en Vivo
          </button>
          <button 
            type="button" 
            className="pill-button pill-button-primary"
            onClick={onOpenDemo}
          >
            Probar Automatización
          </button>
        </div>
      </div>
    </header>
  );
}
