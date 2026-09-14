import React, { useState, useEffect } from 'react';

export default function Navbar({ onScrollToTest }) {
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
          <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <circle cx="6" cy="12" r="3.5" fill="#ea4b71" />
            <circle cx="18" cy="12" r="3.5" fill="#ea4b71" />
            <path d="M9.5 12h5" stroke="#ea4b71" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>n8n QA Matrix</span>
        </a>

        <nav>
          <ul className="nav-links">
            <li><a href="#problema-solucion" className="nav-link">Problema vs Solución</a></li>
            <li><a href="#arquitectura" className="nav-link">Pipeline Técnico</a></li>
            <li><a href="#estandar-11-col" className="nav-link">Matriz 11 Columnas</a></li>
            <li><a href="#como-probarlo" className="nav-link">Probar Automatización</a></li>
            <li><a href="#stack" className="nav-link">Stack Tecnológico</a></li>
          </ul>
        </nav>

        <div>
          <button 
            type="button" 
            className="btn-n8n-nav"
            onClick={onScrollToTest}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Probar Webhook n8n</span>
          </button>
        </div>
      </div>
    </header>
  );
}
