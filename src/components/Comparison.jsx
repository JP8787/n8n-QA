import React from 'react';

export default function Comparison() {
  const comparisons = [
    {
      title: 'Velocidad de Creación',
      before: 'Redacción manual de casos escenario por escenario (4 a 6 horas por módulo).',
      after: 'Generación instantánea en segundos a partir de requerimientos o historias BDD.',
      metricBefore: '4 - 6 Horas',
      metricAfter: '< 15 Segundos'
    },
    {
      title: 'Estructura de la Matriz',
      before: 'Inconsistencia en la nomenclatura, columnas faltantes o variables según el tester.',
      after: 'Estándar formal inmutable de 11 columnas con pasos numerados y pre/postcondiciones.',
      metricBefore: 'Disperso',
      metricAfter: '11 Cols Oficiales'
    },
    {
      title: 'Formato y Legibilidad',
      before: 'Formato plano en Excel: texto cortado, sin autoajuste, celdas desordenadas.',
      after: 'Diseño visual corporativo automático: anchos ajustados, texto multilínea (wrap) y bordes.',
      metricBefore: 'Desordenado',
      metricAfter: 'batchUpdate API'
    },
    {
      title: 'Identidad por Módulo',
      before: 'Monotonía visual; hojas difíciles de auditar o distinguir entre proyectos.',
      after: 'Paletas temáticas en tonos pastel por módulo con alternancia de filas (zebra striping).',
      metricBefore: 'Monótono',
      metricAfter: 'Paleta Dinámica'
    }
  ];

  return (
    <section className="comparison-section" id="problema-solucion">
      <div className="container">
        <div className="section-header-center">
          <span className="section-kicker">Transformación Operativa</span>
          <h2 className="section-title">El Problema vs. La Solución</h2>
          <p className="section-subtitle">
            Cómo la orquestación en n8n erradica la fricción manual y establece un estándar corporativo de QA instantáneo.
          </p>
        </div>

        {/* Contenedor Comparativo en Tarjetas de Alto Impacto */}
        <div className="comparison-duel-grid">
          {/* Tarjeta 1: Antes (Manual) */}
          <div className="duel-card before-card">
            <div className="duel-card-header">
              <div className="duel-badge before-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>Antes · Proceso Manual Tradicional</span>
              </div>
              <h3 className="duel-card-title">Cuellos de Botella y Fricción</h3>
              <p className="duel-card-desc">Trabajo artesanal propenso a omisiones que ralentiza el ciclo de QA.</p>
            </div>

            <div className="duel-points-list">
              {comparisons.map((c, i) => (
                <div key={i} className="duel-point-item before-item">
                  <div className="point-icon-box">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  <div className="point-text-box">
                    <strong className="point-heading">{c.title}</strong>
                    <p className="point-p">{c.before}</p>
                    <span className="point-tag tag-pain">{c.metricBefore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta 2: Con esta Solución (Automatizado en n8n) */}
          <div className="duel-card after-card">
            <div className="duel-card-header">
              <div className="duel-badge after-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Con esta Solución · Automatización n8n</span>
              </div>
              <h3 className="duel-card-title">Ingeniería QA Automatizada</h3>
              <p className="duel-card-desc">Entrega sistemática de matrices listas para auditoría con cero esfuerzo manual.</p>
            </div>

            <div className="duel-points-list">
              {comparisons.map((c, i) => (
                <div key={i} className="duel-point-item after-item">
                  <div className="point-icon-box success">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="point-text-box">
                    <strong className="point-heading">{c.title}</strong>
                    <p className="point-p">{c.after}</p>
                    <span className="point-tag tag-gain">{c.metricAfter}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen de Impacto */}
        <div className="comparison-impact-banner">
          <div className="impact-stat">
            <span className="stat-number">95%</span>
            <span className="stat-label">Reducción en tiempo de diseño QA</span>
          </div>
          <div className="impact-divider"></div>
          <div className="impact-stat">
            <span className="stat-number">11/11</span>
            <span className="stat-label">Columnas normalizadas sin excepción</span>
          </div>
          <div className="impact-divider"></div>
          <div className="impact-stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Compatibilidad con Google Sheets API</span>
          </div>
        </div>
      </div>
    </section>
  );
}
